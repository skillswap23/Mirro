import React, { useState } from 'react';
import { X, SlidersHorizontal, Save, RotateCcw, Check, Link, Mail, Percent, Info } from 'lucide-react';
import { SiteConfig } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSaveConfig: (newConfig: SiteConfig) => void;
  onResetConfig: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetConfig,
}) => {
  const [formData, setFormData] = useState<SiteConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof SiteConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl animate-fadeIn my-8 text-stone-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-800 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                No-Code Embed Setup
              </h3>
              <p className="text-xs text-stone-500 font-light">Configure Airtable & Calendly URLs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Callout */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80 mb-5 text-xs text-stone-600 font-light leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
          <div>
            Paste your real no-code tool URLs below to connect your real Airtable live views and Calendly booking redirects.
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Discount Percentage */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-stone-600" />
              Default Headline Discount Percentage (%)
            </label>
            <input
              type="number"
              min="10"
              max="90"
              value={formData.discountPercentage}
              onChange={(e) => handleChange('discountPercentage', parseInt(e.target.value) || 50)}
              className="w-full bg-[#FAF8F5] text-sm text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Airtable Embed URL */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-stone-600" />
              Airtable Shared Grid/Gallery Embed URL
            </label>
            <input
              type="url"
              value={formData.airtableEmbedUrl}
              onChange={(e) => handleChange('airtableEmbedUrl', e.target.value)}
              placeholder="https://airtable.com/embed/..."
              className="w-full bg-[#FAF8F5] text-xs text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 font-mono"
            />
          </div>

          {/* Calendly Base URL */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-stone-600" />
              Calendly Booking Base URL
            </label>
            <input
              type="url"
              value={formData.calendlyBaseUrl}
              onChange={(e) => handleChange('calendlyBaseUrl', e.target.value)}
              placeholder="https://calendly.com/your-salon-handle"
              className="w-full bg-[#FAF8F5] text-xs text-stone-900 placeholder-stone-400 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 font-mono"
            />
            <p className="text-[11px] text-stone-500 mt-1 font-light">
              Tip: Configure Calendly to forward to your matching Stripe Payment Link upon slot selection.
            </p>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-600" />
              Contact Email Address
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="faith@themirro.com"
              className="w-full bg-[#FAF8F5] text-sm text-stone-900 px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onResetConfig}
              className="px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
