import React, { useState } from 'react';
import { BellRing, Check, Send, ShieldCheck, Smartphone } from 'lucide-react';
import { ClientLead, ServiceCategory, SiteConfig } from '../types';

interface CustomerSignupFormProps {
  config: SiteConfig;
  onLeadAdded?: (lead: ClientLead) => void;
  onOpenLegalModal?: (defaultTab?: 'privacy' | 'terms') => void;
}

const SERVICE_OPTIONS: { id: ServiceCategory; label: string }[] = [
  { id: 'hair', label: 'Hair Cut & Styling' },
  { id: 'nails', label: 'Nails (Gel, Acrylics)' },
  { id: 'brows_lashes', label: 'Brows & Lashes' },
  { id: 'skin_facials', label: 'Skin & Facials' },
  { id: 'makeup', label: 'Makeup & Glam' },
];

export const CustomerSignupForm: React.FC<CustomerSignupFormProps> = ({
  config,
  onLeadAdded,
  onOpenLegalModal,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>(['hair', 'nails']);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [lastSubmittedLead, setLastSubmittedLead] = useState<ClientLead | null>(null);

  const toggleService = (id: ServiceCategory) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsSubmitting(true);
    setSubmitError('');

    const newLead: ClientLead = {
      id: 'lead-' + Date.now(),
      name,
      email,
      phone,
      neighborhood: neighborhood || 'All Locations',
      services: selectedServices,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Always save lead to internal database server
    if (onLeadAdded) {
      onLeadAdded(newLead);
    }

    const leadData = {
      _subject: `New Mirro Client Alert Subscriber: ${name}`,
      formType: 'Client SMS Alert Signup',
      name,
      email,
      phone,
      cityOrRegion: neighborhood || 'All Locations',
      servicesRequested: selectedServices.join(', '),
      agreedToTermsAndPrivacy: agreedToPolicy ? 'Yes' : 'No',
      submittedAt: new Date().toLocaleString(),
    };

    try {
      await fetch('https://formspree.io/f/xoeavnyy', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      // Show success screen regardless of Formspree quota limit
      setSubmitted(true);
      setLastSubmittedLead(newLead);
    } catch (err) {
      console.error('Formspree submit error, lead saved to internal database:', err);
      setSubmitted(true);
      setLastSubmittedLead(newLead);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setNeighborhood('');
  };

  return (
    <section id="client-signup" className="py-16 sm:py-24 bg-[#FAF8F5] text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium mb-3 shadow-sm">
            <BellRing className="w-3.5 h-3.5 text-stone-600" />
            Never Miss A Cancellation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            Not ready to book today? <br />
            <span className="italic font-serif text-stone-600">Get instant SMS alert drops</span>
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light">
            Tell us your city or region in Canada and preferred beauty services. When a nearby stylist posts a cancellation, you'll be the first to know.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-stone-900">
                You're on the VIP Alert List, {lastSubmittedLead?.name}!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto font-light">
                We'll text <strong className="text-stone-900">{lastSubmittedLead?.phone}</strong> as soon as a flash deal opens in{' '}
                <strong className="text-stone-900">{lastSubmittedLead?.neighborhood}</strong>.
              </p>

              {/* SMS Preview simulation */}
              <div className="max-w-xs mx-auto bg-[#FAF8F5] border border-stone-200 rounded-2xl p-4 text-left text-xs shadow-inner">
                <div className="flex items-center gap-1.5 text-[10px] text-stone-600 font-medium mb-1">
                  <Smartphone className="w-3 h-3" />
                  SMS Preview • The Mirro Alerts
                </div>
                <p className="text-stone-700 font-mono text-[11px] leading-tight">
                  "🔥 FLASH DEAL: Full Balayage at Lumière Salon in {lastSubmittedLead?.neighborhood} open today at 2:30 PM! 50% OFF ($160). Tap to book: themirro.com/claim"
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="text-xs text-stone-900 hover:underline font-medium"
                >
                  + Register another client or update preferences
                </button>
              </div>
            </div>
          ) : (
            <form
              action="https://formspree.io/f/xoeavnyy"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fadeIn">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Your Name <span className="text-stone-900">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Jessica Alba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Email Address <span className="text-stone-900">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="jessica@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    Phone Number (for instant SMS alerts) <span className="text-stone-900">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="(416) 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    City / Region (Canada)
                  </label>
                  <input
                    type="text"
                    name="cityOrRegion"
                    placeholder="e.g. Toronto, Vancouver, Montreal, Calgary"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Services Checkboxes */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">
                  Services You Are Interested In:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SERVICE_OPTIONS.map((srv) => {
                    const isChecked = selectedServices.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-stone-900 border-stone-900 text-white font-medium'
                            : 'bg-[#FAF8F5] border-stone-200 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleService(srv.id)}
                          className="hidden"
                        />
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-white border-white text-stone-900'
                              : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{srv.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory Terms & Privacy Policy Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-stone-300 transition-all">
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    className="sr-only"
                    required
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      agreedToPolicy
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'border-stone-300 bg-white group-hover:border-stone-400'
                    }`}
                  >
                    {agreedToPolicy && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-stone-600 leading-relaxed font-light">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal?.('privacy')}
                      className="font-medium text-stone-900 underline hover:text-amber-700"
                    >
                      Privacy Policy
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal?.('terms')}
                      className="font-medium text-stone-900 underline hover:text-amber-700"
                    >
                      Terms & Conditions
                    </button>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!agreedToPolicy || isSubmitting}
                  className={`w-full py-4 rounded-full font-medium text-xs tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 ${
                    agreedToPolicy && !isSubmitting
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending to Formspree...' : 'Subscribe to Free SMS Deal Alerts'}
                </button>
                <p className="text-[11px] text-stone-500 text-center mt-3 font-light leading-relaxed max-w-lg mx-auto">
                  By joining, you agree we can email and SMS you about The Mirro's launch and flash deal alerts. Unsubscribe anytime by emailing{' '}
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
    </section>
  );
};
