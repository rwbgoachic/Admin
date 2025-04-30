import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import type { SoftwareInstance, SoftwareType, WalletType } from '../../types/database';

interface SoftwareInstanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: SoftwareInstance | null;
  softwareTypes: SoftwareType[];
}

export function SoftwareInstanceForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  softwareTypes,
}: SoftwareInstanceFormProps) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [active, setActive] = useState(true);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [siteUrl, setSiteUrl] = useState('');
  const [mobileAppUrl, setMobileAppUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedType = softwareTypes.find(type => type.id === typeId);
  const requiresWallet = selectedType?.category === 'pos_grocery' || selectedType?.category === 'pos_restaurant';

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTypeId(initialData.type_id);
      setActive(initialData.active);
      setWalletType(initialData.wallet_type);
      setSiteUrl(initialData.site_url || '');
      setMobileAppUrl(initialData.mobile_app_url || '');
    } else {
      setName('');
      setTypeId(softwareTypes[0]?.id || '');
      setActive(true);
      setWalletType(null);
      setSiteUrl('');
      setMobileAppUrl('');
    }
    setErrors({});
  }, [initialData, softwareTypes]);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!typeId) {
      newErrors.typeId = 'Software type is required';
    }

    if (requiresWallet && !walletType) {
      newErrors.walletType = 'Wallet type is required for POS software';
    }

    if (siteUrl && !isValidUrl(siteUrl)) {
      newErrors.siteUrl = 'Please enter a valid URL';
    }

    if (mobileAppUrl && !isValidUrl(mobileAppUrl)) {
      newErrors.mobileAppUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
        type_id: typeId,
        active,
        wallet_type: requiresWallet ? walletType : null,
        site_url: siteUrl || null,
        mobile_app_url: mobileAppUrl || null,
      };

      if (initialData) {
        const { error } = await supabase
          .from('software_instances')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Software instance updated successfully');
      } else {
        const { error } = await supabase
          .from('software_instances')
          .insert([data]);

        if (error) throw error;
        toast.success('Software instance created successfully');
      }

      onSubmit();
    } catch (error) {
      toast.error(
        initialData
          ? 'Failed to update software instance'
          : 'Failed to create software instance'
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
                    {initialData ? 'Edit' : 'Add'} Software Instance
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Software Type
                    </label>
                    <select
                      value={typeId}
                      onChange={(e) => {
                        setTypeId(e.target.value);
                        setWalletType(null);
                      }}
                      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px] ${
                        errors.typeId ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      {softwareTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {errors.typeId && (
                      <p className="mt-1 text-sm text-red-600">{errors.typeId}</p>
                    )}
                  </div>

                  {requiresWallet && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wallet Type
                      </label>
                      <select
                        value={walletType || ''}
                        onChange={(e) => setWalletType(e.target.value as WalletType)}
                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px] ${
                          errors.walletType ? 'border-red-300' : ''
                        }`}
                        required
                      >
                        <option value="">Select a wallet type</option>
                        <option value="employer_employee">Employer-Employee</option>
                        <option value="parent_child">Parent-Child</option>
                      </select>
                      {errors.walletType && (
                        <p className="mt-1 text-sm text-red-600">{errors.walletType}</p>
                      )}
                    </div>
                  )}

                  <TouchFriendlyInput
                    label="Site URL"
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    error={errors.siteUrl}
                    placeholder="https://example.com"
                  />

                  <TouchFriendlyInput
                    label="Mobile App URL"
                    type="url"
                    value={mobileAppUrl}
                    onChange={(e) => setMobileAppUrl(e.target.value)}
                    error={errors.mobileAppUrl}
                    placeholder="https://example.com/mobile"
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Active
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