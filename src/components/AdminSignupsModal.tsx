import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Download,
  Copy,
  Check,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  UserCheck,
  Search,
  Filter,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Link2,
  Sparkles,
  Database,
} from 'lucide-react';
import { ClientLead, ProLead, SiteConfig } from '../types';
import { extractSpreadsheetId, getSpreadsheetUrl, syncLeadsToSheet } from '../lib/googleSheets';

interface AdminSignupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientLeads: ClientLead[];
  proLeads: ProLead[];
  onClearLeads: () => void;
  config?: SiteConfig;
  onSaveConfig?: (config: SiteConfig) => void;
}

export const AdminSignupsModal: React.FC<AdminSignupsModalProps> = ({
  isOpen,
  onClose,
  clientLeads,
  proLeads,
  onClearLeads,
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'pros'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const DEFAULT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw6TMJQdgvO1PHQ3Si63Lzv6H9L7UK-grhzWCvVYkzndneEMKRyLuMJIau1qqhIly_UjA/exec';
  const [showSheetLinkInput, setShowSheetLinkInput] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState(config?.googleSheetUrl || (config?.googleSheetId ? getSpreadsheetUrl(config.googleSheetId) : ''));
  const [webhookUrlInput, setWebhookUrlInput] = useState(config?.googleSheetWebhookUrl || DEFAULT_WEBHOOK);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedSheetTable, setCopiedSheetTable] = useState(false);

  useEffect(() => {
    if (config?.googleSheetWebhookUrl) {
      setWebhookUrlInput(config.googleSheetWebhookUrl);
    } else {
      setWebhookUrlInput(DEFAULT_WEBHOOK);
    }
    if (config?.googleSheetUrl) {
      setSheetUrlInput(config.googleSheetUrl);
    }
  }, [config]);

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

  const copyForGoogleSheets = () => {
    const headers = ['Type', 'Full Name', 'Business / Services', 'Email', 'Phone', 'Neighborhood / Location', 'Date Joined'];
    const rows = [headers.join('\t')];

    filteredClients.forEach((c) => {
      const srvs = Array.isArray(c.services) ? c.services.join(', ') : (c.services || '');
      rows.push(['Client Lead', c.name, srvs, c.email, c.phone, c.neighborhood, c.createdAt].map(v => (v || '').toString().replace(/\t/g, ' ')).join('\t'));
    });

    filteredPros.forEach((p) => {
      const biz = p.businessName ? `${p.businessName} (${p.serviceType})` : p.serviceType;
      rows.push(['Salon Pro Partner', p.name, biz, p.email, p.phone, p.neighborhood, p.createdAt].map(v => (v || '').toString().replace(/\t/g, ' ')).join('\t'));
    });

    navigator.clipboard.writeText(rows.join('\n'));
    setCopiedSheetTable(true);
    setSyncStatus('📋 Copied table to clipboard! Open Google Sheets, click Cell A1, and press Paste (Ctrl+V or Cmd+V).');
    setTimeout(() => {
      setCopiedSheetTable(false);
      setSyncStatus(null);
    }, 6000);
  };

  const exportCSV = () => {
    const rows: string[][] = [];

    if (activeTab === 'pros') {
      rows.push(['Type', 'Name', 'Business', 'Service', 'Email', 'Phone', 'Location', 'Date']);
      filteredPros.forEach((p) => {
        rows.push(['Beauty Pro', p.name, p.businessName || '', p.serviceType, p.email, p.phone, p.neighborhood, p.createdAt]);
      });
    } else if (activeTab === 'clients') {
      rows.push(['Type', 'Name', 'Email', 'Phone', 'Location', 'Requested Services', 'Date']);
      filteredClients.forEach((c) => {
        const srvs = Array.isArray(c.services) ? c.services.join(', ') : (c.services || '');
        rows.push(['Client Lead', c.name, c.email, c.phone, c.neighborhood, srvs, c.createdAt]);
      });
    } else {
      rows.push(['Type', 'Name', 'Business/Services', 'Email', 'Phone', 'Location', 'Date']);
      filteredClients.forEach((c) => {
        const srvs = Array.isArray(c.services) ? c.services.join(', ') : (c.services || '');
        rows.push(['Client Lead', c.name, srvs, c.email, c.phone, c.neighborhood, c.createdAt]);
      });
      filteredPros.forEach((p) => {
        rows.push(['Pro Partner', p.name, p.businessName || p.serviceType, p.email, p.phone, p.neighborhood, p.createdAt]);
      });
    }

    const csvString = rows
      .map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mirro_leads_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var sheetName = data.leadType === 'pro' ? 'Salon Pro Partners' : 'Client Leads';
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (data.leadType === 'pro') {
        sheet.appendRow(['Type', 'Full Name', 'Business Name', 'Specialty', 'Email', 'Phone', 'Location', 'Date']);
      } else {
        sheet.appendRow(['Type', 'Full Name', 'Email', 'Phone', 'Location', 'Requested Services', 'Date']);
      }
    }
    if (sheet.getLastRow() === 0) {
      if (data.leadType === 'pro') {
        sheet.appendRow(['Type', 'Full Name', 'Business Name', 'Specialty', 'Email', 'Phone', 'Location', 'Date']);
      } else {
        sheet.appendRow(['Type', 'Full Name', 'Email', 'Phone', 'Location', 'Requested Services', 'Date']);
      }
    }
    if (data.leadType === 'pro') {
      sheet.appendRow(['Salon Pro Partner', data.name, data.businessName || '', data.serviceType || '', data.email, data.phone, data.neighborhood, data.createdAt]);
    } else {
      sheet.appendRow(['Client Lead', data.name, data.email, data.phone, data.neighborhood, data.services || '', data.createdAt]);
    }
    return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveSheetLink = () => {
    let finalSheetUrl = sheetUrlInput.trim();
    let finalWebhookUrl = webhookUrlInput.trim();

    // Auto-swap if user put script URL in sheet box or vice versa
    if (finalSheetUrl.includes('script.google.com')) {
      if (!finalWebhookUrl) finalWebhookUrl = finalSheetUrl;
      finalSheetUrl = '';
    }
    if (finalWebhookUrl.includes('docs.google.com')) {
      if (!finalSheetUrl) finalSheetUrl = finalWebhookUrl;
      finalWebhookUrl = '';
    }

    const extractedId = extractSpreadsheetId(finalSheetUrl);
    const validSheetUrl = finalSheetUrl ? (getSpreadsheetUrl(finalSheetUrl) || finalSheetUrl) : (config?.googleSheetUrl || '');

    if (config && onSaveConfig) {
      onSaveConfig({
        ...config,
        googleSheetUrl: validSheetUrl || undefined,
        googleSheetId: extractedId || config?.googleSheetId,
        googleSheetWebhookUrl: finalWebhookUrl || undefined,
      });
    }
    setShowSheetLinkInput(false);
    setSyncStatus('Google Sheet & Webhook URLs updated successfully!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSyncAllToSheet = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/google-sheet/sync-all` : '/api/google-sheet/sync-all';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatus(`🎉 Successfully pushed ${data.count} leads directly to your Google Sheet!`);
      } else {
        setSyncStatus(data.error || 'Please paste your Google Apps Script Web App URL below first.');
      }
    } catch (e: any) {
      setSyncStatus('Sync error. Please paste your Google Apps Script Web App URL below.');
    } finally {
      setIsSyncing(false);
    }
  };

  const rawUrl = config?.googleSheetUrl;
  const currentSheetUrl = (rawUrl && rawUrl.includes('docs.google.com'))
    ? rawUrl
    : (config?.googleSheetId ? getSpreadsheetUrl(config.googleSheetId) : null);

  const currentWebhookUrl = config?.googleSheetWebhookUrl || (rawUrl && rawUrl.includes('script.google.com') ? rawUrl : DEFAULT_WEBHOOK);

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

        {/* Google Sheets Live Database Banner */}
        <div className="mb-4 bg-emerald-950 text-emerald-50 rounded-2xl p-4 border border-emerald-800/80 shadow-md shrink-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-white flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" /> Google Sheets Lead Sync
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Ready
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-light mt-0.5">
                  Choose the simplest way for you: 1-Click Copy to Paste into Google Sheets, Direct CSV Download, or Auto Webhook Sync.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
              {/* Option A: Instant Copy for Google Sheets */}
              <button
                onClick={copyForGoogleSheets}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-400 text-stone-950 font-semibold text-xs hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copiedSheetTable ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSheetTable ? 'Copied Table!' : 'Copy for Google Sheets'}
              </button>

              {/* Option B: Download CSV */}
              <button
                onClick={exportCSV}
                className="px-3 py-1.5 rounded-xl bg-emerald-800/80 border border-emerald-600/60 text-emerald-100 hover:text-white hover:bg-emerald-700 transition-all text-xs font-medium flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV
              </button>

              {/* Option C: Open linked Google Sheet */}
              <button
                onClick={() => {
                  if (currentSheetUrl) {
                    window.open(currentSheetUrl, '_blank');
                  } else {
                    setShowSheetLinkInput(true);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-all text-xs font-medium flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> {currentSheetUrl ? 'Open Google Sheet' : 'Link Google Sheet URL'}
              </button>

              {/* Option D: Webhook auto-sync setup */}
              <button
                onClick={() => setShowScriptGuide(!showScriptGuide)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 hover:text-white hover:bg-emerald-800 transition-all text-xs font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Auto-Sync Webhook Setup
              </button>
            </div>
          </div>

          {/* Sync status alert */}
          {syncStatus && (
            <div className="mt-3 text-xs bg-emerald-900/90 border border-emerald-600/50 text-emerald-100 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Sheet Link & Webhook Configuration Inputs */}
          {showSheetLinkInput && (
            <div className="mt-3 pt-3 border-t border-emerald-800/60 space-y-3 bg-emerald-900/30 p-3.5 rounded-xl border border-emerald-700/40">
              <div className="space-y-1">
                <label className="block text-xs text-emerald-100 font-semibold flex items-center justify-between">
                  <span>Google Sheet URL (docs.google.com):</span>
                  <span className="text-[10px] text-emerald-300 font-normal">Opens your sheet in 1-click</span>
                </label>
                <input
                  type="text"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  placeholder="Paste https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                  className="w-full bg-emerald-950/70 border border-emerald-700 text-white placeholder-emerald-400/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-emerald-100 font-semibold flex items-center justify-between">
                  <span>Optional: Google Apps Script Webhook URL (script.google.com):</span>
                  <span className="text-[10px] text-amber-300 font-medium">For Auto Webhook Sync</span>
                </label>
                <input
                  type="text"
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="Paste https://script.google.com/macros/s/.../exec"
                  className="w-full bg-emerald-950/70 border border-emerald-700 text-white placeholder-emerald-400/50 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowSheetLinkInput(false)}
                  className="px-3 py-1.5 text-xs text-emerald-200 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSheetLink}
                  className="px-4 py-1.5 bg-emerald-400 text-stone-950 font-semibold text-xs rounded-xl hover:bg-emerald-300 transition-all shadow-md"
                >
                  Save Link
                </button>
              </div>
            </div>
          )}

          {/* Apps Script Guide & 1-Click Code */}
          {showScriptGuide && (
            <div className="mt-3 pt-3 border-t border-emerald-800/60 space-y-3 bg-emerald-900/40 p-3.5 rounded-xl border border-emerald-700/50">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> How to enable Automatic Webhook Sync
                </h5>
                <button
                  onClick={copyAppsScript}
                  className="px-2.5 py-1 rounded-lg bg-emerald-400 text-stone-950 text-[11px] font-medium hover:bg-emerald-300 transition-all flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedScript ? 'Copied Script!' : 'Copy 1-Click Apps Script'}
                </button>
              </div>

              <ol className="text-[11px] text-emerald-100/90 space-y-2 list-decimal list-inside font-light leading-relaxed">
                <li>In Google Sheets, click <strong className="text-white font-normal">Extensions &gt; Apps Script</strong>.</li>
                <li>Delete any default code, click <strong className="text-white font-normal">Copy 1-Click Apps Script</strong> above, and paste it in.</li>
                <li>Click <strong className="text-white font-normal">Deploy &gt; New deployment</strong>, select type <strong className="text-white font-normal">Web app</strong>.</li>
                <li>Set <strong className="text-white font-normal">Who has access</strong> to <strong className="text-emerald-300 font-medium">Anyone</strong>, then click <strong className="text-white font-normal">Deploy</strong>.</li>
                <li className="bg-emerald-950/80 p-2 rounded-lg border border-emerald-700/60 text-amber-200">
                  <strong className="text-white font-semibold block mb-0.5">🔑 Passing the "Authorize Access" Google Screen:</strong>
                  When Google asks <em className="text-white font-normal">"The Web App requires you to authorize access"</em>: Click <strong className="text-white font-medium">Authorize access</strong> &gt; Choose your Google account &gt; Click <strong className="text-white font-medium">Advanced</strong> &gt; Click <strong className="text-white font-medium">Go to Untitled project (unsafe)</strong> &gt; Click <strong className="text-white font-medium">Allow</strong>.
                </li>
                <li>Copy the resulting <strong className="text-white font-normal">Web app URL</strong> (starts with <em className="font-mono">https://script.google.com/...</em>) and paste it into <strong className="text-white font-normal">Link Google Sheet URL</strong> above!</li>
              </ol>

              <div className="pt-2 border-t border-emerald-800/60 flex justify-between items-center">
                <span className="text-[11px] text-emerald-300/80">Want to manually push all leads into your Webhook script right now?</span>
                <button
                  onClick={handleSyncAllToSheet}
                  disabled={isSyncing}
                  className="px-3 py-1 rounded-lg bg-emerald-400 text-stone-950 font-semibold text-[11px] hover:bg-emerald-300 transition-all flex items-center gap-1 shadow-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Pushing...' : 'Push All Leads Now'}
                </button>
              </div>
            </div>
          )}
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
