import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { PaysurityAdminForm } from './PaysurityAdminForm';
import { supabase } from '../../lib/supabase';
import type { PaysurityAdmin } from '../../types/database';

export function PaysurityAdminList() {
  const [admins, setAdmins] = useState<PaysurityAdmin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<PaysurityAdmin | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const { data, error } = await supabase
        .from('paysurity_admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data);
    } catch (error) {
      toast.error('Failed to load admins');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const { error } = await supabase
        .from('paysurity_admins')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Admin deleted successfully');
      setAdmins(admins.filter(admin => admin.id !== id));
    } catch (error) {
      toast.error('Failed to delete admin');
      console.error('Error:', error);
    }
  }

  function handleEdit(admin: PaysurityAdmin) {
    setSelectedAdmin(admin);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setSelectedAdmin(null);
    setIsFormOpen(false);
  }

  function handleFormSubmit() {
    loadAdmins();
    handleFormClose();
  }

  const filteredAdmins = admins.filter(admin => 
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Paysurity Admins</h2>
        <TouchFriendlyButton
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </TouchFriendlyButton>
      </div>

      <TouchFriendlyInput
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="h-4 w-4 text-gray-400" />}
        placeholder="Search by role..."
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {admin.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(admin)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </TouchFriendlyButton>
                  <TouchFriendlyButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </TouchFriendlyButton>
                </td>
              </tr>
            ))}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaysurityAdminForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedAdmin}
      />
    </div>
  );
}