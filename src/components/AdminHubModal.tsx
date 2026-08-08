import React, { useState } from 'react';
import {
  X,
  Users,
  SlidersHorizontal,
  Lock,
  ShieldCheck,
  ChevronRight,
  KeyRound,
  Check,
  CalendarPlus,
  FileSpreadsheet,
  ExternalLink,
  Database,
} from 'lucide-react';
import { ClientLead, ProLead, SiteConfig } from '../types';
import { getSpreadsheetUrl } from '../lib/googleSheets';

interface AdminHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientLeads: ClientLead[];
  proLeads: ProLead[];
  config: SiteConfig;
  onOpenSignupsDashboard: () => void;
  onOpenEmbedConfig: () => void;
  onOpenDealsManager: () => void;
  onLockAdmin: () => void;
}

export const AdminHubModal: React.FC<AdminHubModalProps> = ({
  isOpen,
  onClose,
  clientLeads,
  proLeads,
  config,
  onOpenSignupsDashboard,
  onOpenEmbedConfig,
  onOpenDealsManager,
  onLockAdmin,
}) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!isOpen) return null;

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length >= 4) {
      try {
        const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/admin/change-password` : '/api/admin/change-password';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ newPassword: newPassword.trim() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPasswordSaved(true);
          setNewPassword('');
          setTimeout(() => {
            setPasswordSaved(false);
            setShowPasswordChange(false);
          }, 1500);
        } else {
          alert(data.error || 'Failed to update password on server');
        }
      } catch (err) {
        alert('Server error updating password');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-fadeIn text-stone-900 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Owner Admin Portal
              </h3>
              <p className="text-xs text-stone-500 font-light">
                Authenticated Admin Control Panel • {config.brandName || 'The Mirro'}
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

        {/* Action Cards */}
        <div className="space-y-3">
          {/* Upload & Manage Appointments Card */}
          <button
            onClick={() => {
              onClose();
              onOpenDealsManager();
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-900 bg-stone-900 text-white hover:bg-stone-800 transition-all group flex items-center justify-between shadow-md"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CalendarPlus className="w-5 h-5 text-stone-100" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-white">Upload & Manage Salon Appointments</h4>
                <p className="text-xs text-stone-300 font-light mt-0.5">
                  Add canceled appointments sent by salons & manage active live board deals.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Registered Contacts & Leads Card */}
          <button
            onClick={() => {
              onClose();
              onOpenSignupsDashboard();
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5] hover:bg-white hover:border-stone-400 transition-all group flex items-center justify-between shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-stone-900">Registered Contacts & Leads</h4>
                  <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-mono font-medium">
                    {clientLeads.length + proLeads.length} contacts
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Access all registered clients ({clientLeads.length}), email/SMS subscribers, and salon partners ({proLeads.length}).
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Live Google Sheets Database Card */}
          <button
            onClick={() => {
              onClose();
              onOpenSignupsDashboard();
            }}
            className="w-full text-left p-4 rounded-2xl border border-emerald-800/30 bg-emerald-950 text-emerald-50 hover:bg-emerald-900 transition-all group flex items-center justify-between shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-800/60 border border-emerald-600/50 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-white flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> Google Sheets Live Database
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-medium">
                    Live
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-light mt-0.5">
                  Open, export, or link your live Google Sheets database for all client and salon pro leads.
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* No-Code Embeds & Config Card */}
          <button
            onClick={() => {
              onClose();
              onOpenEmbedConfig();
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5] hover:bg-white hover:border-stone-400 transition-all group flex items-center justify-between shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-stone-900">No-Code Embeds & Links</h4>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Update Airtable shared view URL, Calendly booking base URL, and discount rates.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* Password Security Card */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-xs text-stone-900">Admin Password Security</h4>
                  <p className="text-[11px] text-stone-500 font-light">Set or update private access password</p>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-white transition-all"
              >
                {showPasswordChange ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordChange && (
              <form onSubmit={handleSavePassword} className="mt-3 pt-3 border-t border-stone-200/80 space-y-3">
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new admin password"
                  className="w-full bg-white text-xs text-stone-900 placeholder-stone-400 px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 font-mono"
                />
                <button
                  type="submit"
                  disabled={newPassword.trim().length < 4}
                  className="w-full py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
                >
                  {passwordSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Password Saved!
                    </>
                  ) : (
                    'Save New Admin Password'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onLockAdmin();
            }}
            className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Admin Session
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
