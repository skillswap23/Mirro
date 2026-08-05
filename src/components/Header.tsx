import React, { useState } from 'react';
import { Zap, Menu, X, ArrowRight, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
  onOpenConfig?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onOpenConfig }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 text-stone-900 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollTo('hero')}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-widest text-lg sm:text-xl font-normal text-stone-900 uppercase">
                  {config.brandName || 'THE MIRRO'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F5EFEA] text-stone-700 border border-stone-200/80">
                  FLASH
                </span>
              </div>
              <p className="text-[11px] text-stone-500 -mt-0.5 hidden sm:block font-light">
                Last-minute salon openings in Toronto • Up to {config.discountPercentage}% off
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-stone-600">
            <button
              onClick={() => scrollTo('deals')}
              className="hover:text-stone-900 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-stone-500" />
              Live Deals
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-stone-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('client-signup')}
              className="hover:text-stone-900 transition-colors"
            >
              SMS Alerts
            </button>
            <button
              onClick={() => scrollTo('pro-section')}
              className="hover:text-stone-900 transition-colors text-stone-600 font-medium"
            >
              For Stylists
            </button>
            <button
              onClick={() => scrollTo('policies')}
              className="hover:text-stone-900 transition-colors flex items-center gap-1 text-stone-500"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Policy
            </button>
          </nav>

          {/* Main Action CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollTo('deals')}
              className="px-5 py-2.5 rounded-full text-xs font-medium tracking-wide bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-1.5"
            >
              See Today's Deals
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-stone-700 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-stone-200/80 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <button
            onClick={() => scrollTo('deals')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-900 font-medium flex items-center justify-between"
          >
            <span>Live Deals Board</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-medium">
              {config.discountPercentage}% OFF
            </span>
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('client-signup')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
          >
            Get Deal SMS Alerts
          </button>
          <button
            onClick={() => scrollTo('pro-section')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
          >
            Are you a Beauty Professional?
          </button>
          <button
            onClick={() => scrollTo('policies')}
            className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 text-stone-600 text-sm"
          >
            Booking & Payment Policy
          </button>
          {onOpenConfig && (
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConfig();
                }}
                className="text-xs text-stone-600 hover:underline flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Configure Airtable / Calendly Embed URLs
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
