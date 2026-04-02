import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  '10minutemail.com', 'yopmail.com', 'trashmail.com', 'maildrop.cc',
  'sharklasers.com', 'spam4.me', 'discard.email', 'mailnull.com',
  'spamgourmet.com', 'trashmail.net', 'filzmail.com', 'getonemail.com',
  'dispostable.com', 'tempinbox.com', 'nospam4.us', 'owlpic.com',
  'trashmail.at', 'trashmail.me', 'mt2015.com',
])

function validateEmail(email: string): string | null {
  if (!email?.trim()) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Invalid email format'
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  if (DISPOSABLE_DOMAINS.has(domain)) return 'Disposable email addresses are not accepted'
  return null
}

function validatePhone(phone: string): string | null {
  if (!phone?.trim()) return 'Phone number is required'
  const digits = phone.replace(/[\s\-().]/g, '')
  if (!/^\d{6,15}$/.test(digits)) return 'Invalid phone number (expected 6–15 digits)'
  return null
}

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()

    const name     = (formData.get('name')      as string) || ''
    const email    = (formData.get('email')     as string) || ''
    const dialCode = (formData.get('dialCode')  as string) || ''
    const phone    = (formData.get('phone')     as string) || ''
    const company  = (formData.get('company')   as string) || ''
    const subject  = (formData.get('subject')   as string) || ''
    const message  = (formData.get('message')   as string) || ''
    const how_heard = (formData.get('how_heard') as string) || ''
    const files    = formData.getAll('files') as File[]

    // Server-side validation
    if (!name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const emailErr = validateEmail(email)
    if (emailErr) return NextResponse.json({ error: emailErr }, { status: 400 })

    const phoneErr = validatePhone(phone)
    if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 })

    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Validate + buffer files
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
      attachments.push({ filename: file.name, content: Buffer.from(await file.arrayBuffer()), contentType: file.type })
    }

    const transporter = createTransporter()
    const fullPhone = dialCode ? `${dialCode} ${phone}` : phone
    const firstName = name.split(' ')[0]

    // Save to Supabase — non-blocking, never fail the request over this
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )
      supabase.from('contact_submissions').insert({
        name,
        email,
        dial_code: dialCode || null,
        phone: phone || null,
        company: company || null,
        subject: subject || null,
        message,
        how_heard: how_heard || null,
        attachment_names: attachments.length > 0 ? attachments.map(a => a.filename) : null,
      }).then(({ error }) => {
        if (error) console.error('Failed to save contact submission:', error.message)
      })
    }

    // 1. Notify team
    await transporter.sendMail({
      from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: subject ? `[Contact] ${subject}` : `[Contact] Message from ${name}`,
      attachments,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#a855f7;margin-bottom:4px;">New Contact Form Submission</h2>
          <p style="color:#64748b;font-size:14px;margin-top:0;">Atlas Synapse — atlassynapseai.com</p>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p><strong style="color:#94a3b8;">Name:</strong> ${name}</p>
          <p><strong style="color:#94a3b8;">Email:</strong> <a href="mailto:${email}" style="color:#a855f7;">${email}</a></p>
          <p><strong style="color:#94a3b8;">Phone:</strong> ${fullPhone || '—'}</p>
          ${company ? `<p><strong style="color:#94a3b8;">Company:</strong> ${company}</p>` : ''}
          ${subject ? `<p><strong style="color:#94a3b8;">Subject:</strong> ${subject}</p>` : ''}
          ${how_heard ? `<p><strong style="color:#94a3b8;">How they heard about us:</strong> ${how_heard}</p>` : ''}
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:13px;margin-bottom:8px;font-weight:600;">Message:</p>
          <div style="background:#1e293b;border-radius:8px;padding:16px;color:#cbd5e1;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</div>
          ${attachments.length > 0 ? `
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:13px;font-weight:600;">Attachments (${attachments.length}):</p>
          <ul style="color:#64748b;font-size:13px;">${attachments.map(a => `<li>${a.filename}</li>`).join('')}</ul>
          ` : ''}
        </div>
      `,
    })

    // 2. Auto-reply to sender
    await transporter.sendMail({
      from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `We received your message, ${firstName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#e2e8f0;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#a855f7,#ec4899);padding:36px 32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Message Received</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Thanks for reaching out to Atlas Synapse</p>
          </div>
          <div style="padding:32px;">
            <p style="font-size:15px;color:#cbd5e1;margin-top:0;">Hi ${firstName},</p>
            <p style="font-size:14px;color:#94a3b8;line-height:1.7;">
              We received your message and will get back to you within <strong style="color:#e2e8f0;">1–2 business days</strong>.
            </p>
            <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:20px;margin:20px 0;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#a855f7;text-transform:uppercase;letter-spacing:1px;">Your submission</p>
              ${subject ? `<p style="margin:0 0 6px;font-size:13px;color:#94a3b8;"><strong style="color:#e2e8f0;">Subject:</strong> ${subject}</p>` : ''}
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;"><strong style="color:#e2e8f0;">Message:</strong> ${message.length > 200 ? message.slice(0, 200) + '…' : message}</p>
            </div>
            <p style="font-size:13px;color:#475569;">
              In the meantime, you can explore what Atlas Synapse offers:
            </p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0 24px;">
              <a href="https://atlassynapseai.com/Aegis-Prime-Auditor/"
                style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:600;font-size:13px;padding:10px 20px;border-radius:8px;text-decoration:none;">
                Run Free Audit →
              </a>
              <a href="https://atlassynapseai.com/dashboard"
                style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#e2e8f0;font-weight:600;font-size:13px;padding:10px 20px;border-radius:8px;text-decoration:none;">
                View Dashboard →
              </a>
            </div>
            <p style="font-size:12px;color:#475569;">
              Reply to this email or contact us at
              <a href="mailto:company@atlassynapseai.com" style="color:#a855f7;">company@atlassynapseai.com</a>
            </p>
          </div>
          <div style="border-top:1px solid #1e293b;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#334155;">© 2026 Atlas Synapse LLC. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
