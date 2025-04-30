import { supabase } from './supabase';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export async function log(
  level: LogLevel,
  message: string,
  context: Record<string, unknown> = {}
) {
  try {
    const { error } = await supabase
      .from('system_logs')
      .insert([{ level, message, context }]);

    if (error) throw error;
  } catch (err) {
    console.error('Failed to write to system logs:', err);
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
};