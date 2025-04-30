import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { CircuitBreaker } from '../lib/resilience';

interface TaxRate {
  state: string;
  rate: number;
  localSurtax: number;
  effectiveDate: Date;
}

interface TaxCalculation {
  federal: number;
  state: number;
  local: number;
  total: number;
}

const MOCK_IRS_API = 'https://api.irs.gov/v1';

// Create circuit breakers for each critical operation
const irsCircuitBreaker = new CircuitBreaker({
  maxFailures: 3,
  resetTimeout: 300000, // 5 minutes
});

const taxCalculationCircuitBreaker = new CircuitBreaker({
  maxFailures: 5,
  resetTimeout: 60000, // 1 minute
});

/**
 * Fetches current federal and state tax rates from the IRS API
 */
export async function syncWithIRS(): Promise<TaxRate[]> {
  return irsCircuitBreaker.execute(async () => {
    try {
      // In a real implementation, this would call the actual IRS API
      // For now, we'll use mock data
      const mockRates: TaxRate[] = [
        {
          state: 'CA',
          rate: 0.0725,
          localSurtax: 0.01,
          effectiveDate: new Date(),
        },
        {
          state: 'NY',
          rate: 0.0885,
          localSurtax: 0.00875,
          effectiveDate: new Date(),
        },
      ];

      // Store the rates in Supabase for offline access
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'tax_rates',
          value: mockRates,
          description: 'Current tax rates from IRS',
        });

      if (error) throw error;

      await logger.info('Tax rates synced with IRS', {
        timestamp: new Date().toISOString(),
        rateCount: mockRates.length,
      });

      return mockRates;
    } catch (error) {
      await logger.error('Failed to sync tax rates', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }, 'syncWithIRS');
}

/**
 * Calculates payroll taxes based on gross pay and location
 */
export async function calculatePayrollTaxes(
  grossPay: number,
  state: string
): Promise<TaxCalculation> {
  return taxCalculationCircuitBreaker.execute(async () => {
    try {
      // Get current tax rates from the database
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'tax_rates')
        .single();

      if (error) throw error;

      const taxRates = settings.value as TaxRate[];
      const stateRate = taxRates.find(rate => rate.state === state);

      if (!stateRate) {
        throw new Error(`Tax rates not found for state: ${state}`);
      }

      // Mock federal tax rate (would come from IRS tables in production)
      const federalRate = 0.22;

      // Calculate taxes using the formula: (grossPay * taxRate) + localSurtax
      const federalTax = grossPay * federalRate;
      const stateTax = grossPay * stateRate.rate;
      const localTax = grossPay * stateRate.localSurtax;

      const calculation: TaxCalculation = {
        federal: federalTax,
        state: stateTax,
        local: localTax,
        total: federalTax + stateTax + localTax,
      };

      await logger.info('Tax calculation completed', {
        grossPay,
        state,
        calculation,
      });

      return calculation;
    } catch (error) {
      await logger.error('Failed to calculate taxes', {
        error: error instanceof Error ? error.message : 'Unknown error',
        grossPay,
        state,
      });
      throw error;
    }
  }, 'calculatePayrollTaxes');
}