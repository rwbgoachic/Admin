import { supabase } from '../lib/supabase';
import { AuditService } from '../services/audit-service';

export const createEmployee = async (employeeData, userId) => {
  const { username, full_name, avatar_url } = employeeData;
  
  if (!username || !full_name) {
    throw new Error('Username and full name are required');
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([{ username, full_name, avatar_url }])
    .select()
    .single();

  if (error) throw error;

  await AuditService.log(
    'create',
    'profiles',
    data.id,
    userId,
    { username, full_name, avatar_url }
  );

  return data;
};

export const getEmployee = async (id) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) {
    throw new Error('Employee not found');
  }

  return data;
};

export const getAllEmployees = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('username');

  if (error) throw error;
  return data;
};

export const updateEmployee = async (id, updates, userId) => {
  const { username, full_name, avatar_url } = updates;

  // Get current employee data for audit log
  const { data: oldData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  const { data, error } = await supabase
    .from('profiles')
    .update({ username, full_name, avatar_url })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await AuditService.log(
    'update',
    'profiles',
    id,
    userId,
    {
      old: oldData,
      new: data
    }
  );

  return data;
};

export const deleteEmployee = async (id, userId) => {
  // Get employee data for audit log before deletion
  const { data: oldData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await AuditService.log(
    'delete',
    'profiles',
    id,
    userId,
    { deleted_profile: oldData }
  );

  return true;
};