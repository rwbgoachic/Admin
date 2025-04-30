import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import type { PaysurityAdmin } from '../../types/database';

interface PaysurityAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: PaysurityAdmin | null;
}

export function PaysurityAdminForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: PaysurityAdminFormProps) {
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState<Record<string, unknown>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setRole(initialData.role);
      setPermissions(initialData.permissions);
    } else {
      setRole('');
      setPermissions({});
    }
    setErrors({});
  }, [initialData]);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!role.trim()) {
      newErrors.role = 'Role is required';
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
        role,
        permissions,
      };

      if (initialData) {
        const { error } = await supabase
          .from('paysurity_admins')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Admin updated successfully');
      } else {
        const { error } = await supabase
          .from('paysurity_admins')
          .insert([data]);

        if (error) throw error;
        toast.success('Admin created successfully');
      }

      onSubmit();
    } catch (error) {
      toast.error(
        initialData
          ? 'Failed to update admin'
          : 'Failed to create admin'
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
                    {initialData ? 'Edit' : 'Add'} Admin
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px] ${
                        errors.role ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="">Select a role</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
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