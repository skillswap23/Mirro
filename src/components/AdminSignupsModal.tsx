import React, { useState } from 'react';
import { X, Users, Download, Copy, Check, Trash2, Phone, Mail, MapPin, Building2, UserCheck, Search, Filter } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'pros'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Search filtering logic
  const query = searchQuery.trim().toLowerCase();

  const filteredClients = clientLeads.filter((c) => {
    if (!query) return true;
    const servicesStr = c.services.join(' ').toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.neighborhood.toLowerCase().includes(query) ||
      servicesStr.includes(query)
    );
  });

  const filteredPros = proLeads.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      (p.businessName && p.businessName.toLowerCase().includes(query)) ||
      p.email.toLowerCase().includes(query) ||
      p.phone.toLowerCase().includes(query) ||
      p.neighborhood.toLowerCase().includes(query) ||
      p.serviceType.toLowerCase().includes(query)
    );
  });

  const totalCount = clientLeads.length + proLeads.length;

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'pros') {
      csvContent += 'Type,Name,Business,Service,Email,Phone,Location,Date\n';
      filteredPros.forEach((p) => {
        csvContent += `"Beauty Pro","${p.name}","${p.businessName || ''}","${p.serviceType}","${p.email}","${p.phone}","${p.neighborhood}","${p.createdAt}"\n`;
      });
    } else if (activeTab === 'clients') {
      csvContent += 'Type,Name,Email,Phone,Location,Requested Services,Date\n';
      filteredClients.forEach((c) => {
        const srvs = c.services.join(';');
        csvContent += `"Client Lead","${c.name}","${c.email}","${c.phone}","${c.neighborhood}","${srvs}","${c.createdAt}"\n`;
      });
    } else {
      csvContent += 'Type,Name,Business/Services,Email,Phone,Location,Date\n';
      filteredClients.forEach((c) => {
        csvContent += `"Client","${c.name}","${c.services.join(';')}","${c.email}","${c.phone}","${c.neighborhood}","${c.createdAt}"\n`;
      });
      filteredPros.forEach((p) => {
        csvContent += `"Pro Partner","${p.name}","${p.businessName || p.serviceType}","${p.email}","${p.phone}","${p.neighborhood}","${p.createdAt}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mirro_registered_contacts_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyContactList = () => {
    let list = '';
    if (activeTab === 'clients') {
      list = filteredClients.map((c) => `${c.name} <${c.email}> - ${c.phone} (${c.neighborhood})`).join('\n');
    } else if (activeTab === 'pros') {
      list = filteredPros.map((p) => `${p.name} (${p.businessName || p.serviceType}) <${p.email}> - ${p.phone}`).join('\n');
    } else {
      const cList = filteredClients.map((c) => `[Client] ${c.name} <${c.email}> - ${c.phone} (${c.neighborhood})`);
      const pList = filteredPros.map((p) => `[Pro] ${p.name} (${p.businessName || p.serviceType}) <${p.email}> - ${p.phone}`);
      list = [...cList, ...pList].join('\n');
    }

    navigator.clipboard.writeText(list);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl animate-fadeIn my-8 text-stone-900 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium text-stone-900">
                  Registered Contacts Directory
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-xs font-mono font-medium">
                  {totalCount} Total Registered
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                All registered clients, SMS deal subscribers, and salon partner applicants
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

        {/* Filter Controls & Search */}
        <div className="space-y-3 mb-4 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="inline-flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl border border-stone-200 shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                All Contacts ({totalCount})
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'clients'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Clients / Subscribers ({clientLeads.length})
              </button>
              <button
                onClick={() => setActiveTab('pros')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'pros'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Salon Partners ({proLeads.length})
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyContactList}
                disabled={totalCount === 0}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-all flex items-center gap-1.5"
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
                disabled={totalCount === 0}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search registered contacts by name, email, phone number, neighborhood, or service..."
              className="w-full bg-[#FAF8F5] border border-stone-200 text-xs text-stone-900 placeholder-stone-400 pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Table / List */}
        <div className="overflow-y-auto flex-1 border border-stone-200/90 rounded-2xl bg-[#FAF8F5]">
          {/* Render Clients if active tab is 'all' or 'clients' */}
          {(activeTab === 'all' || activeTab === 'clients') && filteredClients.length > 0 && (
            <div className="divide-y divide-stone-200/80">
              {activeTab === 'all' && (
                <div className="px-4 py-2 bg-stone-100/80 border-b border-stone-200 text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Clients & SMS Subscribers ({filteredClients.length})</span>
                </div>
              )}
              {filteredClients.map((lead, idx) => (
                <div key={'c-' + idx} className="p-4 bg-white hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{lead.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-medium">
                        Client Subscriber
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-mono">
                        {lead.createdAt}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-600 font-light">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-stone-900 underline">
                        <Mail className="w-3.5 h-3.5 text-stone-400" /> {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 font-mono text-stone-800 hover:text-stone-900 underline">
                        <Phone className="w-3.5 h-3.5 text-stone-400" /> {lead.phone}
                      </a>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" /> {lead.neighborhood || 'Toronto'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lead.services.map((srv, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200/60 text-stone-700 text-[10px] capitalize">
                        {srv.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Render Pros if active tab is 'all' or 'pros' */}
          {(activeTab === 'all' || activeTab === 'pros') && filteredPros.length > 0 && (
            <div className="divide-y divide-stone-200/80">
              {activeTab === 'all' && (
                <div className="px-4 py-2 bg-stone-100/80 border-b border-stone-200 text-[11px] font-semibold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Salon & Beauty Pro Partners ({filteredPros.length})</span>
                </div>
              )}
              {filteredPros.map((pro, idx) => (
                <div key={'p-' + idx} className="p-4 bg-white hover:bg-stone-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{pro.name}</span>
                      {pro.businessName && (
                        <span className="text-stone-600 font-normal">({pro.businessName})</span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 text-[10px] font-medium">
                        Pro Partner
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-mono">
                        {pro.createdAt}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-600 font-light">
                      <a href={`mailto:${pro.email}`} className="flex items-center gap-1 hover:text-stone-900 underline">
                        <Mail className="w-3.5 h-3.5 text-stone-400" /> {pro.email}
                      </a>
                      <a href={`tel:${pro.phone}`} className="flex items-center gap-1 font-mono text-stone-800 hover:text-stone-900 underline">
                        <Phone className="w-3.5 h-3.5 text-stone-400" /> {pro.phone}
                      </a>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" /> {pro.neighborhood}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-white text-[11px] font-medium">
                      {pro.serviceType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Search / Empty Contacts State */}
          {((activeTab === 'clients' && filteredClients.length === 0) ||
            (activeTab === 'pros' && filteredPros.length === 0) ||
            (activeTab === 'all' && filteredClients.length === 0 && filteredPros.length === 0)) && (
            <div className="py-16 text-center text-stone-500 font-light text-sm px-4">
              {searchQuery ? (
                <>
                  No registered contacts found matching "<strong className="text-stone-800">{searchQuery}</strong>".
                </>
              ) : (
                <>No registered contacts in this list yet. Submissions from website forms will appear here!</>
              )}
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
            Reset All Contacts
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-all"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
