import React, { useState } from 'react';
import { X, Users, Download, Copy, Check, Trash2, Phone, Mail, MapPin, Building2, UserCheck, Sparkles } from 'lucide-react';
import { ClientLead, ProLead } from '../types';

interface AdminSignupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientLeads: ClientLead[];
  proLeads: ProLead[];
  onClearLeads: () => void;
}

export const AdminSignupsModal: React.FC<AdminSignupsModalProps> = ({
  isOpen,
  onClose,
  clientLeads,
  proLeads,
  onClearLeads,
}) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'pros'>('clients');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'clients') {
      csvContent += 'Name,Email,Phone,Neighborhood,Services,Date\n';
      clientLeads.forEach((l) => {
        const servicesStr = l.services.join(';');
        csvContent += `"${l.name}","${l.email}","${l.phone}","${l.neighborhood}","${servicesStr}","${l.createdAt}"\n`;
      });
    } else {
      csvContent += 'Name,Business,Role,Email,Phone,Neighborhood,Daily Slots,Date\n';
      proLeads.forEach((p) => {
        csvContent += `"${p.name}","${p.businessName}","${p.role}","${p.email}","${p.phone}","${p.neighborhood}","${p.dailySlotsCount}","${p.createdAt}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mirro_${activeTab}_signups_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyContactList = () => {
    let list = '';
    if (activeTab === 'clients') {
      list = clientLeads.map((c) => `${c.name} <${c.email}> - ${c.phone} (${c.neighborhood})`).join('\n');
    } else {
      list = proLeads.map((p) => `${p.name} (${p.businessName}) <${p.email}> - ${p.phone}`).join('\n');
    }

    navigator.clipboard.writeText(list);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl animate-fadeIn my-8 text-stone-900 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 text-stone-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium text-stone-900">
                Signups & Leads Dashboard
              </h3>
              <p className="text-xs text-stone-500 font-light">
                View client SMS alert requests and beauty partner applications
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

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="inline-flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-stone-200">
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'clients'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Client SMS Leads ({clientLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('pros')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'pros'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Beauty Pros / Salons ({proLeads.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyContactList}
              disabled={activeTab === 'clients' ? clientLeads.length === 0 : proLeads.length === 0}
              className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy List
                </>
              )}
            </button>
            <button
              onClick={exportCSV}
              disabled={activeTab === 'clients' ? clientLeads.length === 0 : proLeads.length === 0}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Content Table / List */}
        <div className="overflow-y-auto flex-1 border border-stone-200/90 rounded-2xl bg-[#FAF8F5]">
          {activeTab === 'clients' ? (
            clientLeads.length === 0 ? (
              <div className="py-12 text-center text-stone-500 font-light text-sm">
                No client SMS signups yet. Submissions from the signup section will appear here automatically!
              </div>
            ) : (
              <div className="divide-y divide-stone-200/80">
                {clientLeads.map((lead, idx) => (
                  <div key={idx} className="p-4 bg-white hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 text-sm">{lead.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-mono">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-600 font-light">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-stone-400" /> {lead.email}
                        </span>
                        <span className="flex items-center gap-1 font-mono font-normal text-stone-800">
                          <Phone className="w-3.5 h-3.5 text-stone-400" /> {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" /> {lead.neighborhood || 'Toronto'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {lead.services.map((srv, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 text-[10px]">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : proLeads.length === 0 ? (
            <div className="py-12 text-center text-stone-500 font-light text-sm">
              No stylist or salon partner applications yet. Submissions from the Partner section will appear here!
            </div>
          ) : (
            <div className="divide-y divide-stone-200/80">
              {proLeads.map((pro, idx) => (
                <div key={idx} className="p-4 bg-white hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{pro.name}</span>
                      <span className="text-stone-500 font-light">({pro.businessName})</span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] capitalize">
                        {pro.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-600 font-light">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-stone-400" /> {pro.email}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-normal text-stone-800">
                        <Phone className="w-3.5 h-3.5 text-stone-400" /> {pro.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" /> {pro.neighborhood}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-white text-[11px] font-medium">
                      ~{pro.dailySlotsCount} slots/day
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClearLeads}
            className="px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Test Submissions
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
