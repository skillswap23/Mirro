import React, { useState, useMemo } from 'react';
import { Zap, MapPin, Clock, ExternalLink, ShieldAlert, Filter, Search, Grid, Table, CheckCircle2, Info } from 'lucide-react';
import { Deal, ServiceCategory, SiteConfig } from '../types';

interface LiveDealsBoardProps {
  deals: Deal[];
  config: SiteConfig;
}

const CATEGORIES: { key: 'all' | ServiceCategory; label: string }[] = [
  { key: 'all', label: 'All Deals' },
  { key: 'hair', label: 'Hair' },
  { key: 'nails', label: 'Nails' },
  { key: 'brows_lashes', label: 'Brows & Lashes' },
  { key: 'skin_facials', label: 'Facials & Skin' },
  { key: 'makeup', label: 'Makeup' },
];

export const LiveDealsBoard: React.FC<LiveDealsBoardProps> = ({ deals, config }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'airtable'>('cards');
  const [claimDealModal, setClaimDealModal] = useState<Deal | null>(null);

  // Extract unique neighborhoods
  const neighborhoods = useMemo(() => {
    const set = new Set(deals.map((d) => d.neighborhood));
    return Array.from(set);
  }, [deals]);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesCat = selectedCategory === 'all' || deal.category === selectedCategory;
      const matchesHood = selectedNeighborhood === 'all' || deal.neighborhood === selectedNeighborhood;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        deal.stylistName.toLowerCase().includes(q) ||
        deal.serviceTitle.toLowerCase().includes(q) ||
        deal.salonName.toLowerCase().includes(q) ||
        deal.neighborhood.toLowerCase().includes(q);
      return matchesCat && matchesHood && matchesQuery;
    });
  }, [deals, selectedCategory, selectedNeighborhood, searchQuery]);

  const handleClaimClick = (deal: Deal) => {
    setClaimDealModal(deal);
  };

  const confirmRedirectToCalendly = () => {
    if (!claimDealModal) return;
    const targetUrl = claimDealModal.calendlyUrl || `${config.calendlyBaseUrl}/${claimDealModal.id}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setClaimDealModal(null);
  };

  return (
    <section id="deals" className="py-16 sm:py-24 bg-[#FAF8F5] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Openings • {deals.length} Active Slots Today
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Today's <span className="italic font-serif text-stone-600">Flash Deals</span> Board
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl font-light">
              Real-time last-minute cancellations at partner salons in Toronto & GTA.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-sm shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Interactive Cards
            </button>
            <button
              onClick={() => setViewMode('airtable')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'airtable'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Embedded Airtable
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        {viewMode === 'cards' && (
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 mb-8 space-y-4 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-stone-900 text-white font-medium shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Neighborhood Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search service or salon..."
                    className="w-full bg-[#FAF8F5] text-xs text-stone-800 placeholder-stone-400 pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div className="relative w-full sm:w-48">
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full bg-[#FAF8F5] text-xs text-stone-800 pl-3 pr-8 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 appearance-none cursor-pointer"
                  >
                    <option value="all">All Toronto Locations</option>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <Filter className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Content */}
        {viewMode === 'cards' ? (
          <div>
            {filteredDeals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/80 shadow-sm">
                <p className="text-stone-600 text-base mb-2">No flash deals found matching your filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedNeighborhood('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-stone-900 underline font-medium hover:text-stone-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => {
                  const discountPct = Math.round(
                    ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100
                  );

                  return (
                    <div
                      key={deal.id}
                      className="bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-stone-300 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                      {/* Top Badge Accent */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F5EFEA] text-stone-800 px-3 py-1 rounded-full border border-stone-200/80">
                          <Zap className="w-3 h-3 text-stone-700 fill-stone-700" />
                          {deal.badge || `${discountPct}% OFF`}
                        </span>

                        <span className="text-xs text-stone-500 font-light flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-stone-200/60">
                          <MapPin className="w-3 h-3 text-stone-600" />
                          {deal.neighborhood}
                        </span>
                      </div>

                      {/* Stylist & Salon Header */}
                      <div className="flex items-center gap-3.5 mb-4">
                        <img
                          src={deal.stylistAvatar}
                          alt={deal.stylistName}
                          className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                            {deal.stylistName}
                            {deal.rating && (
                              <span className="text-[11px] font-normal text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                                ★ {deal.rating}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-stone-500 font-light">{deal.salonName}</p>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="mb-6 bg-[#FAF8F5] rounded-xl p-3.5 border border-stone-200/60">
                        <h3 className="text-base font-serif font-medium text-stone-900 leading-snug mb-2">
                          {deal.serviceTitle}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-200/60">
                          <span className="flex items-center gap-1 font-medium text-stone-800">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            {deal.timeSlot}
                          </span>
                          <span className="font-light">{deal.durationMinutes} mins</span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div>
                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-xs text-stone-400 line-through mr-2">
                              ${deal.originalPrice}
                            </span>
                            <span className="font-serif text-2xl font-bold text-stone-900">
                              ${deal.discountedPrice}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-stone-700 bg-[#F5EFEA] px-2.5 py-1 rounded-full border border-stone-200/80">
                            Save ${deal.originalPrice - deal.discountedPrice}
                          </span>
                        </div>

                        {/* Claim Button */}
                        <button
                          onClick={() => handleClaimClick(deal)}
                          className="w-full py-3 px-4 rounded-xl font-medium text-xs tracking-wide bg-stone-900 hover:bg-stone-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                          <span>Claim this deal</span>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-300" />
                        </button>

                        {/* Mandated Policy Notice directly on card */}
                        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-stone-500 font-light">
                          <ShieldAlert className="w-3 h-3 text-stone-400" />
                          <span>Non-refundable once booked — </span>
                          <a href="#policies" className="underline hover:text-stone-800">
                            see policy
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Airtable Embed Mode */
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-stone-700" />
                <span className="text-xs sm:text-sm font-medium text-stone-900">
                  Airtable Live Gallery / Grid View Embed
                </span>
              </div>
              <span className="text-[11px] text-stone-500">
                Editable URL in Settings
              </span>
            </div>

            <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-[#FAF8F5] border border-stone-200">
              <iframe
                src={config.airtableEmbedUrl}
                title="Airtable Live Deals Board"
                className="w-full h-full border-0"
                style={{ background: 'transparent' }}
              />
            </div>

            <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-stone-600 shrink-0" />
                <span>
                  Showing embedded Airtable view ({config.airtableEmbedUrl}). Stylist open slots update live in real-time.
                </span>
              </div>
              <a href="#policies" className="text-stone-900 underline font-medium">
                View Payment & Refund Policy
              </a>
            </div>
          </div>
        )}

        {/* Claim Deal Calendly Modal */}
        {claimDealModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn text-stone-900">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900">
                    Claim Flash Appointment
                  </h3>
                </div>
                <button
                  onClick={() => setClaimDealModal(null)}
                  className="text-stone-400 hover:text-stone-900 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#FAF8F5] rounded-xl p-4 border border-stone-200 mb-5">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-medium mb-1">
                  Selected Service
                </p>
                <h4 className="text-base font-semibold text-stone-900">
                  {claimDealModal.serviceTitle}
                </h4>
                <p className="text-xs text-stone-600 mt-1 font-light">
                  {claimDealModal.stylistName} • {claimDealModal.salonName} ({claimDealModal.neighborhood})
                </p>

                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600">Time: {claimDealModal.timeSlot}</span>
                  <span className="font-serif text-lg font-bold text-stone-900">
                    ${claimDealModal.discountedPrice}{' '}
                    <span className="text-xs text-stone-400 line-through font-normal">
                      ${claimDealModal.originalPrice}
                    </span>
                  </span>
                </div>
              </div>

              {/* Functional explanation notice */}
              <div className="bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5 mb-5 text-xs text-stone-700 leading-relaxed">
                <p className="font-medium text-stone-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0" />
                  How Booking & Payment Flow Works:
                </p>
                <p className="font-light">
                  Clicking below opens {claimDealModal.stylistName}'s Calendly booking page. After choosing your time slot, Calendly immediately forwards you to a matching <strong>Stripe Payment Link</strong> to complete your payment upfront.
                </p>
              </div>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 mb-6 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <span className="font-light">
                  <strong className="font-medium">Strict Non-Refundable Policy:</strong> Because this is a flash cancellation slot, all sales are final and cannot be rescheduled.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setClaimDealModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedirectToCalendly}
                  className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white shadow-sm hover:bg-stone-800 flex items-center gap-1.5"
                >
                  Continue to Calendly
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
