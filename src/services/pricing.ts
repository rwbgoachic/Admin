import { supabase } from '../lib/supabase';

export class PricingService {
  private static instance: PricingService;
  private rates: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  async getDeliveryCommissionRate(): Promise<number> {
    if (this.rates.has('delivery_commission_rate')) {
      return this.rates.get('delivery_commission_rate')!;
    }

    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'delivery_commission_rate')
      .single();

    if (error) throw error;
    
    const rate = parseFloat(data.value);
    this.rates.set('delivery_commission_rate', rate);
    return rate;
  }

  async setDeliveryCommissionRate(rate: number): Promise<void> {
    if (rate < 0 || rate > 10) {
      throw new Error('Commission rate must be between 0 and 10%');
    }

    const { error } = await supabase
      .from('system_settings')
      .update({ value: rate.toString() })
      .eq('key', 'delivery_commission_rate');

    if (error) throw error;
    
    this.rates.set('delivery_commission_rate', rate);
  }

  clearCache(): void {
    this.rates.clear();
  }
}