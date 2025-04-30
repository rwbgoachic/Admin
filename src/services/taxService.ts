import { supabase } from '../lib/supabase';

interface TaxBracket {
  threshold_low: number;
  threshold_high?: number;
  rate: number;
}

interface TaxRate {
  id: string;
  type: string;
  state?: string;
  description?: string;
  calculation_method: 'bracket' | 'flat' | 'percentage';
  flat_amount?: number;
  rate?: number;
  jurisdiction?: string;
  authority?: string;
  effective_date: Date;
  expiration_date?: Date;
  notes?: string;
  brackets?: TaxBracket[];
}

export class TaxService {
  /**
   * Get applicable tax rates for a given date
   */
  static async getTaxRates(date: Date = new Date()): Promise<TaxRate[]> {
    const { data, error } = await supabase
      .from('tax_rates')
      .select(`
        *,
        brackets:tax_brackets(*)
      `)
      .lte('effective_date', date.toISOString())
      .or(`expiration_date.is.null,expiration_date.gt.${date.toISOString()}`);

    if (error) throw error;
    return data || [];
  }

  /**
   * Calculate tax for a given amount using specified tax rate
   */
  static calculateTax(amount: number, taxRate: TaxRate): number {
    switch (taxRate.calculation_method) {
      case 'flat':
        return taxRate.flat_amount || 0;
      
      case 'percentage':
        return amount * (taxRate.rate || 0);
      
      case 'bracket':
        return this.calculateTaxWithBrackets(amount, taxRate.brackets || []);
    }
  }

  /**
   * Calculate tax using tax brackets
   */
  private static calculateTaxWithBrackets(amount: number, brackets: TaxBracket[]): number {
    if (amount <= 0 || !brackets.length) return 0;
    
    let tax = 0;
    const sortedBrackets = [...brackets].sort((a, b) => a.threshold_low - b.threshold_low);
    
    for (let i = 0; i < sortedBrackets.length; i++) {
      const bracket = sortedBrackets[i];
      const nextBracket = sortedBrackets[i + 1];
      
      if (amount <= bracket.threshold_low) break;
      
      const bracketMax = bracket.threshold_high || Infinity;
      const taxableInBracket = Math.min(amount, bracketMax) - bracket.threshold_low;
      
      if (taxableInBracket > 0) {
        tax += taxableInBracket * bracket.rate;
      }
      
      if (!bracket.threshold_high || amount <= bracket.threshold_high) break;
    }
    
    return tax;
  }

  /**
   * Calculate all applicable taxes for a given amount
   */
  static async calculateTaxes(amount: number, state: string): Promise<{
    federal: number;
    state: number;
    social: number;
    medicare: number;
    total: number;
  }> {
    const taxRates = await this.getTaxRates();
    
    // Find federal tax rate
    const federalTaxRate = taxRates.find(rate => 
      rate.type === 'federal' && 
      rate.calculation_method === 'bracket'
    );
    
    // Find state tax rate
    const stateTaxRate = taxRates.find(rate => 
      rate.type === 'state' && 
      rate.state === state && 
      rate.calculation_method === 'bracket'
    );
    
    // Find social security tax rate
    const socialSecurityTaxRate = taxRates.find(rate => 
      rate.type === 'social_security' && 
      rate.calculation_method === 'percentage'
    );
    
    // Find medicare tax rate
    const medicareTaxRate = taxRates.find(rate => 
      rate.type === 'medicare' && 
      rate.calculation_method === 'percentage'
    );
    
    // Calculate federal tax
    const federalTax = federalTaxRate 
      ? this.calculateTax(amount, federalTaxRate) 
      : amount * 0.15; // Default fallback rate
    
    // Calculate state tax
    const stateTax = stateTaxRate 
      ? this.calculateTax(amount, stateTaxRate) 
      : amount * 0.05; // Default fallback rate
    
    // Calculate social security tax (6.2% up to wage base limit)
    const socialSecurityWageBase = 160200; // 2023 wage base
    const socialSecurityTax = socialSecurityTaxRate 
      ? Math.min(amount, socialSecurityWageBase) * (socialSecurityTaxRate.rate || 0.062)
      : Math.min(amount, socialSecurityWageBase) * 0.062;
    
    // Calculate medicare tax (1.45% with no wage base)
    const medicareTax = medicareTaxRate 
      ? amount * (medicareTaxRate.rate || 0.0145)
      : amount * 0.0145;
    
    return {
      federal: federalTax,
      state: stateTax,
      social: socialSecurityTax,
      medicare: medicareTax,
      total: federalTax + stateTax + socialSecurityTax + medicareTax
    };
  }
}