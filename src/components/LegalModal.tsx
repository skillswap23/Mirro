import React, { useState } from 'react';
import { Shield, FileText, X } from 'lucide-react';
import { TERMLY_PRIVACY_POLICY_HTML } from '../data/termlyPolicyHtml';
import { TERMLY_TERMS_OF_SERVICE_HTML } from '../data/termlyTermsHtml';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  // Sync tab state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header with Navigation Tabs */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              {activeTab === 'privacy' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500">
                Official Legal Documents
              </span>
              <h3 className="font-serif text-xl font-medium text-stone-900">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* Tab Controls */}
            <div className="flex bg-stone-200/80 p-1 rounded-2xl text-xs font-medium text-stone-600">
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'hover:text-stone-900'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  activeTab === 'terms'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'hover:text-stone-900'
                }`}
              >
                Terms & Conditions
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-all ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans select-text">
          {activeTab === 'privacy' ? (
            <div
              className="termly-policy-container"
              dangerouslySetInnerHTML={{ __html: TERMLY_PRIVACY_POLICY_HTML }}
            />
          ) : (
            <div
              className="termly-terms-container"
              dangerouslySetInnerHTML={{ __html: TERMLY_TERMS_OF_SERVICE_HTML }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-stone-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-stone-500">© 2026 The Mirro Canada. All rights reserved.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-sm"
          >
            Close {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
          </button>
        </div>
      </div>
    </div>
  );
};
