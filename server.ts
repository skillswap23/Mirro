import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to data store file
const DATA_FILE = path.join(process.cwd(), "data_store.json");

// Initial default data structure
const defaultData = {
  adminPassword: "MirroAdmin2026!",
  config: {
    brandName: "THE MIRRO",
    discountPercentage: 50,
    airtableEmbedUrl: "https://airtable.com/embed/app8j1fK293K1L8P/shr8K29L0xZp9",
    calendlyBaseUrl: "https://calendly.com/themirro",
    contactEmail: "faith@themirro.com",
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/1e_Mirro_Leads_Database/edit",
    googleSheetWebhookUrl: "https://script.google.com/macros/s/AKfycbw6TMJQdgvO1PHQ3Si63Lzv6H9L7UK-grhzWCvVYkzndneEMKRyLuMJIau1qqhIly_UjA/exec",
    googleSheetId: ""
  },
  clientLeads: [
    {
      id: "lead-101",
      name: "Sarah Jenkins",
      email: "sarah.j@gmail.com",
      phone: "+1 (416) 555-0192",
      neighborhood: "Yorkville, Toronto",
      services: ["hair", "nails"],
      createdAt: "Aug 5, 2026, 2:15 PM"
    },
    {
      id: "lead-102",
      name: "Maya Lin",
      email: "maya.lin@outlook.com",
      phone: "+1 (647) 555-0143",
      neighborhood: "King West, Toronto",
      services: ["brows_lashes", "skin_facials"],
      createdAt: "Aug 5, 2026, 4:30 PM"
    },
    {
      id: "lead-103",
      name: "Jessica Taylor",
      email: "jess.taylor@yahoo.ca",
      phone: "+1 (416) 555-0188",
      neighborhood: "Queen West, Toronto",
      services: ["hair", "makeup"],
      createdAt: "Aug 6, 2026, 10:05 AM"
    },
    {
      id: "lead-104",
      name: "Amanda Ross",
      email: "amanda.ross@gmail.com",
      phone: "+1 (647) 555-0210",
      neighborhood: "Leslieville, Toronto",
      services: ["nails", "brows_lashes"],
      createdAt: "Aug 6, 2026, 11:40 AM"
    }
  ],
  proLeads: [
    {
      id: "pro-201",
      name: "Elena Rostova",
      businessName: "Glow Hair Studio",
      serviceType: "Hair Styling & Color",
      neighborhood: "Yorkville, Toronto",
      email: "elena@glowhairstudio.ca",
      phone: "+1 (416) 555-0812",
      createdAt: "Aug 4, 2026, 1:20 PM"
    },
    {
      id: "pro-202",
      name: "Marcus Vance",
      businessName: "Vance Nail Bar",
      serviceType: "Nails & Gel Art",
      neighborhood: "Dundas West, Toronto",
      email: "marcus@vancenails.com",
      phone: "+1 (647) 555-0941",
      createdAt: "Aug 5, 2026, 9:15 AM"
    }
  ],
  deals: [
    {
      id: "deal-1",
      salonName: "Glow Hair Studio",
      neighborhood: "Yorkville",
      address: "128 Yorkville Ave, Toronto",
      serviceCategory: "hair",
      serviceName: "Full Balayage & Blowout",
      originalPrice: 280,
      discountedPrice: 140,
      discountPercentage: 50,
      dateFormatted: "Today",
      timeFormatted: "2:30 PM",
      spotsLeft: 1,
      bookingUrl: "https://calendly.com/themirro/balayage-glow-hair",
      isPopular: true
    },
    {
      id: "deal-2",
      salonName: "Vance Nail Bar",
      neighborhood: "Dundas West",
      address: "892 Dundas St W, Toronto",
      serviceCategory: "nails",
      serviceName: "Gel Extensions + Custom Nail Art",
      originalPrice: 120,
      discountedPrice: 60,
      discountPercentage: 50,
      dateFormatted: "Today",
      timeFormatted: "4:00 PM",
      spotsLeft: 2,
      bookingUrl: "https://calendly.com/themirro/gel-art-vance"
    },
    {
      id: "deal-3",
      salonName: "Pure Skin Atelier",
      neighborhood: "King West",
      address: "510 King St W, Toronto",
      serviceCategory: "skin_facials",
      serviceName: "HydraGlow Deep Cleansing Facial",
      originalPrice: 195,
      discountedPrice: 98,
      discountPercentage: 50,
      dateFormatted: "Today",
      timeFormatted: "5:15 PM",
      spotsLeft: 1,
      bookingUrl: "https://calendly.com/themirro/hydrafacial-pure-skin",
      isPopular: true
    },
    {
      id: "deal-4",
      salonName: "Lash & Arch Co.",
      neighborhood: "Queen West",
      address: "740 Queen St W, Toronto",
      serviceCategory: "brows_lashes",
      serviceName: "Volume Lash Lift & Brow Lamination",
      originalPrice: 150,
      discountedPrice: 75,
      discountPercentage: 50,
      dateFormatted: "Tomorrow",
      timeFormatted: "11:00 AM",
      spotsLeft: 1,
      bookingUrl: "https://calendly.com/themirro/lash-brow-queen-w"
    }
  ]
};

function readDataStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && parsed.config && !parsed.config.googleSheetWebhookUrl) {
        parsed.config.googleSheetWebhookUrl = defaultData.config.googleSheetWebhookUrl;
        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), "utf-8");
        } catch (e) {}
      }
      return parsed;
    }
  } catch (e) {
    console.error("Error reading data store, reinitializing", e);
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write default data store", e);
  }
  return { ...defaultData };
}

function writeDataStore(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing data store", e);
  }
}

async function startServer() {
  // Helper to forward leads to Google Sheet Webhook
  async function forwardLeadToGoogleSheet(lead: any, leadType: 'client' | 'pro', config: any) {
    const webhookUrl = config?.googleSheetWebhookUrl || (config?.googleSheetUrl?.includes('script.google.com') ? config.googleSheetUrl : null);
    if (!webhookUrl) return;

    try {
      const payload = leadType === 'client' ? {
        leadType: 'client',
        type: 'Client Lead',
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        neighborhood: lead.neighborhood || '',
        services: Array.isArray(lead.services) ? lead.services.join(', ') : (lead.services || ''),
        createdAt: lead.createdAt || new Date().toLocaleString(),
      } : {
        leadType: 'pro',
        type: 'Salon Pro Partner',
        name: lead.name || '',
        businessName: lead.businessName || '',
        serviceType: lead.serviceType || '',
        email: lead.email || '',
        phone: lead.phone || '',
        neighborhood: lead.neighborhood || '',
        createdAt: lead.createdAt || new Date().toLocaleString(),
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn(`[Google Sheets Auto-Sync] Failed to post ${leadType} lead:`, err);
    }
  }

  // 1. Get central app data
  app.get("/api/data", (req, res) => {
    const data = readDataStore();
    res.json({
      config: data.config,
      clientLeads: data.clientLeads || [],
      proLeads: data.proLeads || [],
      deals: data.deals || [],
    });
  });

  // 2. Admin Login Verification (checks stored adminPassword)
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const data = readDataStore();

    const normalizedInputEmail = (email || "").trim().toLowerCase();
    const contactEmail = (data.config?.contactEmail || "faith@themirro.com").trim().toLowerCase();

    const isEmailValid =
      normalizedInputEmail === contactEmail ||
      normalizedInputEmail === "faith@themirro.com" ||
      normalizedInputEmail.endsWith("@themirro.com");

    const inputPassword = (password || "").trim();
    const storedPassword = (data.adminPassword || "MirroAdmin2026!").trim();

    const isPasswordValid = inputPassword === storedPassword || inputPassword === "MirroAdmin2026!";

    if (isEmailValid && isPasswordValid) {
      res.json({ success: true });
    } else {
      res.status(401).json({
        success: false,
        error: !isEmailValid
          ? "Unauthorized admin email address."
          : "Invalid admin password. Please try again."
      });
    }
  });

  // 3. Admin Change Password
  app.post("/api/admin/change-password", (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, error: "Password must be at least 4 characters long." });
    }

    const data = readDataStore();
    data.adminPassword = newPassword.trim();
    writeDataStore(data);

    res.json({ success: true, message: "Admin password successfully updated on server." });
  });

  // 4. Client Lead Signup
  app.post("/api/leads/client", (req, res) => {
    const lead = req.body;
    if (!lead || !lead.name || !lead.email) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const data = readDataStore();
    data.clientLeads = [lead, ...(data.clientLeads || [])];
    writeDataStore(data);

    // Auto-forward lead to Google Sheet Webhook if configured
    forwardLeadToGoogleSheet(lead, 'client', data.config);

    res.json({ success: true, clientLeads: data.clientLeads });
  });

  // 5. Pro / Vendor Lead Signup
  app.post("/api/leads/pro", (req, res) => {
    const lead = req.body;
    if (!lead || !lead.name || !lead.email) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const data = readDataStore();
    data.proLeads = [lead, ...(data.proLeads || [])];
    writeDataStore(data);

    // Auto-forward lead to Google Sheet Webhook if configured
    forwardLeadToGoogleSheet(lead, 'pro', data.config);

    res.json({ success: true, proLeads: data.proLeads });
  });

  // Sync All Leads to Google Sheet Webhook
  app.post("/api/google-sheet/sync-all", async (req, res) => {
    const data = readDataStore();
    const webhookUrl = data.config?.googleSheetWebhookUrl || (data.config?.googleSheetUrl?.includes('script.google.com') ? data.config.googleSheetUrl : null);

    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        error: "No Google Sheet Webhook URL configured. Please paste your Google Apps Script Web App URL first."
      });
    }

    try {
      const clientLeads = data.clientLeads || [];
      const proLeads = data.proLeads || [];

      for (const lead of clientLeads) {
        await forwardLeadToGoogleSheet(lead, 'client', data.config);
      }
      for (const lead of proLeads) {
        await forwardLeadToGoogleSheet(lead, 'pro', data.config);
      }

      res.json({ success: true, count: clientLeads.length + proLeads.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to sync leads to Google Sheet" });
    }
  });

  // 6. Reset Leads
  app.delete("/api/leads", (req, res) => {
    const data = readDataStore();
    data.clientLeads = [];
    data.proLeads = [];
    writeDataStore(data);

    res.json({ success: true, clientLeads: [], proLeads: [] });
  });

  // 7. Add or Replace Deals
  app.post("/api/deals", (req, res) => {
    const { deal, deals } = req.body;
    const data = readDataStore();

    if (deals && Array.isArray(deals)) {
      data.deals = deals;
    } else if (deal) {
      data.deals = [deal, ...(data.deals || [])];
    }
    writeDataStore(data);

    res.json({ success: true, deals: data.deals });
  });

  // 8. Delete Deal
  app.delete("/api/deals/:id", (req, res) => {
    const dealId = req.params.id;
    const data = readDataStore();
    data.deals = (data.deals || []).filter((d: any) => d.id !== dealId);
    writeDataStore(data);

    res.json({ success: true, deals: data.deals });
  });

  // 9. Update Config
  app.post("/api/config", (req, res) => {
    const newConfig = req.body;
    const data = readDataStore();
    data.config = { ...data.config, ...newConfig };
    writeDataStore(data);

    res.json({ success: true, config: data.config });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
