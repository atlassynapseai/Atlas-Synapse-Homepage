import { NextRequest, NextResponse } from 'next/server'
import { createTransporter } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ ok: true }) // silent fail — email not configured
  }

  try {
    const { name, email, phone, company, jobTitle, provider } = await request.json()

    const transporter = createTransporter()
    const firstName = name ? name.split(' ')[0] : 'there'

    // 1. Notify team of new signup
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

    // 2. Send welcome email to the new user
    if (email) {
      await transporter.sendMail({
        from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Welcome to Atlas Synapse, ${firstName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#e2e8f0;border-radius:16px;overflow:hidden;">

            <div style="background:linear-gradient(135deg,#a855f7,#ec4899);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Welcome to Atlas Synapse</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">The Sovereign Standard for Enterprise Security</p>
            </div>

            <div style="padding:32px;">
              <p style="font-size:16px;color:#cbd5e1;margin-top:0;">Hi ${firstName},</p>
              <p style="font-size:15px;color:#94a3b8;line-height:1.7;">
                Your account is ready. You now have access to <strong style="color:#a855f7;">Aegis Prime Auditor</strong> — our AI-powered security scanner that analyses your code for vulnerabilities, hardcoded secrets, compliance violations, and more.
              </p>

              <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px;margin:24px 0;">
                <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#a855f7;text-transform:uppercase;letter-spacing:1px;">Get started in 3 steps</p>

                <div style="display:flex;gap:16px;margin-bottom:16px;align-items:flex-start;">
                  <div style="width:28px;height:28px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;color:#fff;font-weight:700;font-size:13px;line-height:28px;text-align:center;flex-shrink:0;">1</div>
                  <div>
                    <p style="margin:0 0 4px;font-weight:600;color:#e2e8f0;font-size:14px;">Run your free AI audit</p>
                    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Upload your code files and get a full security report in under 60 seconds.</p>
                  </div>
                </div>

                <div style="display:flex;gap:16px;margin-bottom:16px;align-items:flex-start;">
                  <div style="width:28px;height:28px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;color:#fff;font-weight:700;font-size:13px;line-height:28px;text-align:center;flex-shrink:0;">2</div>
                  <div>
                    <p style="margin:0 0 4px;font-weight:600;color:#e2e8f0;font-size:14px;">View your results</p>
                    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Log in to your dashboard to see your audit history, compliance assessment, and detailed findings.</p>
                  </div>
                </div>

                <div style="display:flex;gap:16px;align-items:flex-start;">
                  <div style="width:28px;height:28px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;color:#fff;font-weight:700;font-size:13px;line-height:28px;text-align:center;flex-shrink:0;">3</div>
                  <div>
                    <p style="margin:0 0 4px;font-weight:600;color:#e2e8f0;font-size:14px;">Download your report</p>
                    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Export as PDF, Markdown, or JSON to share with your team and stakeholders.</p>
                  </div>
                </div>
              </div>

              <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;">
                <a href="https://atlassynapseai.com/Aegis-Prime-Auditor/"
                  style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
                  Run Free Audit →
                </a>
                <a href="https://atlassynapseai.com/dashboard"
                  style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#e2e8f0;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
                  Go to Dashboard →
                </a>
              </div>

              <p style="font-size:13px;color:#475569;line-height:1.6;">
                Questions or need help? Reply to this email or reach us at
                <a href="mailto:company@atlassynapseai.com" style="color:#a855f7;">company@atlassynapseai.com</a>
              </p>
            </div>

            <div style="border-top:1px solid #1e293b;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#334155;">© 2026 Atlas Synapse LLC. All rights reserved.</p>
              <p style="margin:4px 0 0;font-size:11px;color:#1e293b;">Powered by Semgrep · Gitleaks · Trivy · CodeQL · Google Gemini AI</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Notify signup error:', err)
    return NextResponse.json({ ok: true }) // non-critical — never block signup
  }
}
