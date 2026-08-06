import React from 'react';
import { CalendarX2, BellRing, CreditCard, ArrowRight, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: CalendarX2,
      title: 'A stylist has a cancellation',
      description: 'A top local beauty pro gets an unexpected last-minute opening or no-show.',
      highlight: 'Turned into a flash deal',
    },
    {
      number: '02',
      icon: BellRing,
      title: 'We notify people nearby',
      description: 'Nearby clients receive immediate SMS alerts about the steeply discounted appointment.',
      highlight: 'Up to 50% off regular price',
    },
    {
      number: '03',
      icon: CreditCard,
      title: 'Pay securely to lock in spot',
      description: 'Book and pay upfront online. No cash or card needed at the salon.',
      highlight: 'Guaranteed reservation',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#F7F4EF] border-t border-b border-stone-200/70 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            Simple 3-Step Process
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-900">
            How <span className="italic font-serif text-stone-600">The Mirro</span> Works
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light">
            Connecting canceled appointments with customers looking for them at discounted rate.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 hover:border-stone-300 shadow-sm transition-all flex flex-col justify-between group"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-stone-800 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-stone-800" />
                    </div>
                    <span className="font-serif text-3xl font-light text-stone-300 group-hover:text-stone-400 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-medium text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>

                {/* Step Footer Badge */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-700 font-medium bg-[#FAF8F5] px-3 py-1 rounded-full border border-stone-200/80">
                    {step.highlight}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-stone-400 hidden md:block group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Callout Bar */}
        <div className="mt-10 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              <span className="font-medium text-stone-900">Average savings: $85 – $180</span> per appointment. Same high-end products, top senior stylists.
            </p>
          </div>
          <a
            href="#deals"
            className="text-xs sm:text-sm font-medium text-stone-900 hover:text-stone-600 underline underline-offset-4 shrink-0 transition-colors"
          >
            Explore Today's Live Slots &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
