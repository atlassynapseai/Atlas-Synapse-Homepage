import { NextRequest, NextResponse } from 'next/server'
import { createTransporter } from '@/lib/mailer'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per file
const MAX_TOTAL_SIZE = 20 * 1024 * 1024 // 20MB total
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'text/csv',
]

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const files = formData.getAll('files') as File[]

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    // Validate files
    let totalSize = 0
    const attachments: { filename: string; content: Buffer; contentType: string }[] = []

    for (const file of files) {
      if (!file.size) continue

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `File type not allowed: ${file.name}` }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large: ${file.name} (max 10MB per file)` }, { status: 400 })
      }
      totalSize += file.size
      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json({ error: 'Total attachment size exceeds 20MB' }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({ filename: file.name, content: buffer, contentType: file.type })
    }

    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: subject ? `[Contact] ${subject}` : `[Contact] Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#a855f7;margin-bottom:4px;">New Contact Form Submission</h2>
          <p style="color:#64748b;font-size:14px;margin-top:0;">Atlas Synapse — atlassynapseai.com</p>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p><strong style="color:#94a3b8;">Name:</strong> ${name}</p>
          <p><strong style="color:#94a3b8;">Email:</strong> <a href="mailto:${email}" style="color:#a855f7;">${email}</a></p>
          ${subject ? `<p><strong style="color:#94a3b8;">Subject:</strong> ${subject}</p>` : ''}
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p><strong style="color:#94a3b8;">Message:</strong></p>
          <p style="background:#1e293b;padding:16px;border-radius:8px;white-space:pre-wrap;">${message}</p>
          ${attachments.length > 0 ? `
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p><strong style="color:#94a3b8;">Attachments (${attachments.length}):</strong> ${attachments.map(a => a.filename).join(', ')}</p>
          ` : ''}
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="font-size:12px;color:#475569;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
