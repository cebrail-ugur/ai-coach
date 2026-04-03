'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

// Note: Metadata can't be in client component, moving to layout root

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/chat', label: 'Sohbet', icon: '💬' },
    { href: '/goals', label: 'Hedefler', icon: '🎯' },
    { href: '/habits', label: 'Alışkanlıklar', icon: '💪' },
    { href: '/checkin', label: 'Check-in', icon: '📝' },
    { href: '/analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f13] via-[#1a1a2e] to-[#0f0f13]">
      <nav className="border-b border-neutral-800 bg-black/40 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          {/* Desktop & Mobile Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">AI Koç</h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm lg:text-base px-2 py-1"
                >
                  <span className="hidden lg:inline">{link.label}</span>
                  <span className="lg:hidden">{link.icon}</span>
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button className="text-gray-400 hover:text-white">⚙️</button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white text-xl"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

            {/* Desktop Settings */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                ⚙️
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors px-3 py-2 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
