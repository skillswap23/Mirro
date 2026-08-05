import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LiveDealsBoard } from './components/LiveDealsBoard';
import { CustomerSignupForm } from './components/CustomerSignupForm';
import { ProSection } from './components/ProSection';
import { PolicySection } from './components/PolicySection';
import { Footer } from './components/Footer';
import { ConfigModal } from './components/ConfigModal';
import { AdminSignupsModal } from './components/AdminSignupsModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminHubModal } from './components/AdminHubModal';

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

  // State for deals
  const [deals] = useState<Deal[]>(INITIAL_DEALS);

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
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminHubOpen, setIsAdminHubOpen] = useState(false);

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
      {/* Top Announcement Ribbon */}
      <div className="bg-[#F4EFEA] text-stone-700 text-[11px] sm:text-xs py-2 px-4 text-center font-medium border-b border-stone-200/70 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500 animate-pulse" />
        <span>
          <strong>Flash Openings Active:</strong> Up to {config.discountPercentage}% off top Toronto salons in Yorkville, King West & Queen West.
        </span>
      </div>

      {/* Header */}
      <Header config={config} />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero config={config} />

        {/* 2. How It Works Section */}
        <HowItWorks />

        {/* 3. Live Deals Board */}
        <LiveDealsBoard deals={deals} config={config} />

        {/* 4. Customer Signup Form */}
        <CustomerSignupForm config={config} onLeadAdded={handleAddClientLead} />

        {/* 5. Beauty Professionals / Stylists Section */}
        <ProSection onProLeadAdded={handleAddProLead} />

        {/* 6. Booking & Payment Policy Section */}
        <PolicySection config={config} />
      </main>

      {/* 7. Footer */}
      <Footer
        config={config}
        onOpenAdmin={handleOpenAdminPortal}
        isAdminAuthenticated={isAdminAuthenticated}
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
        onLockAdmin={handleLockAdmin}
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
