import React from 'react';
import { ShieldCheck, CreditCard, XCircle, Gift, Info } from 'lucide-react';
import { SiteConfig } from '../types';

interface PolicySectionProps {
  config: SiteConfig;
}

export const PolicySection: React.FC<PolicySectionProps> = ({ config }) => {
  return (
    <section id="policies" className="py-16 sm:py-24 bg-[#FAF8F5] text-stone-900 border-t border-stone-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            Transparent & Plain Language
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            Booking & Payment <span className="italic font-serif text-stone-600">Policy</span>
          </h2>
          <p className="mt-2 text-stone-600 text-sm font-light">
            Our strict rules protect stylists while offering customers unbeatable flash prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Policy Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-2">
                Paid in Full At Booking
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                All flash deals are paid in full at time of booking through Stripe right after selecting your time slot on Calendly.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              ✓ Zero card transactions required at salon
            </div>
          </div>

          {/* Policy Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center mb-4">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-2">
                Non-Refundable & Final
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Deals are non-refundable and cannot be rescheduled — this guarantees our stylists get paid for their time, no matter what.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              ✓ Guaranteed earnings for beauty pros
            </div>
          </div>

          {/* Policy Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center mb-4">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-2">
                Goodwill Credit Option
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Didn't make it? You'll get credit toward your next flash deal booking so your money is never completely lost.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              ✓ Automatic goodwill credit voucher
            </div>
          </div>
        </div>

        {/* Integration Architecture Explanation Note */}
        <div className="mt-8 bg-white rounded-2xl p-5 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-light">
            <strong className="text-stone-900 font-medium">Technical Integration Workflow:</strong> The "Claim this deal" buttons link directly to Calendly time selection pages. Calendly is configured to forward directly to a matching Stripe Payment Link upon slot selection, creating an integrated booking + payment flow before appointment confirmation.
          </div>
        </div>
      </div>
    </section>
  );
};
