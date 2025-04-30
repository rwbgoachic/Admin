import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { PaysurityServiceForm } from './PaysurityServiceForm';
import { supabase } from '../../lib/supabase';
import type { PaysurityService } from '../../types/database';

export function PaysurityServiceList() {
  const [services, setServices] = useState<PaysurityService[]>([]);
  const [selectedService, setSelectedService] = useState<PaysurityService | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from('paysurity_services')
        .select('*')
        .order('name');

      if (error) throw error;
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('paysurity_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Service deleted successfully');
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      toast.error('Failed to delete service');
      console.error('Error:', error);
    }
  }

  function handleEdit(service: PaysurityService) {
    setSelectedService(service);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setSelectedService(null);
    setIsFormOpen(false);
  }

  function handleFormSubmit() {
    loadServices();
    handleFormClose();
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-xl font-semibold text-gray-900">Paysurity Services</h2>
        <TouchFriendlyButton
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </TouchFriendlyButton>
      </div>

      <TouchFriendlyInput
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="h-4 w-4 text-gray-400" />}
        placeholder="Search services..."
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.enabled ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </TouchFriendlyButton>
                  <TouchFriendlyButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </TouchFriendlyButton>
                </td>
              </tr>
            ))}
            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaysurityServiceForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedService}
      />
    </div>
  );
}