'use client'

import { ContactSection } from '@/components/sections/ContactSection'

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/30 bg-atlas-primary/10 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-atlas-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">Get in Touch</span>
        </div>
        <h1
          className="text-5xl md:text-6xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            paddingBottom: '0.15em',
            lineHeight: '1.2',
          }}
        >
          Contact Us
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto">
          Questions about AI governance, enterprise pricing, or just want to say hello — we're here.
        </p>
      </div>

      {/* Full Contact Section with all fields */}
      <div className="max-w-6xl mx-auto px-4">
        <ContactSection />
      </div>
    </div>
  )
}
