import React from 'react';
import { ArrowDown, ShieldCheck, MapPin, Zap, Bell, Calendar } from 'lucide-react';
import { SiteConfig } from '../types';
import heroImage from '../assets/images/mirro_hero_banner_1785860211353.jpg';

interface HeroProps {
  config: SiteConfig;
}

export const Hero: React.FC<HeroProps> = ({ config }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-[#FAF8F5] text-stone-900 py-16 sm:py-24 lg:py-28">
      {/* Background Image with Soft Light Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src={heroImage}
          alt="Luxury beauty salon interior"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-[#FAF8F5]/40" />
      </div>

      {/* Subtle Warm Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F2E8DF]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#EFE8DF]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Flash Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-stone-200/80 text-stone-700 text-xs sm:text-sm font-medium mb-6 shadow-sm backdrop-blur-sm animate-fadeIn">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-700"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-stone-700 fill-stone-700" />
          <span className="tracking-wide">Flash Cancellation Deals • Canada</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-stone-900 max-w-4xl mx-auto">
          Canceled Appointments.{' '}
          <span className="italic font-serif text-stone-600 block sm:inline">
            Top Stylists.
          </span>{' '}
          One Community.
        </h1>

        {/* Kitchenly-Style Narrative Writeup */}
        <div className="mt-8 text-base sm:text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-light space-y-4 text-left sm:text-center">
          <p>
            The Mirro is a neighbourhood marketplace for last-minute beauty appointments. We connect beauty lovers with talented local stylists and top salons filling last-minute canceled openings at discounted rates — the kind of premium appointments that are usually booked weeks in advance.
          </p>
          <p>
            Discover flash openings from specialists in your area, or turn your salon's canceled slots into filled chairs. One community, built around real artistry and the real beauty professionals who create it.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => scrollTo('deals')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 text-white font-medium text-sm sm:text-base shadow-sm hover:bg-stone-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group tracking-wide"
          >
            <Calendar className="w-4 h-4 text-stone-300" />
            See Today's Deals
            <ArrowDown className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform text-stone-300" />
          </button>

          <button
            onClick={() => scrollTo('client-signup')}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-stone-800 font-medium text-sm sm:text-base border border-stone-200/90 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Bell className="w-4 h-4 text-stone-600" />
            Get SMS Opening Alerts
          </button>
        </div>

        {/* Trust & Guarantee Highlights */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-stone-200/70 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm text-stone-600 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 bg-white/80 py-2.5 px-3 rounded-xl border border-stone-200/80 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
            <span>Guaranteed Spot</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/80 py-2.5 px-3 rounded-xl border border-stone-200/80 shadow-sm">
            <Zap className="w-4 h-4 text-stone-700 shrink-0" />
            <span>Instant Confirmation</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/80 py-2.5 px-3 rounded-xl border border-stone-200/80 shadow-sm">
            <MapPin className="w-4 h-4 text-stone-700 shrink-0" />
            <span>Top Canadian Salons</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/80 py-2.5 px-3 rounded-xl border border-stone-200/80 shadow-sm col-span-2 md:col-span-1">
            <span className="text-stone-900 font-bold">100%</span>
            <span>Zero Cash At Salon</span>
          </div>
        </div>
      </div>
    </section>
  );
};
