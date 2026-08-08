import React, { useState } from 'react';
import { X, PlusCircle, Trash2, Calendar, MapPin, Tag, Clock, ExternalLink, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Deal, ServiceCategory } from '../types';

interface AdminDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  onAddDeal: (newDeal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
  onResetDeals?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
];

export const AdminDealsModal: React.FC<AdminDealsModalProps> = ({
  isOpen,
  onClose,
  deals,
  onAddDeal,
  onDeleteDeal,
  onResetDeals,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  // Form State
  const [stylistName, setStylistName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('hair');
  const [serviceTitle, setServiceTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discountedPrice, setDiscountedPrice] = useState<number | ''>('');
  const [timeSlot, setTimeSlot] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitNewDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stylistName || !salonName || !serviceTitle || !originalPrice || !discountedPrice || !timeSlot) return;

    const newDeal: Deal = {
      id: 'deal-' + Date.now(),
      stylistName,
      stylistAvatar: customAvatarUrl.trim() || selectedAvatar,
      salonName,
      neighborhood: neighborhood || 'Canada',
      serviceTitle,
      category,
      durationMinutes: Number(durationMinutes) || 60,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      timeSlot,
      dateLabel: timeSlot,
      availableSpots: 1,
      rating: 4.9,
      reviewCount: 1,
      badge: badge || `Discounted Rate`,
      calendlyUrl: calendlyUrl.trim() || undefined,
    };

    onAddDeal(newDeal);
    setSavedSuccess(true);

    // Reset Form
    setStylistName('');
    setSalonName('');
    setServiceTitle('');
    setOriginalPrice('');
    setDiscountedPrice('');
    setTimeSlot('');
    setCalendlyUrl('');
    setBadge('');
    setCustomAvatarUrl('');

    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('manage');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-fadeIn my-8 text-stone-900 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Manage Salon Appointments
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Upload canceled appointments sent by salons & manage live listings ({deals.length} active)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <div className="inline-flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Upload New Appointment
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'manage'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Live Deals ({deals.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 pr-1">
          {activeTab === 'upload' ? (
            <form onSubmit={handleSubmitNewDeal} className="space-y-4">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-4">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-stone-700" /> Salon & Stylist Info
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Stylist / Specialist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={stylistName}
                      onChange={(e) => setStylistName(e.target.value)}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Salon / Studio Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lumière Salon & Spa"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City / Location (Canada) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toronto, ON or Vancouver, BC"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Service Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                      className="w-full bg-white text-xs text-stone-900 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    >
                      <option value="hair">Hair</option>
                      <option value="nails">Nails</option>
                      <option value="brows_lashes">Brows & Lashes</option>
                      <option value="skin_facials">Facials & Skin</option>
                      <option value="makeup">Makeup</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-4">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-700" /> Service & Pricing Details
                </h4>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Balayage & Gloss Treatment"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Original Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 200"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Discounted Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 120"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-white text-xs text-stone-900 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Time Slot / Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Today at 3:30 PM or Aug 8 at 11:00 AM"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Badge / Tag <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flash Opening or 40% OFF"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Booking Link URL <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-booking-link.com/appointment"
                    value={calendlyUrl}
                    onChange={(e) => setCalendlyUrl(e.target.value)}
                    className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 font-mono"
                  />
                </div>
              </div>

              {/* Photo Preset Selector */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-3">
                <label className="block text-xs font-medium text-stone-700">
                  Stylist Avatar / Photo Preset:
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                        selectedAvatar === preset && !customAvatarUrl
                          ? 'border-stone-900 scale-105'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">
                    Or paste a custom image URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Appointment Deal Live On Site!
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Publish Appointment Deal to Live Board
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Manage Active Deals Tab */
            <div className="space-y-3">
              {deals.length === 0 ? (
                <div className="py-12 text-center bg-[#FAF8F5] rounded-2xl border border-stone-200 text-stone-500 font-light text-sm space-y-3">
                  <p>No active appointment deals posted currently.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Upload Canceled Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={deal.stylistAvatar}
                          alt={deal.stylistName}
                          className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-stone-900 text-sm">
                              {deal.serviceTitle}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#F5EFEA] text-stone-800 text-[10px] font-medium border border-stone-200/80">
                              {deal.badge || 'Discounted'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-light">
                            {deal.stylistName} • {deal.salonName} ({deal.neighborhood})
                          </p>
                          <p className="text-xs text-stone-700 font-medium mt-0.5 flex items-center gap-2">
                            <span>{deal.timeSlot}</span>
                            <span>•</span>
                            <span className="text-stone-900 font-bold">${deal.discountedPrice}</span>
                            <span className="text-stone-400 line-through text-[11px] font-normal">
                              ${deal.originalPrice}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {deal.calendlyUrl && (
                          <a
                            href={deal.calendlyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs"
                            title="Test booking URL"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteDeal(deal.id)}
                          className="px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-100 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-stone-400">
            {deals.length} active appointment deal{deals.length === 1 ? '' : 's'} on live site
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
