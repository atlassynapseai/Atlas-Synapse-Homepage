'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
  id?: string;
  onClick?: () => void;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  delay = 0,
  hoverEffect = false,
  id,
  onClick,
  glow = true
}) => {
  return (
    <motion.div
      id={id}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? {
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(0, 242, 255, 0.4)"
      } : {}}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-2xl
        border border-white/15 hover:border-cyan-400/30
        rounded-2xl p-8
        shadow-2xl shadow-black/60
        transition-all duration-300
        ${glow ? 'before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-r before:from-cyan-500/20 before:via-transparent before:to-white/10 before:-z-10' : ''}
        ${className}
      `}
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />

      {/* Glow effect on hover */}
      {glow && (
        <div className="absolute -inset-12 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {children}
    </motion.div>
  );
};
