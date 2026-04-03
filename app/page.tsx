'use client';

import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { Portal } from '@/components/portal/Portal';
import { PricingSection } from '@/components/sections/PricingSection';
import { DashboardSection } from '@/components/sections/DashboardSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { AuthModal } from '@/components/sections/AuthModal';
import { HeroSection } from '@/components/sections/HeroSection';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const scrollTarget = searchParams.get('scroll');
  
  const portalRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Handle scroll to section on mount
  useEffect(() => {
    if (scrollTarget === 'portal' && portalRef.current) {
      setTimeout(() => portalRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (scrollTarget === 'dashboard' && dashboardRef.current) {
      setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (scrollTarget === 'pricing' && pricingRef.current) {
      setTimeout(() => pricingRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else if (scrollTarget === 'contact' && contactRef.current) {
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [scrollTarget]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-atlas-bg via-slate-900 to-atlas-elevated">
      <Navbar />

      {/* Hero/Brand Section */}
      <section id="hero">
        <HeroSection isLoggedIn={!!user} />
      </section>

      {/* Portal Section - Always shown if signed in */}
      {user && (
        <section id="portal" ref={portalRef} className="py-12">
          <Portal />
        </section>
      )}

      {/* Pricing Section - Show if not signed in or always visible */}
      <section id="pricing" ref={pricingRef} className="py-12">
        <PricingSection />
      </section>

      {/* Dashboard Section - Only shown if signed in */}
      {user && (
        <section id="dashboard" ref={dashboardRef} className="py-12">
          <DashboardSection />
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-12">
        <ContactSection />
      </section>

      {/* Auth Modal - Show if not signed in */}
      {!user && <AuthModal />}
    </main>
  );
}
