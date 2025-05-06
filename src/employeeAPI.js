const express = require('express');
const { supabase } = require('./lib/supabase');
const { AuditService } = require('./services/audit-service');

const router = express.Router();

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(data);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create new employee
router.post('/employees', async (req, res) => {
  try {
    const { username, full_name, avatar_url } = req.body;
    
    if (!username || !full_name) {
      return res.status(400).json({ error: 'Username and full name are required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ username, full_name, avatar_url }])
      .select()
      .single();

    if (error) throw error;

    // Log the creation in audit logs
    await AuditService.log(
      'create',
      'profiles',
      data.id,
      req.user.id,
      { username, full_name, avatar_url }
    );

    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const { username, full_name, avatar_url } = req.body;
    const id = req.params.id;

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

    // Log the update in audit logs
    await AuditService.log(
      'update',
      'profiles',
      id,
      req.user.id,
      {
        old: oldData,
        new: data
      }
    );

    res.json(data);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const id = req.params.id;

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

    // Log the deletion in audit logs
    await AuditService.log(
      'delete',
      'profiles',
      id,
      req.user.id,
      { deleted_profile: oldData }
    );

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;