import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // sends to company@atlassynapseai.com
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
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p style="font-size:12px;color:#475569;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact email error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
