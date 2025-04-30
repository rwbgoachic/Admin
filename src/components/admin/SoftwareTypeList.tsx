import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { SoftwareTypeForm } from './SoftwareTypeForm';
import { supabase } from '../../lib/supabase';
import type { SoftwareType, SoftwareCategory } from '../../types/database';

export function SoftwareTypeList() {
  const [types, setTypes] = useState<SoftwareType[]>([]);
  const [selectedType, setSelectedType] = useState<SoftwareType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadSoftwareTypes();
  }, [sortField, sortDirection]);

  async function loadSoftwareTypes() {
    try {
      const { data, error } = await supabase
        .from('software_types')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      setTypes(data);
    } catch (error) {
      toast.error('Failed to load software types');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this software type?')) return;

    try {
      const { error } = await supabase
        .from('software_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Software type deleted successfully');
      setTypes(types.filter(type => type.id !== id));
    } catch (error) {
      toast.error('Failed to delete software type');
      console.error('Error:', error);
    }
  }

  function handleEdit(type: SoftwareType) {
    setSelectedType(type);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setSelectedType(null);
    setIsFormOpen(false);
  }

  function handleFormSubmit() {
    loadSoftwareTypes();
    handleFormClose();
  }

  function handleSort(field: 'name' | 'category') {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const filteredTypes = types.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        <h2 className="text-xl font-semibold text-gray-900">Software Types</h2>
        <TouchFriendlyButton
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </TouchFriendlyButton>
      </div>

      <div className="flex gap-4 items-end">
        <TouchFriendlyInput
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          icon={<Search className="h-4 w-4 text-gray-400" />}
          placeholder="Search by name or description..."
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Filter
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as SoftwareCategory | 'all')}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px]"
          >
            <option value="all">All Categories</option>
            <option value="pos_grocery">Grocery POS</option>
            <option value="pos_restaurant">Restaurant POS</option>
            <option value="payroll">Payroll</option>
            <option value="inventory">Inventory</option>
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
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {sortField === 'category' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {type.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {type.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(type)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </TouchFriendlyButton>
                  <TouchFriendlyButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </TouchFriendlyButton>
                </td>
              </tr>
            ))}
            {filteredTypes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No software types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SoftwareTypeForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedType}
      />
    </div>
  );
}