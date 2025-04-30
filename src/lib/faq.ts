import { supabase } from './supabase';
import type { FAQ } from './types';

export async function getFAQs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createFAQ(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('faqs')
    .insert([faq])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFAQ(id: string, faq: Partial<FAQ>) {
  const { data, error } = await supabase
    .from('faqs')
    .update(faq)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function searchFAQs(query: string) {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .order('category', { ascending: true });

  if (error) throw error;
  return data;
}