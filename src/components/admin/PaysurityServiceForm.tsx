import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import type { PaysurityService } from '../../types/database';

interface PaysurityServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: PaysurityService | null;
}

export function PaysurityServiceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PaysurityServiceFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setEnabled(initialData.enabled);
      setConfig(initialData.config);
    } else {
      setName('');
      setDescription('');
      setEnabled(true);
      setConfig({});
    }
    setErrors({});
  }, [initialData]);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = {
        name,
        description: description || null,
        enabled,
        config,
      };

      if (initialData) {
        const { error } = await supabase
          .from('paysurity_services')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('paysurity_services')
          .insert([data]);

        if (error) throw error;
        toast.success('Service created successfully');
      }

      onSubmit();
    } catch (error) {
      toast.error(
        initialData
          ? 'Failed to update service'
          : 'Failed to create service'
      );
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {initialData ? 'Edit' : 'Add'} Service
                  </h3>
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </TouchFriendlyButton>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TouchFriendlyInput
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    required
                  />

                  <TouchFriendlyInput
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={enabled}
                      onChange={(e) => setEnabled(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                      Enabled
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <TouchFriendlyButton
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </TouchFriendlyButton>
                    <TouchFriendlyButton
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </TouchFriendlyButton>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}