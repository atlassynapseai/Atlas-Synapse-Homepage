import nodemailer from 'nodemailer'
import { PRICING_PLANS } from './pricing-plans'

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendWelcomeEmail(toEmail: string, planId: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return

  const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS] || PRICING_PLANS.standard

  const featuresHtml = plan.features
    .map(f => `<li style="margin-bottom:10px;color:#e2e8f0;list-style:none;display:flex;align-items:flex-start;gap:8px;"><span style="color:#a855f7;font-size:16px;">✓</span> ${f}</li>`)
    .join('')

  const skoolNote =
    plan.id === 'standard'
      ? 'Your 16-week AI Governance Roadmap will be drip-fed weekly — check your email each week for new content.'
      : plan.id === 'premium'
      ? 'You have instant access to the full 16-week AI Governance Roadmap — no waiting, dive in now.'
      : 'Your VIP onboarding team will reach out within 24 hours to schedule your first 1-on-1 session.'

  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Atlas Synapse" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to Atlas Synapse — Your ${plan.name} Plan is Active`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#e2e8f0;border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#a855f7,#ec4899);padding:40px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Welcome to Atlas Synapse</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Your ${plan.name} Plan is now active</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="font-size:16px;color:#cbd5e1;margin-top:0;">Hi there,</p>
          <p style="font-size:15px;color:#94a3b8;line-height:1.6;">
            Thank you for subscribing to the <strong style="color:#a855f7;">${plan.name} Plan</strong> ($${plan.price}/month).
            Here's everything included in your plan:
          </p>

          <!-- Features -->
          <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px;margin:24px 0;">
            <ul style="margin:0;padding:0;">
              ${featuresHtml}
            </ul>
          </div>

          <!-- Plan note -->
          <div style="background:#1e293b;border-left:3px solid #a855f7;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:28px;">
            <p style="margin:0;font-size:14px;color:#cbd5e1;">${skoolNote}</p>
          </div>

          <!-- CTAs -->
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;">
            <a href="https://atlas-synapse-homepage.vercel.app/dashboard"
              style="display:inline-block;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
              Go to Dashboard →
            </a>
            <a href="https://www.skool.com/atlas-synapse-ai-systems-9152/about"
              target="_blank"
              style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#e2e8f0;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">
              Join the Community →
            </a>
          </div>

          <p style="font-size:14px;color:#64748b;line-height:1.6;">
            Questions? Reply to this email or reach us at
            <a href="mailto:company@atlassynapseai.com" style="color:#a855f7;">company@atlassynapseai.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #1e293b;padding:20px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#475569;">© 2026 Atlas Synapse LLC. All rights reserved.</p>
        </div>
      </div>
    `,
  })
}
