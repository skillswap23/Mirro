import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Zap, TrendingUp, Check, Send, Building2 } from 'lucide-react';
import { ProLead } from '../types';

interface ProSectionProps {
  onProLeadAdded?: (lead: ProLead) => void;
}

export const ProSection: React.FC<ProSectionProps> = ({ onProLeadAdded }) => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType] = useState('hair');
  const [neighborhood, setNeighborhood] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    const newLead: ProLead = {
      id: 'pro-' + Date.now(),
      name,
      businessName,
      serviceType,
      neighborhood: neighborhood || 'Toronto, ON',
      email,
      phone,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSubmitted(true);
    if (onProLeadAdded) {
      onProLeadAdded(newLead);
    }
  };

  return (
    <section id="pro-section" className="py-16 sm:py-24 bg-[#F5EFEA] text-stone-900 relative overflow-hidden border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Pitch & Benefits */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium uppercase tracking-wider shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-stone-600" />
              For Stylists, Estheticians & Salons
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-stone-900 leading-tight">
              Turn empty slots into{' '}
              <span className="italic font-serif text-stone-600">
                guaranteed income
              </span>
            </h2>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed">
              Free to join. You get paid upfront for last-minute cancellations — whether the client shows up or not. No subscriptions or hidden fees.
            </p>

            {/* Benefit Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-stone-800 border border-stone-200 flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900">Paid Upfront Always</h4>
                <p className="text-xs text-stone-600 font-light mt-1">
                  Clients pay in full at booking through Stripe. Zero no-show risk for you.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-stone-800 border border-stone-200 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900">Fill Slots in Minutes</h4>
                <p className="text-xs text-stone-600 font-light mt-1">
                  When a client cancels, broadcast your slot instantly to hundreds of locals.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-stone-800 border border-stone-200 flex items-center justify-center mb-2">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900">Gain Loyal Regulars</h4>
                <p className="text-xs text-stone-600 font-light mt-1">
                  First-time flash deal clients convert into full-price repeat appointments.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-stone-800 border border-stone-200 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-stone-900">Zero Upfront Cost</h4>
                <p className="text-xs text-stone-600 font-light mt-1">
                  Free to list your business. We only keep a small commission when a slot sells.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stylist Sign Up Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm relative">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-stone-900">
                  Partner Stylist Application
                </h3>
                <p className="text-xs text-stone-500 font-light">Takes under 60 seconds • Instant onboard</p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-2xl font-medium text-stone-900">
                  Application Received!
                </h4>
                <p className="text-sm text-stone-600 max-w-sm mx-auto font-light">
                  Thanks {name}. Our Partner Specialist will reach out to <strong className="text-stone-900">{email}</strong> today to set up your free listing portal.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setBusinessName('');
                    setEmail('');
                    setPhone('');
                  }}
                  className="text-xs text-stone-900 underline font-medium pt-2"
                >
                  Submit another salon / partner
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name <span className="text-stone-900">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Antoine Laurent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Business / Salon Name <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maison de Beauté or Independent Professional"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Service Type <span className="text-stone-900">*</span>
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-[#FAF8F5] text-sm text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    >
                      <option value="hair">Hair Styling & Color</option>
                      <option value="nails">Nails & Manicure</option>
                      <option value="brows_lashes">Brows & Lashes</option>
                      <option value="skin_facials">Facials & Esthetics</option>
                      <option value="makeup">Makeup Artistry</option>
                      <option value="full_service">Full-Service Salon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City / Neighborhood <span className="text-stone-900">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yorkville, Toronto"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address <span className="text-stone-900">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="antoine@salon.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number <span className="text-stone-900">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(416) 321-9876"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-medium text-xs tracking-wide bg-stone-900 text-white shadow-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Join The Mirro Pro Network
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
