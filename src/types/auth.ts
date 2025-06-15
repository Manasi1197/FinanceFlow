
export type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

export interface Country {
  code: string;
  name: string;
  currency: string;
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD ($)' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP (£)' },
  { code: 'CA', name: 'Canada', currency: 'CAD (C$)' },
  { code: 'AU', name: 'Australia', currency: 'AUD (A$)' },
  { code: 'DE', name: 'Germany', currency: 'EUR (€)' },
  { code: 'FR', name: 'France', currency: 'EUR (€)' },
  { code: 'JP', name: 'Japan', currency: 'JPY (¥)' },
  { code: 'IN', name: 'India', currency: 'INR (₹)' },
  { code: 'BR', name: 'Brazil', currency: 'BRL (R$)' },
  { code: 'MX', name: 'Mexico', currency: 'MXN ($)' },
  { code: 'ES', name: 'Spain', currency: 'EUR (€)' },
  { code: 'IT', name: 'Italy', currency: 'EUR (€)' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR (€)' },
  { code: 'SE', name: 'Sweden', currency: 'SEK (kr)' },
  { code: 'NO', name: 'Norway', currency: 'NOK (kr)' },
  { code: 'DK', name: 'Denmark', currency: 'DKK (kr)' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF (CHF)' },
  { code: 'SG', name: 'Singapore', currency: 'SGD (S$)' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD (HK$)' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR (R)' }
];
