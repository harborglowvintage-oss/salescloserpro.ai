/**
 * SalesCloserPro — State Tax & Freight Database
 * Sources: State revenue department publications (2025)
 * DISCLAIMER: Verify rates with your accountant for final invoices.
 *
 * taxRate        — combined state + avg local sales tax rate
 * freightTaxable — is freight/shipping taxable in this state?
 * laborTaxable   — is installation/labor taxable in this state?
 * notes          — plain-English summary of key rules
 */

export const stateTaxData = {
  AL: { name: 'Alabama',        taxRate: 0.09220, freightTaxable: false, laborTaxable: false, notes: 'High local rates. Freight exempt if separately stated. Labor on installation generally exempt.' },
  AK: { name: 'Alaska',         taxRate: 0.01820, freightTaxable: false, laborTaxable: false, notes: 'No state sales tax. Local taxes only (Juneau, Anchorage, etc.). Freight generally exempt.' },
  AZ: { name: 'Arizona',        taxRate: 0.08370, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Labor/installation exempt.' },
  AR: { name: 'Arkansas',       taxRate: 0.09470, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  CA: { name: 'California',     taxRate: 0.08680, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately itemized. Installation labor exempt.' },
  CO: { name: 'Colorado',       taxRate: 0.07720, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation exempt.' },
  CT: { name: 'Connecticut',    taxRate: 0.06350, freightTaxable: true,  laborTaxable: true,  notes: 'Freight IS taxable. Many services including installation ARE taxable at 6.35%.' },
  DE: { name: 'Delaware',       taxRate: 0.00000, freightTaxable: false, laborTaxable: false, notes: 'No sales tax. One of five no-sales-tax states.' },
  FL: { name: 'Florida',        taxRate: 0.07010, freightTaxable: true,  laborTaxable: false, notes: 'Freight taxable when included in sale price. Installation labor exempt.' },
  GA: { name: 'Georgia',        taxRate: 0.07320, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Labor/installation exempt.' },
  HI: { name: 'Hawaii',         taxRate: 0.04440, freightTaxable: true,  laborTaxable: true,  notes: 'General Excise Tax (GET) applies broadly. Most services including labor ARE taxable.' },
  ID: { name: 'Idaho',          taxRate: 0.06020, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor exempt.' },
  IL: { name: 'Illinois',       taxRate: 0.08820, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor generally exempt.' },
  IN: { name: 'Indiana',        taxRate: 0.07000, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation exempt.' },
  IA: { name: 'Iowa',           taxRate: 0.06940, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor exempt.' },
  KS: { name: 'Kansas',         taxRate: 0.08690, freightTaxable: true,  laborTaxable: true,  notes: 'Freight IS taxable. Labor to install tangible property IS taxable.' },
  KY: { name: 'Kentucky',       taxRate: 0.06000, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  LA: { name: 'Louisiana',      taxRate: 0.09560, freightTaxable: false, laborTaxable: false, notes: 'Very high local rates. Freight exempt. Labor for installation exempt.' },
  ME: { name: 'Maine',          taxRate: 0.05500, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor exempt.' },
  MD: { name: 'Maryland',       taxRate: 0.06000, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor generally exempt.' },
  MA: { name: 'Massachusetts',  taxRate: 0.06250, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor exempt.' },
  MI: { name: 'Michigan',       taxRate: 0.06000, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor exempt.' },
  MN: { name: 'Minnesota',      taxRate: 0.07490, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor generally exempt.' },
  MS: { name: 'Mississippi',    taxRate: 0.07070, freightTaxable: true,  laborTaxable: true,  notes: 'Freight IS taxable. Installation labor IS taxable at 7%.' },
  MO: { name: 'Missouri',       taxRate: 0.08190, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation exempt.' },
  MT: { name: 'Montana',        taxRate: 0.00000, freightTaxable: false, laborTaxable: false, notes: 'No sales tax state.' },
  NE: { name: 'Nebraska',       taxRate: 0.06940, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor exempt.' },
  NV: { name: 'Nevada',         taxRate: 0.08230, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Labor for installation exempt.' },
  NH: { name: 'New Hampshire',  taxRate: 0.00000, freightTaxable: false, laborTaxable: false, notes: 'No sales tax state.' },
  NJ: { name: 'New Jersey',     taxRate: 0.06600, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor generally exempt.' },
  NM: { name: 'New Mexico',     taxRate: 0.07830, freightTaxable: true,  laborTaxable: true,  notes: 'Gross Receipts Tax (not sales tax). Freight and labor BOTH taxable.' },
  NY: { name: 'New York',       taxRate: 0.08520, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor generally exempt.' },
  NC: { name: 'North Carolina', taxRate: 0.06990, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  ND: { name: 'North Dakota',   taxRate: 0.05960, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  OH: { name: 'Ohio',           taxRate: 0.07170, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable when included in sale. Labor for installation generally exempt.' },
  OK: { name: 'Oklahoma',       taxRate: 0.08980, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation exempt.' },
  OR: { name: 'Oregon',         taxRate: 0.00000, freightTaxable: false, laborTaxable: false, notes: 'No sales tax state.' },
  PA: { name: 'Pennsylvania',   taxRate: 0.06340, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor exempt.' },
  RI: { name: 'Rhode Island',   taxRate: 0.07000, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  SC: { name: 'South Carolina', taxRate: 0.07470, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Labor for installation exempt.' },
  SD: { name: 'South Dakota',   taxRate: 0.06400, freightTaxable: true,  laborTaxable: true,  notes: 'Freight IS taxable. Labor for installation IS taxable.' },
  TN: { name: 'Tennessee',      taxRate: 0.09550, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  TX: { name: 'Texas',          taxRate: 0.08250, freightTaxable: false, laborTaxable: true,  notes: 'Freight exempt if separately stated. Installation labor on real property IS taxable.' },
  UT: { name: 'Utah',           taxRate: 0.07190, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation exempt.' },
  VT: { name: 'Vermont',        taxRate: 0.06360, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor generally exempt.' },
  VA: { name: 'Virginia',       taxRate: 0.05750, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Installation labor exempt.' },
  WA: { name: 'Washington',     taxRate: 0.09230, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  WV: { name: 'West Virginia',  taxRate: 0.06390, freightTaxable: true,  laborTaxable: false, notes: 'Freight IS taxable. Installation labor generally exempt.' },
  WI: { name: 'Wisconsin',      taxRate: 0.05430, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt if separately stated. Installation labor exempt.' },
  WY: { name: 'Wyoming',        taxRate: 0.05490, freightTaxable: false, laborTaxable: false, notes: 'Freight generally exempt. Installation labor exempt.' },
  DC: { name: 'Washington DC',  taxRate: 0.06000, freightTaxable: false, laborTaxable: false, notes: 'Freight exempt. Labor for installation generally exempt.' },
}

/**
 * Returns tax amounts for a quote line item.
 * @param {string} stateCode - Two-letter state code (e.g. 'TX')
 * @param {'product'|'freight'|'labor'|'service'} type - Line item type
 * @param {number} amount - Pre-tax dollar amount
 * @returns {{ taxAmount: number, taxRate: number, taxable: boolean }}
 */
export function calculateTax(stateCode, type, amount) {
  const state = stateTaxData[stateCode]
  if (!state) return { taxAmount: 0, taxRate: 0, taxable: false }

  let taxable = false

  if (type === 'product' || type === 'service') {
    taxable = state.taxRate > 0
  } else if (type === 'freight') {
    taxable = state.freightTaxable
  } else if (type === 'labor') {
    taxable = state.laborTaxable
  }

  const taxRate = taxable ? state.taxRate : 0
  const taxAmount = amount * taxRate

  return {
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    taxRate,
    taxable,
  }
}

export const stateList = Object.entries(stateTaxData)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name))
