import React from 'react';
import { Mail, Lock, ShieldCheck, Heart } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onOpenAdmin: () => void;
  isAdminAuthenticated: boolean;
  onOpenPrivacy?: () => void;
  onOpenLegalModal?: (defaultTab?: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenAdmin,
  isAdminAuthenticated,
  onOpenPrivacy,
  onOpenLegalModal,
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F5] text-stone-600 py-12 border-t border-stone-200/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-200">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-lg font-normal text-stone-900 uppercase">
                {config.brandName || 'THE MIRRO'}
              </span>
            </div>
            <p className="text-stone-600 text-xs max-w-sm leading-relaxed font-light">
              The last-minute flash marketplace for beauty services across Canada. Connecting canceled appointments with customers looking for them at discounted rate.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-stone-600 font-light">
              <li>
                <a href="#deals" className="hover:text-stone-900 transition-colors">
                  Today's Live Deals Board
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-stone-900 transition-colors">
                  How The Mirro Works
                </a>
              </li>
              <li>
                <a href="#client-signup" className="hover:text-stone-900 transition-colors">
                  Get SMS Deal Drops
                </a>
              </li>
              <li>
                <a href="#pro-section" className="hover:text-stone-900 transition-colors font-medium text-stone-800">
                  Are You a Beauty Professional?
                </a>
              </li>
            </ul>
          </div>

          {/* Dedicated Legal Column */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-bold text-stone-900 text-base tracking-tight mb-3">
              Legal
            </h4>
            <ul className="space-y-2.5 text-stone-700 font-normal">
              <li>
                <button
                  onClick={() => (onOpenLegalModal ? onOpenLegalModal('privacy') : onOpenPrivacy?.())}
                  className="hover:text-stone-900 hover:underline transition-colors text-left text-xs"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => (onOpenLegalModal ? onOpenLegalModal('terms') : onOpenPrivacy?.())}
                  className="hover:text-stone-900 hover:underline transition-colors text-left text-xs"
                >
                  Terms of service
                </button>
              </li>
              <li>
                <a
                  href="#policies"
                  className="hover:text-stone-900 hover:underline transition-colors block text-xs"
                >
                  Terms of use
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-3">
              Get in Touch
            </h4>
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-stone-800">
                <Mail className="w-4 h-4 text-stone-600 shrink-0" />
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="font-medium hover:text-stone-900 text-sm underline"
                >
                  {config.contactEmail}
                </a>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                Questions, partnership inquiries, or custom salon integration support.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-light transition-colors py-1 px-2.5 rounded-lg border border-stone-200/60 bg-white/60 hover:bg-white"
              >
                <Lock className="w-3 h-3 text-stone-500" />
                <span>{isAdminAuthenticated ? 'Owner Admin Portal (Unlocked)' : 'Owner Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px] font-light">
          <p>© {year} {config.brandName}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-stone-600 fill-stone-400 inline" />
            <span>for beauty pros</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
