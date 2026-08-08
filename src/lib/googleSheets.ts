import { ClientLead, ProLead } from '../types';

export function extractSpreadsheetId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (trimmed.includes('script.google.com')) return '';
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Check if it looks like a valid spreadsheet ID string (not a URL)
  if (!trimmed.includes('/') && !trimmed.includes(':') && trimmed.length > 15) {
    return trimmed;
  }
  return '';
}

export function getSpreadsheetUrl(spreadsheetId: string): string {
  if (!spreadsheetId) return '';
  if (spreadsheetId.startsWith('https://docs.google.com/spreadsheets')) {
    return spreadsheetId;
  }
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) return '';
  return `https://docs.google.com/spreadsheets/d/${cleanId}`;
}

export async function createGoogleSheetDatabase(
  accessToken: string,
  brandName = 'THE MIRRO'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const title = `${brandName} - Live Registered Leads Database`;

  const payload = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Client Leads',
          gridProperties: { rowCount: 1000, columnCount: 10 },
        },
      },
      {
        properties: {
          title: 'Salon Pro Partners',
          gridProperties: { rowCount: 1000, columnCount: 10 },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || getSpreadsheetUrl(spreadsheetId);

  return { spreadsheetId, spreadsheetUrl };
}

export async function syncLeadsToSheet(
  accessToken: string,
  spreadsheetId: string,
  clientLeads: ClientLead[],
  proLeads: ProLead[]
): Promise<boolean> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) throw new Error('Invalid Google Sheet ID');

  // 1. Format Client Leads
  const clientHeader = [
    'Type',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Neighborhood',
    'Requested Services',
    'Date Registered',
  ];

  const clientRows = clientLeads.map((c) => [
    'Client Lead',
    c.name || '',
    c.email || '',
    c.phone || '',
    c.neighborhood || '',
    (c.services || []).join(', '),
    c.createdAt || '',
  ]);

  const clientValues = [clientHeader, ...clientRows];

  // 2. Format Pro Leads
  const proHeader = [
    'Type',
    'Full Name',
    'Business Name',
    'Service Specialty',
    'Email Address',
    'Phone Number',
    'Neighborhood',
    'Date Registered',
  ];

  const proRows = proLeads.map((p) => [
    'Salon Pro Partner',
    p.name || '',
    p.businessName || '',
    p.serviceType || '',
    p.email || '',
    p.phone || '',
    p.neighborhood || '',
    p.createdAt || '',
  ]);

  const proValues = [proHeader, ...proRows];

  // Update Client Leads tab
  const clientRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/'Client Leads'!A1:G${clientValues.length + 10}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `'Client Leads'!A1:G${clientValues.length}`,
        majorDimension: 'ROWS',
        values: clientValues,
      }),
    }
  );

  if (!clientRes.ok) {
    console.warn('Client tab update failed, trying sheet range A1', await clientRes.text());
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/A1:G${clientValues.length + 10}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `A1:G${clientValues.length}`,
          majorDimension: 'ROWS',
          values: clientValues,
        }),
      }
    );
  }

  // Update Pro Leads tab if present
  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/'Salon Pro Partners'!A1:H${proValues.length + 10}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `'Salon Pro Partners'!A1:H${proValues.length}`,
          majorDimension: 'ROWS',
          values: proValues,
        }),
      }
    );
  } catch (e) {
    console.warn('Pro tab sync warning:', e);
  }

  return true;
}
