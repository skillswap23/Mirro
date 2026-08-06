import React from 'react';
import { Shield, X } from 'lucide-react';
import { TERMLY_PRIVACY_POLICY_HTML } from '../data/termlyPolicyHtml';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500">Official Legal Document</span>
              <h3 className="font-serif text-xl font-medium text-stone-900">Privacy Policy</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Exact Termly Html */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans select-text">
          <div
            className="termly-policy-container"
            dangerouslySetInnerHTML={{ __html: TERMLY_PRIVACY_POLICY_HTML }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-stone-500">© 2026 The Mirro Canada. All rights reserved.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-sm"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
