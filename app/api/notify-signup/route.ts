import { NextRequest, NextResponse } from 'next/server'
import { createTransporter } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ ok: true }) // silent fail — email not configured
  }

  try {
    const { name, email, phone, company, jobTitle, provider } = await request.json()

    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `🆕 New Sign Up — ${name || email}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px;">
          <h2 style="color:#a855f7;margin-bottom:4px;">New User Sign Up</h2>
          <p style="color:#64748b;font-size:14px;margin-top:0;">Atlas Synapse — atlassynapseai.com</p>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <p><strong style="color:#94a3b8;">Name:</strong> ${name || '—'}</p>
          <p><strong style="color:#94a3b8;">Email:</strong> <a href="mailto:${email}" style="color:#a855f7;">${email}</a></p>
          ${phone ? `<p><strong style="color:#94a3b8;">Phone:</strong> ${phone}</p>` : ''}
          ${company ? `<p><strong style="color:#94a3b8;">Company:</strong> ${company}</p>` : ''}
          ${jobTitle ? `<p><strong style="color:#94a3b8;">Job Title:</strong> ${jobTitle}</p>` : ''}
          <p><strong style="color:#94a3b8;">Sign-up method:</strong> ${provider || 'email'}</p>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />
          <a href="https://atlassynapseai.com/admin/users" style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:600;font-size:14px;padding:10px 20px;border-radius:8px;text-decoration:none;">View All Users →</a>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Notify signup error:', err)
    return NextResponse.json({ ok: true }) // non-critical — never block signup
  }
}
