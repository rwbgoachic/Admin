import { supabase } from './supabase';
import { logger } from './logger';

export async function trackError(error: Error, context: Record<string, unknown> = {}) {
  try {
    const { error: dbError } = await supabase
      .from('error_logs')
      .insert([{
        error_message: error.message,
        stack_trace: error.stack,
        context,
      }]);

    if (dbError) throw dbError;
  } catch (err) {
    logger.error('Failed to track error', {
      error: error.message,
      trackingError: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export async function resolveError(id: string, userId: string) {
  try {
    const { error } = await supabase
      .from('error_logs')
      .update({
        resolved_at: new Date().toISOString(),
        resolved_by: userId,
      })
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    logger.error('Failed to resolve error', {
      errorId: id,
      userId,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
    throw err;
  }
}