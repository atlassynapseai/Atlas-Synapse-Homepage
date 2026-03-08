'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [toggleActive, setToggleActive] = useState(false)

  useEffect(() => {
    // IntersectionObserver for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).style.opacity = '1'
            ;(entry.target as HTMLElement).style.transform = 'translateY(0) translateX(0)'
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      {/* Floating particles */}
      {[
        { top: '10%', left: '5%', size: 5, color: 'rgba(59,130,246,0.5)', duration: '10s', delay: '0s' },
        { top: '30%', right: '10%', size: 7, color: 'rgba(139,92,246,0.5)', duration: '14s', delay: '2s' },
        { bottom: '20%', left: '15%', size: 6, color: 'rgba(6,182,212,0.6)', duration: '12s', delay: '4s' },
        { top: '60%', right: '25%', size: 5, color: 'rgba(59,130,246,0.4)', duration: '18s', delay: '1s' },
        { bottom: '40%', left: '30%', size: 4, color: 'rgba(139,92,246,0.4)', duration: '13s', delay: '6s' },
        { top: '75%', right: '40%', size: 6, color: 'rgba(6,182,212,0.5)', duration: '16s', delay: '3s' },
      ].map((p, i) => (
        <div
          key={i}
          className="fixed rounded-full pointer-events-none z-0"
          style={{
            ...p,
            width: p.size, height: p.size,
            background: p.color,
            animation: `particleFloat ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Floating background orbs */}
      <div className="orb orb-purple" style={{ top: '-80px', left: '-80px' }} />
      <div className="orb orb-blue" style={{ bottom: '15%', right: '-60px' }} />
      <div className="orb orb-cyan" style={{ top: '45%', left: '35%' }} />

      {/* ───── NAVBAR ───── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(24px)' }}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 shrink-0 animate-glow-pulse" style={{ borderRadius: '10px' }}>
              <img src="/logo.png" alt="Atlas Synapse" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Atlas Synapse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {['About Us','Risks','Solutions','Pricing','Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(' ','-')}`}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-atlas-primary to-atlas-secondary group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="relative-sheen sheen rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-atlas-primary/40 transition-all hover:scale-105">
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ───── HERO ───── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-atlas-primary/30 bg-atlas-primary/10 px-4 py-1.5 mb-8 animate-fade-in-up">
            <span className="h-2 w-2 rounded-full bg-atlas-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-atlas-primary">Live Now — Trusted by AI Teams</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay:'0.1s', background:'linear-gradient(135deg,#fff 0%,#a855f7 55%,#ec4899 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Trust Engine for<br />AI Systems
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay:'0.2s' }}>
            Atlas Synapse is the trust layer for agentic AI — governance, verification, and auditability at the boundaries of your AI systems.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay:'0.3s' }}>
            <Link href="/signup" className="btn-primary inline-block">Get Started Free</Link>
            <Link href="/solutions" className="relative-sheen rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all hover:scale-105">
              See How It Works
            </Link>
          </div>
        </section>

        {/* ───── MISSION / VISION ───── */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-2">

            {/* Mission */}
            <article className="atlas-card p-6 sm:p-8 relative overflow-hidden"
              data-reveal
              style={{ opacity:0, transform:'translateY(20px)', transition:'opacity 0.8s ease, transform 0.8s ease' }}>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">Mission</h2>
                <p className="mt-4 text-slate-200 font-medium leading-relaxed text-lg">
                  Hold integrity at scale—sovereign, deterministic, and auditable AI infrastructure for regulated industries.
                </p>
                <p className="mt-2 text-slate-400 text-base leading-relaxed">Where compliance isn't optional, we make it provable.</p>
              </div>
              <div className="absolute right-4 bottom-4 w-32 h-32 opacity-40 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="arc-grad-m" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(168,85,247,0.5)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0.3)" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#arc-grad-m)" strokeWidth="1.2" strokeDasharray="4 3" style={{ transformOrigin:'50px 50px', animation:'spin 20s linear infinite' }} />
                  <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.8" />
                  <path d="M 50 8 L 50 50 L 92 50" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="4" fill="rgba(168,85,247,0.5)" />
                </svg>
              </div>
            </article>

            {/* Vision */}
            <article className="atlas-card p-6 sm:p-8 relative overflow-hidden"
              data-reveal
              style={{ opacity:0, transform:'translateY(20px)', transition:'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s' }}>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">Vision</h2>
                <p className="mt-4 text-slate-200 font-medium leading-relaxed text-lg">
                  Precision inspection at every boundary—signal-level scrutiny so every decision is traceable.
                </p>
                <p className="mt-2 text-slate-400 leading-relaxed">Cyber auditability and executive trust, built in.</p>
              </div>
              <div className="absolute right-4 bottom-4 w-32 h-32 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full absolute">
                  <circle cx="28" cy="50" r="10" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                  <circle cx="72" cy="50" r="10" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                  <line x1="38" y1="50" x2="62" y2="50" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
                </svg>
                <div className="absolute w-2 h-2 rounded-full animate-pulse"
                  style={{ background:'rgba(56,189,248,1)', left:'50%', top:'50%', marginLeft:'-22px', marginTop:'-4px', boxShadow:'0 0 12px rgba(56,189,248,0.8)' }} />
              </div>
            </article>
          </div>
        </section>

        {/* ───── PROBLEM BLAST ───── */}
        <section id="problem" className="px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-[0.45fr_1fr] gap-8 lg:gap-12 items-center">

              {/* Left text */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 leading-tight"
                  data-reveal style={{ opacity:0, transform:'translateY(10px)', transition:'opacity 0.8s ease, transform 0.8s ease' }}>
                  When trust fails,<br />damage compounds.
                </h2>
                <p className="mt-4 text-slate-400 text-lg"
                  data-reveal style={{ opacity:0, transform:'translateY(8px)', transition:'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s' }}>
                  Unchecked AI decisions don't fail once — they cascade.
                </p>
                <div className="mt-6"
                  data-reveal style={{ opacity:0, transition:'opacity 0.8s ease 0.2s' }}>
                  <Link href="/risks" className="inline-flex items-center gap-2 text-lg font-semibold text-atlas-secondary hover:text-atlas-primary transition-colors">
                    Explore Risks <span aria-hidden="true">→</span>
                  </Link>
                </div>
                {/* Toggle */}
                <div className="mt-6 flex items-center gap-3"
                  data-reveal style={{ opacity:0, transition:'opacity 0.8s ease 0.3s' }}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">No trust layer</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggleActive}
                    onClick={() => setToggleActive(!toggleActive)}
                    className="relative w-11 h-6 rounded-full border-2 transition-all duration-300 focus:outline-none"
                    style={{
                      borderColor: toggleActive ? 'rgba(168,85,247,0.8)' : 'rgba(100,116,139,0.6)',
                      background: toggleActive ? 'rgba(168,85,247,0.2)' : 'rgba(30,41,59,0.6)',
                    }}>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-300"
                      style={{
                        left: toggleActive ? '22px' : '2px',
                        background: toggleActive ? '#a855f7' : '#64748b',
                        boxShadow: toggleActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none',
                      }} />
                  </button>
                  <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${toggleActive ? 'text-atlas-primary' : 'text-slate-500'}`}>
                    Atlas gates active
                  </span>
                </div>
              </div>

              {/* Right: SVG spoke diagram */}
              <div className="relative w-full mx-auto"
                data-reveal
                style={{ height:'clamp(460px,58vh,640px)', opacity:0, transition:'opacity 0.9s ease 0.2s' }}>

                {/* SVG spokes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="spoke-threat" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={toggleActive ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.35)'} />
                      <stop offset="100%" stopColor={toggleActive ? 'rgba(52,211,153,0.45)' : 'rgba(248,113,113,0.7)'} />
                    </linearGradient>
                  </defs>
                  {[['50','50','50','0'],['50','50','100','50'],['50','50','50','100'],['50','50','0','50']].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#spoke-threat)" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transition:'stroke 0.6s ease' }} />
                  ))}
                </svg>

                {/* Cards grid */}
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns:'1fr minmax(90px,auto) 1fr', gridTemplateRows:'1fr minmax(60px,auto) 1fr', gridTemplateAreas:'". top ." "left center right" ". bottom ."', gap:'clamp(16px,3vw,36px)' }}>

                  {/* Center node */}
                  <div style={{ gridArea:'center' }} className="flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 px-3 py-2 bg-slate-900/95 text-center min-h-[56px] min-w-[80px]"
                      style={{ borderColor: toggleActive ? 'rgba(52,211,153,0.6)' : 'rgba(248,113,113,0.6)', boxShadow: toggleActive ? '0 0 20px rgba(52,211,153,0.2)' : '0 0 20px rgba(248,113,113,0.2)', transition:'all 0.6s ease' }}>
                      <span className="block text-xs font-bold uppercase tracking-wider leading-tight" style={{ color: toggleActive ? 'rgba(52,211,153,0.95)' : 'rgba(252,165,165,0.95)' }}>
                        {toggleActive ? 'Atlas Synapse' : 'Uncontrolled AI'}
                      </span>
                      <span className="block mt-0.5 text-[9px] leading-tight text-slate-500">
                        {toggleActive ? 'Trust enforced.' : 'One decision. Many consequences.'}
                      </span>
                    </div>
                  </div>

                  {/* Regulatory — top */}
                  {[
                    { area:'top', icon:'⚖️', label:'Regulatory', desc:'Audit findings and enforcement when decisions aren\'t traceable.', badge:'Regulator inquiry' },
                    { area:'right', icon:'📉', label:'Financial', desc:'Remediation costs and lost revenue scale with unchecked AI.', badge:'Chargebacks ↑' },
                    { area:'bottom', icon:'🛡️', label:'Trust', desc:'Public trust erodes when AI outputs are wrong or unverified.', badge:'Customer trust ↓' },
                    { area:'left', icon:'🔐', label:'Data', desc:'Sensitive data in prompts or outputs reaches the wrong systems.', badge:'PII exposure' },
                  ].map(({ area, icon, label, desc, badge }) => (
                    <div key={area} style={{ gridArea:area, borderColor: toggleActive ? 'rgba(52,211,153,0.35)' : 'rgba(248,113,113,0.35)', transition:'all 0.6s ease' }}
                      className="flex flex-col rounded-xl border-2 p-3 sm:p-4 bg-slate-900/95 shadow-lg min-h-[100px] w-full justify-self-center self-center max-w-xs">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: toggleActive ? 'rgba(167,243,208,0.95)' : 'rgba(252,165,165,0.95)' }}>{label}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug flex-1">{desc}</p>
                      <span className="inline-block mt-2 w-fit px-2 py-0.5 rounded text-[10px] font-medium border"
                        style={{ background: toggleActive ? 'rgba(6,78,59,0.6)' : 'rgba(69,10,10,0.6)', color: toggleActive ? 'rgba(110,231,183,0.9)' : 'rgba(252,165,165,0.9)', borderColor: toggleActive ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)', transition:'all 0.6s ease' }}>
                        {toggleActive ? '✅ Blocked' : badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── OFFERING ───── */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 items-center" style={{ minHeight:'clamp(380px,50vh,560px)' }}>

              {/* Left */}
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500"
                  data-reveal style={{ opacity:0, transform:'translateY(6px)', transition:'opacity 0.7s ease, transform 0.7s ease' }}>
                  What we offer
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-100"
                  data-reveal style={{ opacity:0, transform:'translateY(10px)', transition:'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>
                  One Trust Stack.
                </h2>
                <p className="mt-3 text-slate-400 text-base sm:text-lg leading-snug max-w-xs"
                  data-reveal style={{ opacity:0, transform:'translateY(6px)', transition:'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s' }}>
                  Govern policy. Validate inputs. Verify outputs.
                </p>
                <div className="mt-4"
                  data-reveal style={{ opacity:0, transition:'opacity 0.7s ease 0.2s' }}>
                  <Link href="/solutions" className="inline-flex items-center gap-2 text-base font-semibold text-atlas-secondary hover:text-atlas-primary transition-colors">
                    Explore Solutions <span>→</span>
                  </Link>
                </div>
                {/* Feature badges */}
                <div className="mt-6 grid grid-cols-2 gap-3"
                  data-reveal style={{ opacity:0, transition:'opacity 0.7s ease 0.25s' }}>
                  {[
                    { icon:'📜', label:'Audit Trail' },
                    { icon:'🛡️', label:'Policy Enforcement' },
                    { icon:'🎛️', label:'Input Controls' },
                    { icon:'✅', label:'Output Verification' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 hover:border-sky-500/30 hover:bg-slate-700/30 transition-all duration-300 cursor-default">
                      <span className="text-sm">{icon}</span>
                      <span className="text-xs font-medium text-slate-300 truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: 3D stacked cards + audit log */}
              <div className="relative" style={{ minHeight:'clamp(280px,40vh,440px)' }}>
                <div className="flex gap-6 items-center h-full">

                  {/* Stacked layer cards */}
                  <div className="flex-1 relative flex flex-col justify-center">
                    {/* SVG signal line */}
                    <svg className="absolute pointer-events-none" style={{ left:'-24px', width:'calc(100% + 48px)', top:'50%', height:'2px', zIndex:1 }} aria-hidden="true">
                      <defs>
                        <linearGradient id="signal-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(56,189,248,0)" />
                          <stop offset="20%" stopColor="rgba(56,189,248,0.3)" />
                          <stop offset="50%" stopColor="rgba(56,189,248,0.6)" />
                          <stop offset="80%" stopColor="rgba(56,189,248,0.3)" />
                          <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="1" x2="100%" y2="1" stroke="url(#signal-line-grad)" strokeWidth="2" />
                    </svg>

                    <div className="flex flex-col-reverse gap-0" style={{ zIndex:2, position:'relative' }}>
                      {[
                        { label:'Govern', sub:'Define policy once. Enforce everywhere.', icon:'📋', transform:'translateX(-8px) translateY(28px)', zIndex:0, delay:'0s' },
                        { label:'Validate', sub:'Mask, block, route risky inputs.', icon:'🔍', transform:'translateY(28px)', zIndex:1, delay:'0.1s' },
                        { label:'Verify', sub:'Score, redact, and log outputs.', icon:'✅', transform:'translateX(8px) translateY(28px)', zIndex:2, delay:'0.2s' },
                      ].map(({ label, sub, icon, transform, zIndex, delay }) => (
                        <div key={label}
                          data-reveal
                          style={{
                            opacity:0, transform, zIndex,
                            transition:`opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
                            height:'80px', minHeight:'80px', marginBottom:'-3px',
                            background:'linear-gradient(180deg,rgba(30,41,59,0.9) 0%,rgba(15,23,42,0.95) 100%)',
                            borderColor:'rgba(71,85,105,0.4)',
                            boxShadow:'0 6px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
                          }}
                          className="relative w-full flex items-center gap-4 rounded-md border px-5 py-4 cursor-default backdrop-blur-sm hover:border-slate-500/60 hover:shadow-xl transition-all duration-300 group">
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-500/35 to-transparent" />
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-700/50 text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">{label}</h3>
                            <p className="mt-0.5 text-xs text-slate-500 leading-snug">{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit log panel */}
                  <div className="hidden lg:flex flex-col shrink-0 relative" style={{ zIndex:4, width:'180px' }}>
                    <div className="absolute left-0 top-1/2 w-px -translate-y-1/2 bg-sky-500/30" style={{ height:'32px' }} />
                    <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm px-3 py-2.5 font-mono text-[10px] text-slate-400"
                      style={{ boxShadow:'0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                      <div className="text-slate-500 mb-2 text-[9px] uppercase tracking-widest">audit_log</div>
                      {[
                        ['policy_applied', '✅'],
                        ['pii_masked', '✅'],
                        ['output_scored', '0.94'],
                        ['audit_event_written', '✅'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 py-0.5">
                          <span className="text-slate-500 truncate">{k}:</span>
                          <span className="text-slate-400 shrink-0">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── FEATURES / TRUST STACK ───── */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12"
              data-reveal style={{ opacity:0, transform:'translateY(16px)', transition:'opacity 0.7s ease, transform 0.7s ease' }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">The AI Trust Stack</h2>
              <p className="text-slate-400 text-lg">Everything you need to govern, verify, and audit your AI systems</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon:'🛡️', title:'Governance', desc:'Policy validation and drift detection across your entire AI lifecycle. Enforce rules before they become incidents.', delay:'0s' },
                { icon:'✅', title:'Verification', desc:'Output validation, confidence scoring, and intelligent data redaction. Know that your AI is saying what it should.', delay:'0.1s' },
                { icon:'📋', title:'Auditability', desc:'Complete audit trails and evidence packages for compliance. Full transparency at every boundary of your AI systems.', delay:'0.2s' },
              ].map(({ icon, title, desc, delay }) => (
                <div key={title} className="atlas-card p-8"
                  data-reveal style={{ opacity:0, transform:'translateY(24px)', transition:`opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}` }}>
                  <div className="text-4xl mb-5 inline-block" style={{ animation:`bounce 2.5s ease-in-out infinite`, animationDelay:delay }}>{icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── PRICING ───── */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-14"
              data-reveal style={{ opacity:0, transform:'translateY(16px)', transition:'opacity 0.7s ease, transform 0.7s ease' }}>
              <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-slate-400">Choose the plan that fits your needs</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name:'Standard', price:'$100', desc:'For small teams', features:['Full Aegis Prime Auditor','Advanced reporting','Email support'], popular:false, delay:'0s' },
                { name:'Premium', price:'$300', desc:'For growing organizations', features:['All Standard features','Priority support','Custom integrations'], popular:true, delay:'0.1s' },
                { name:'VIP', price:'$1,500', desc:'Enterprise-grade', features:['All Premium features','Dedicated support','SLA guarantee'], popular:false, delay:'0.2s' },
              ].map(({ name, price, desc, features, popular, delay }) => (
                <div key={name} className="atlas-card p-8 relative"
                  data-reveal
                  style={{ opacity:0, transform:'translateY(24px)', transition:`opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`, ...(popular ? { borderColor:'rgba(168,85,247,0.4)' } : {}) }}>
                  {popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-atlas-primary to-atlas-secondary px-5 py-1.5 rounded-full shadow-lg shadow-atlas-primary/30">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className="text-slate-400 ml-2">/month</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-6">{desc}</p>
                  <Link href="/pricing"
                    className={`block w-full text-center rounded-xl px-4 py-2.5 font-semibold mb-6 transition-all duration-300 ${popular ? 'relative-sheen sheen bg-gradient-to-r from-atlas-primary to-atlas-secondary text-white hover:shadow-lg hover:shadow-atlas-primary/40' : 'border border-white/10 text-white hover:bg-white/10'}`}>
                    {popular ? 'Subscribe Now' : 'Learn More'}
                  </Link>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center"
              data-reveal style={{ opacity:0, transition:'opacity 0.7s ease 0.3s' }}>
              <Link href="/pricing" className="btn-primary inline-block">View All Plans</Link>
            </div>
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="atlas-card p-10 sm:p-14 text-center"
              data-reveal style={{ opacity:0, transform:'translateY(20px)', transition:'opacity 0.8s ease, transform 0.8s ease' }}>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4"
                style={{ background:'linear-gradient(135deg,#fff 0%,#a855f7 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Ready to Trust Your AI?
              </h2>
              <p className="text-slate-400 text-lg mb-8">Join teams using Atlas Synapse to govern and verify their AI systems at scale.</p>
              <Link href="/signup" className="btn-primary inline-block">Start Free Today</Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-slate-500 text-sm"
        style={{ background:'rgba(15,23,42,0.5)' }}>
        <p>© 2026 Atlas Synapse. All rights reserved.</p>
      </footer>
    </div>
  )
}
