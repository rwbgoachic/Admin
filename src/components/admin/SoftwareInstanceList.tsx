import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Globe, Smartphone } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { SoftwareInstanceForm } from './SoftwareInstanceForm';
import { supabase } from '../../lib/supabase';
import type { SoftwareInstance, SoftwareType } from '../../types/database';

export function SoftwareInstanceList() {
  const [instances, setInstances] = useState<(SoftwareInstance & { software_type: SoftwareType })[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<SoftwareInstance | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<string | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'type' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>([]);

  useEffect(() => {
    loadSoftwareInstances();
    loadSoftwareTypes();
  }, [sortField, sortDirection]);

  async function loadSoftwareTypes() {
    try {
      const { data, error } = await supabase
        .from('software_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setSoftwareTypes(data);
    } catch (error) {
      toast.error('Failed to load software types');
      console.error('Error:', error);
    }
  }

  async function loadSoftwareInstances() {
    try {
      let query = supabase
        .from('software_instances')
        .select(`
          *,
          software_type:type_id (*)
        `);

      switch (sortField) {
        case 'type':
          query = query.order('software_type(name)', { ascending: sortDirection === 'asc' });
          break;
        case 'status':
          query = query.order('active', { ascending: sortDirection === 'asc' });
          break;
        default:
          query = query.order('name', { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;

      if (error) throw error;
      setInstances(data);
    } catch (error) {
      toast.error('Failed to load software instances');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this software instance?')) return;

    try {
      const { error } = await supabase
        .from('software_instances')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Software instance deleted successfully');
      setInstances(instances.filter(instance => instance.id !== id));
    } catch (error) {
      toast.error('Failed to delete software instance');
      console.error('Error:', error);
    }
  }

  function handleEdit(instance: SoftwareInstance) {
    setSelectedInstance(instance);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setSelectedInstance(null);
    setIsFormOpen(false);
  }

  function handleFormSubmit() {
    loadSoftwareInstances();
    handleFormClose();
  }

  function handleSort(field: 'name' | 'type' | 'status') {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.software_type?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeId === 'all' || instance.type_id === selectedTypeId;
    return matchesSearch && matchesType;
  });

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
        <h2 className="text-xl font-semibold text-gray-900">Software Instances</h2>
        <TouchFriendlyButton
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Instance
        </TouchFriendlyButton>
      </div>

      <div className="flex gap-4 items-end">
        <TouchFriendlyInput
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          icon={<Search className="h-4 w-4 text-gray-400" />}
          placeholder="Search by name or type..."
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Software Type Filter
          </label>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px]"
          >
            <option value="all">All Types</option>
            {softwareTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Type
                  {sortField === 'type' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URLs
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInstances.map((instance) => (
              <tr key={instance.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {instance.name}
                  {instance.wallet_type && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({instance.wallet_type === 'employer_employee' ? 'Employer-Employee' : 'Parent-Child'})
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {instance.software_type?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={clsx(
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    instance.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {instance.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {instance.site_url && (
                      <a
                        href={instance.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Web Application"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {instance.mobile_app_url && (
                      <a
                        href={instance.mobile_app_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Mobile Application"
                      >
                        <Smartphone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(instance)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </TouchFriendlyButton>
                  <TouchFriendlyButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(instance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </TouchFriendlyButton>
                </td>
              </tr>
            ))}
            {filteredInstances.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No software instances found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SoftwareInstanceForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedInstance}
        softwareTypes={softwareTypes}
      />
    </div>
  );
}