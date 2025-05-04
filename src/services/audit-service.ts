import { supabase } from '../lib/supabase';

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  changes: Record<string, any>;
  created_at: string;
}

export class AuditService {
  static async log(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    changes: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase.from('audit_logs').insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        user_id: userId,
        changes
      });

      if (error) {
        console.error('Failed to create audit log:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error in audit logging:', err);
      throw err;
    }
  }

  static async getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error;
    }

    return data;
  }
}