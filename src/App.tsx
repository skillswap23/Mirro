import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LiveDealsBoard } from './components/LiveDealsBoard';
import { JoinCommunitySection } from './components/JoinCommunitySection';
import { PolicySection } from './components/PolicySection';
import { Footer } from './components/Footer';
import { ConfigModal } from './components/ConfigModal';
import { AdminSignupsModal } from './components/AdminSignupsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminHubModal } from './components/AdminHubModal';
import { AdminDealsModal } from './components/AdminDealsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

import { Deal, SiteConfig, ClientLead, ProLead } from './types';
import { DEFAULT_SITE_CONFIG, INITIAL_DEALS } from './data/initialDeals';
import { INITIAL_CLIENT_LEADS, INITIAL_PRO_LEADS } from './data/initialLeads';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clientLeads, setClientLeads] = useState<ClientLead[]>(INITIAL_CLIENT_LEADS);
  const [proLeads, setProLeads] = useState<ProLead[]>(INITIAL_PRO_LEADS);

  // Admin Authentication State - default strictly to LOCKED for security
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      localStorage.removeItem('themirro_admin_session');
      sessionStorage.removeItem('themirro_admin_session');
    } catch {
      // ignore
    }
    return false;
  });

  // Fetch central data from Express backend server
  const fetchCentralData = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/data` : '/api/data';
      const endpoint = `${baseUrl}?_t=${Date.now()}`;
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            if (data.config) setConfig(data.config);
            if (Array.isArray(data.clientLeads)) setClientLeads(data.clientLeads);
            if (Array.isArray(data.proLeads)) setProLeads(data.proLeads);
            if (Array.isArray(data.deals)) setDeals(data.deals);
          }
        }
      }
    } catch (e) {
      // Quietly swallow transient polling network glitch
    }
  };

  useEffect(() => {
    fetchCentralData();

    // Setup SSE connection for instant real-time data sync across Chrome, Safari & mobile
    let eventSource: EventSource | null = null;
    try {
      const streamUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/stream` : '/api/stream';
      eventSource = new EventSource(streamUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && typeof data === 'object') {
            if (data.config) setConfig(data.config);
            if (Array.isArray(data.clientLeads)) setClientLeads(data.clientLeads);
            if (Array.isArray(data.proLeads)) setProLeads(data.proLeads);
            if (Array.isArray(data.deals)) setDeals(data.deals);
          }
        } catch (e) {
          // quiet catch
        }
      };

      eventSource.onerror = () => {
        // SSE error or disconnect fallback to polling
      };
    } catch (e) {
      console.warn('SSE stream connection error:', e);
    }

    // Fast polling every 2 seconds for fallback live synchronization across browsers
    const interval = setInterval(fetchCentralData, 2000);

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      clearInterval(interval);
    };
  }, []);

  // Modals Visibility
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAdminSignupsOpen, setIsAdminSignupsOpen] = useState(false);
  const [isAdminDealsOpen, setIsAdminDealsOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminHubOpen, setIsAdminHubOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  const handleOpenLegalModal = (defaultTab: 'privacy' | 'terms' = 'privacy') => {
    setLegalTab(defaultTab);
    setIsPrivacyOpen(true);
  };

  const handleOpenAdminPortal = () => {
    if (isAdminAuthenticated) {
      setIsAdminHubOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAuthenticated = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthOpen(false);
    setIsAdminHubOpen(true);
  };

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminHubOpen(false);
    try {
      localStorage.removeItem('themirro_admin_session');
    } catch (e) {
      console.error(e);
    }
  };

  // Save config changes to server
  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/config` : '/api/config';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(newConfig),
      });
    } catch (e) {
      console.warn('Failed to save site config to server:', e);
    }
  };

  const handleResetConfig = async () => {
    setConfig(DEFAULT_SITE_CONFIG);
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/config` : '/api/config';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(DEFAULT_SITE_CONFIG),
      });
    } catch (e) {
      console.warn('Failed to reset site config on server:', e);
    }
  };

  const handleAddDeal = async (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/deals` : '/api/deals';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ deal: newDeal }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.deals) setDeals(data.deals);
        }
      }
    } catch (e) {
      console.warn('Failed to save deal to server:', e);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/deals/${dealId}` : `/api/deals/${dealId}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.deals) setDeals(data.deals);
        }
      }
    } catch (e) {
      console.warn('Failed to delete deal from server:', e);
    }
  };

  const handleAddClientLead = async (lead: ClientLead) => {
    setClientLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      return [lead, ...prev];
    });
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/leads/client` : '/api/leads/client';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(lead),
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (Array.isArray(data.clientLeads)) setClientLeads(data.clientLeads);
          }
          break;
        }
      } catch (e) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  };

  const handleAddProLead = async (lead: ProLead) => {
    setProLeads((prev) => {
      if (prev.some((l) => l.id === lead.id)) return prev;
      return [lead, ...prev];
    });
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/leads/pro` : '/api/leads/pro';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(lead),
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (Array.isArray(data.proLeads)) setProLeads(data.proLeads);
          }
          break;
        }
      } catch (e) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  };

  const handleClearLeads = async () => {
    setClientLeads([]);
    setProLeads([]);
    try {
      const endpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/leads` : '/api/leads';
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.clientLeads) setClientLeads(data.clientLeads);
          if (data.proLeads) setProLeads(data.proLeads);
        }
      }
    } catch (e) {
      console.warn('Failed to clear leads from server:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      {/* Header */}
      <Header
        config={config}
        onOpenPrivacy={() => handleOpenLegalModal('privacy')}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero config={config} />

        {/* 2. How It Works Section */}
        <HowItWorks />

        {/* 3. Live Deals Board */}
        <LiveDealsBoard deals={deals} config={config} />

        {/* 4. Side-by-Side Join Community Section (Client Alerts & Stylist Application) */}
        <JoinCommunitySection
          config={config}
          onClientLeadAdded={handleAddClientLead}
          onProLeadAdded={handleAddProLead}
          onOpenLegalModal={handleOpenLegalModal}
        />

        {/* 6. Booking & Payment Policy Section */}
        <PolicySection config={config} />
      </main>

      {/* 7. Footer */}
      <Footer
        config={config}
        onOpenAdmin={handleOpenAdminPortal}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenPrivacy={() => handleOpenLegalModal('privacy')}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* Privacy Policy & Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        defaultTab={legalTab}
      />

      {/* Admin Email SSO Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
        adminEmail={config.contactEmail}
      />

      {/* Admin Control Hub Modal */}
      <AdminHubModal
        isOpen={isAdminHubOpen}
        onClose={() => setIsAdminHubOpen(false)}
        clientLeads={clientLeads}
        proLeads={proLeads}
        config={config}
        onOpenSignupsDashboard={() => setIsAdminSignupsOpen(true)}
        onOpenEmbedConfig={() => setIsConfigOpen(true)}
        onOpenDealsManager={() => setIsAdminDealsOpen(true)}
        onLockAdmin={handleLockAdmin}
      />

      {/* Admin Upload & Manage Appointments Modal */}
      <AdminDealsModal
        isOpen={isAdminDealsOpen}
        onClose={() => setIsAdminDealsOpen(false)}
        deals={deals}
        onAddDeal={handleAddDeal}
        onDeleteDeal={handleDeleteDeal}
      />

      {/* No-Code Setup / Config Modal */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetConfig={handleResetConfig}
      />

      {/* Admin Signups & Leads Modal */}
      <AdminSignupsModal
        isOpen={isAdminSignupsOpen}
        onClose={() => setIsAdminSignupsOpen(false)}
        clientLeads={clientLeads}
        proLeads={proLeads}
        onClearLeads={handleClearLeads}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
