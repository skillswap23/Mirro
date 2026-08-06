import React, { useState } from 'react';
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

export default function App() {
  // Load site configuration from LocalStorage or fallback to defaults
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('themirro_site_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse site config from storage', e);
    }
    return DEFAULT_SITE_CONFIG;
  });

  // State for deals with LocalStorage persistence
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem('themirro_live_deals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse deals from storage', e);
    }
    return INITIAL_DEALS;
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('themirro_admin_session') === 'active';
    } catch {
      return false;
    }
  });

  // Leads tracking with LocalStorage persistence
  const [clientLeads, setClientLeads] = useState<ClientLead[]>(() => {
    try {
      const saved = localStorage.getItem('themirro_client_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse client leads', e);
    }
    return [];
  });

  const [proLeads, setProLeads] = useState<ProLead[]>(() => {
    try {
      const saved = localStorage.getItem('themirro_pro_leads');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse pro leads', e);
    }
    return [];
  });

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
    try {
      localStorage.setItem('themirro_admin_session', 'active');
    } catch (e) {
      console.error(e);
    }
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

  // Save config changes
  const handleSaveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('themirro_site_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save site config to storage', e);
    }
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_SITE_CONFIG);
    try {
      localStorage.removeItem('themirro_site_config');
    } catch (e) {
      console.error('Failed to clear site config', e);
    }
  };

  const handleAddDeal = (newDeal: Deal) => {
    setDeals((prev) => {
      const updated = [newDeal, ...prev];
      try {
        localStorage.setItem('themirro_live_deals', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals((prev) => {
      const updated = prev.filter((d) => d.id !== dealId);
      try {
        localStorage.setItem('themirro_live_deals', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleAddClientLead = (lead: ClientLead) => {
    setClientLeads((prev) => {
      const updated = [lead, ...prev];
      try {
        localStorage.setItem('themirro_client_leads', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleAddProLead = (lead: ProLead) => {
    setProLeads((prev) => {
      const updated = [lead, ...prev];
      try {
        localStorage.setItem('themirro_pro_leads', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearLeads = () => {
    setClientLeads([]);
    setProLeads([]);
    try {
      localStorage.removeItem('themirro_client_leads');
      localStorage.removeItem('themirro_pro_leads');
    } catch (e) {
      console.error(e);
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
      />
    </div>
  );
}
