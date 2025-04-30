import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import type { SoftwareCategory, SoftwareType } from '../../types/database';

interface SoftwareTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: SoftwareType | null;
}

export function SoftwareTypeForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: SoftwareTypeFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SoftwareCategory>('pos_grocery');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCategory('pos_grocery');
      setDescription('');
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (initialData) {
        const { error } = await supabase
          .from('software_types')
          .update({ name, category, description })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Software type updated successfully');
      } else {
        const { error } = await supabase
          .from('software_types')
          .insert([{ name, category, description }]);

        if (error) throw error;
        toast.success('Software type created successfully');
      }

      onSubmit();
    } catch (error) {
      toast.error(
        initialData
          ? 'Failed to update software type'
          : 'Failed to create software type'
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
                    {initialData ? 'Edit' : 'Add'} Software Type
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
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SoftwareCategory)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px]"
                      required
                    >
                      <option value="pos_grocery">Grocery POS</option>
                      <option value="pos_restaurant">Restaurant POS</option>
                      <option value="payroll">Payroll</option>
                      <option value="inventory">Inventory</option>
                    </select>
                  </div>

                  <TouchFriendlyInput
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                  />

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