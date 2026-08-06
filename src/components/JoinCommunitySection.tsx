import React, { useState } from 'react';
import { BellRing, Check, Send, Smartphone, Building2, ShieldCheck, DollarSign, Zap, Sparkles } from 'lucide-react';
import { ClientLead, ProLead, ServiceCategory, SiteConfig } from '../types';

interface JoinCommunitySectionProps {
  config: SiteConfig;
  onClientLeadAdded?: (lead: ClientLead) => void;
  onProLeadAdded?: (lead: ProLead) => void;
}

const SERVICE_OPTIONS: { id: ServiceCategory | 'other'; label: string }[] = [
  { id: 'hair', label: 'Hair' },
  { id: 'nails', label: 'Nails' },
  { id: 'brows_lashes', label: 'Brows & Lashes' },
  { id: 'skin_facials', label: 'Facials & Skin' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'other', label: 'Other / Request Service' },
];

export const JoinCommunitySection: React.FC<JoinCommunitySectionProps> = ({
  config,
  onClientLeadAdded,
  onProLeadAdded,
}) => {
  // Client Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [selectedServices, setSelectedServices] = useState<(ServiceCategory | 'other')[]>(['hair', 'nails']);
  const [otherServiceText, setOtherServiceText] = useState('');
  const [clientSubmitted, setClientSubmitted] = useState(false);
  const [lastClientLead, setLastClientLead] = useState<ClientLead | null>(null);

  // Pro Form State
  const [proName, setProName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType] = useState('hair');
  const [proCity, setProCity] = useState('');
  const [proEmail, setProEmail] = useState('');
  const [proPhone, setProPhone] = useState('');
  const [proSubmitted, setProSubmitted] = useState(false);

  const toggleService = (id: ServiceCategory | 'other') => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    // Filter valid ServiceCategories for type safety
    const validCategories = selectedServices.filter((s): s is ServiceCategory => s !== 'other');

    const newLead: ClientLead = {
      id: 'lead-' + Date.now(),
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      neighborhood: clientCity || 'All Locations',
      services: validCategories,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setClientSubmitted(true);
    setLastClientLead(newLead);
    if (onClientLeadAdded) {
      onClientLeadAdded(newLead);
    }
  };

  const handleProSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proName || !proEmail || !proPhone) return;

    const newLead: ProLead = {
      id: 'pro-' + Date.now(),
      name: proName,
      businessName,
      serviceType,
      neighborhood: proCity || 'Canada',
      email: proEmail,
      phone: proPhone,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setProSubmitted(true);
    if (onProLeadAdded) {
      onProLeadAdded(newLead);
    }
  };

  return (
    <section id="join-community" className="py-16 sm:py-24 bg-[#FAF8F5] text-stone-900 border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            Join The Mirro Network
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 tracking-tight">
            Connect with <span className="italic font-serif text-stone-600">The Mirro Community</span>
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light">
            Whether you're looking to grab last-minute beauty openings or fill canceled slots in your salon chair, sign up below.
          </p>
        </div>

        {/* Side-by-Side 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT COLUMN: Customer VIP Alert Signup */}
          <div id="client-signup" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-200/80">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-medium tracking-wider text-stone-500">For Clients & Beauty Lovers</span>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Get Instant SMS Deal Alerts
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 font-light mb-6">
                Tell us your city and preferred services. When a top stylist posts a last-minute cancellation near you, you'll get texted immediately.
              </p>

              {clientSubmitted ? (
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-2xl font-medium text-stone-900">
                    You're on the VIP Alert List!
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto font-light">
                    We'll text <strong className="text-stone-900">{lastClientLead?.phone}</strong> as soon as a flash deal opens in{' '}
                    <strong className="text-stone-900">{lastClientLead?.neighborhood}</strong>.
                  </p>

                  <div className="max-w-xs mx-auto bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 text-left text-xs shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-600 font-medium mb-1">
                      <Smartphone className="w-3 h-3" />
                      SMS Preview • The Mirro Alerts
                    </div>
                    <p className="text-stone-700 font-mono text-[11px] leading-tight">
                      "🔥 FLASH DEAL: Balayage in {lastClientLead?.neighborhood} open today at 2:30 PM! 50% OFF. Tap to claim: themirro.com/claim"
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setClientSubmitted(false)}
                      className="text-xs text-stone-900 hover:underline font-medium"
                    >
                      + Update preferences or register another phone
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleClientSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Your Name <span className="text-stone-900">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jessica Alba"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address <span className="text-stone-900">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jessica@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Phone (SMS Alerts) <span className="text-stone-900">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(416) 555-0192"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        City / Region (Canada)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Toronto, Vancouver, Montreal"
                        value={clientCity}
                        onChange={(e) => setClientCity(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  {/* Services Selection */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-2">
                      Services You're Interested In:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICE_OPTIONS.map((srv) => {
                        const isChecked = selectedServices.includes(srv.id);
                        return (
                          <button
                            type="button"
                            key={srv.id}
                            onClick={() => toggleService(srv.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                              isChecked
                                ? 'bg-stone-900 text-white font-medium'
                                : 'bg-[#FAF8F5] border border-stone-200 text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                isChecked
                                  ? 'bg-white border-white text-stone-900'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>{srv.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Unlisted Service Text Field */}
                    {selectedServices.includes('other') && (
                      <div className="mt-3 animate-fadeIn">
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Specify Other Beauty Services You Want:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Spray Tanning, Massage, Teeth Whitening, Threading..."
                          value={otherServiceText}
                          onChange={(e) => setOtherServiceText(e.target.value)}
                          className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                        />
                        <p className="text-[11px] text-stone-500 mt-1 font-light">
                          We gather custom requests to prioritize onboarding new salon specialists in your city!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full font-medium text-xs tracking-wide bg-stone-900 text-white shadow-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Subscribe for Free SMS Alerts
                    </button>
                    <p className="text-[11px] text-stone-500 text-center mt-3 font-light leading-relaxed">
                      By joining, you agree we can email/SMS you about launch & deal drops. See our{' '}
                      <a href="#policies" className="underline hover:text-stone-900">
                        Privacy Policy
                      </a>
                      . Unsubscribe anytime via{' '}
                      <a href="mailto:faith@themirro.com" className="underline hover:text-stone-900">
                        faith@themirro.com
                      </a>
                      .
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Stylist & Salon Application */}
          <div id="pro-section" className="bg-[#F5EFEA] rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-stone-200/80">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-medium tracking-wider text-stone-500">For Stylists & Salons</span>
                  <h3 className="font-serif text-xl font-medium text-stone-900">
                    Partner Stylist Application
                  </h3>
                </div>
              </div>

              {/* Quick Perks Bar */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-white/80 backdrop-blur p-2.5 rounded-xl border border-stone-200/60">
                  <DollarSign className="w-3.5 h-3.5 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-stone-900">Paid Upfront</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-2.5 rounded-xl border border-stone-200/60">
                  <Zap className="w-3.5 h-3.5 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-stone-900">Fill Empty Slots</p>
                </div>
                <div className="bg-white/80 backdrop-blur p-2.5 rounded-xl border border-stone-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-stone-900">Zero Upfront Cost</p>
                </div>
              </div>

              {proSubmitted ? (
                <div className="py-8 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-white text-stone-800 border border-stone-200 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-2xl font-medium text-stone-900">
                    Partner Application Received!
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto font-light">
                    Thanks {proName}! Our onboarding team will reach out to <strong className="text-stone-900">{proEmail}</strong> to set up your free listing portal.
                  </p>
                  <button
                    onClick={() => setProSubmitted(false)}
                    className="text-xs text-stone-900 underline font-medium pt-2"
                  >
                    Submit another salon / partner
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Name <span className="text-stone-900">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Antoine Laurent"
                      value={proName}
                      onChange={(e) => setProName(e.target.value)}
                      className="w-full bg-white text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Salon / Business Name <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maison de Beauté or Independent Professional"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Service Specialty <span className="text-stone-900">*</span>
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full bg-white text-sm text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
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
                        value={proCity}
                        onChange={(e) => setProCity(e.target.value)}
                        className="w-full bg-white text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address <span className="text-stone-900">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="antoine@salon.com"
                        value={proEmail}
                        onChange={(e) => setProEmail(e.target.value)}
                        className="w-full bg-white text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
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
                        value={proPhone}
                        onChange={(e) => setProPhone(e.target.value)}
                        className="w-full bg-white text-sm text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full font-medium text-xs tracking-wide bg-stone-900 text-white shadow-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Apply as Partner Professional
                    </button>
                    <p className="text-[11px] text-stone-500 text-center mt-3 font-light leading-relaxed">
                      By joining, you agree we can contact you regarding salon partner onboarding. See our{' '}
                      <a href="#policies" className="underline hover:text-stone-900">
                        Privacy Policy
                      </a>
                      . Unsubscribe via{' '}
                      <a href="mailto:faith@themirro.com" className="underline hover:text-stone-900">
                        faith@themirro.com
                      </a>
                      .
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
