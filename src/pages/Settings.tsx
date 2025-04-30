import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Tab } from '@headlessui/react';
import { UserIcon, CreditCardIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Profile', icon: UserIcon },
  { name: 'Payment', icon: CreditCardIcon },
  { name: 'Notifications', icon: BellIcon },
  { name: 'Security', icon: ShieldCheckIcon },
];

const notificationPreferences = [
  { id: 'successful-payments', name: 'Successful payments' },
  { id: 'failed-payments', name: 'Failed payments' },
  { id: 'refunds', name: 'Refunds' },
  { id: 'disputes', name: 'Disputes' },
  { id: 'weekly-summary', name: 'Weekly summary' },
  { id: 'marketing-updates', name: 'Marketing updates' },
];

export default function Settings() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState(
    new Set(['successful-payments', 'failed-payments', 'disputes'])
  );

  useEffect(() => {
    async function fetchMerchantProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setMerchantProfile(data);
        formik.setValues({
          business_name: data.business_name,
          business_type: data.business_type,
          tax_id: data.tax_id,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          phone: data.phone,
          email: data.email,
          website: data.website || '',
        });
      }
    }

    fetchMerchantProfile();
  }, [user]);

  const formik = useFormik({
    initialValues: {
      business_name: '',
      business_type: '',
      tax_id: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      phone: '',
      email: '',
      website: '',
    },
    validationSchema: Yup.object({
      business_name: Yup.string().required('Required'),
      business_type: Yup.string().required('Required'),
      tax_id: Yup.string().required('Required'),
      address: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zip_code: Yup.string().required('Required'),
      phone: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      website: Yup.string().url('Invalid URL'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        const { error } = await supabase
          .from('merchant_profiles')
          .update(values)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleNotificationChange = (id: string) => {
    const newNotifications = new Set(notifications);
    if (newNotifications.has(id)) {
      newNotifications.delete(id);
    } else {
      newNotifications.add(id);
    }
    setNotifications(newNotifications);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <div className="border-b border-gray-200">
              <Tab.List className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'border-b-2 py-4 px-1 text-sm font-medium outline-none',
                        selected
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      )
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </div>
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              <Tab.Panel>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        id="business_name"
                        {...formik.getFieldProps('business_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.business_name && formik.errors.business_name && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.business_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
                        Business Type
                      </label>
                      <select
                        id="business_type"
                        {...formik.getFieldProps('business_type')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Select a type</option>
                        <option value="sole_proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="corporation">Corporation</option>
                        <option value="llc">LLC</option>
                      </select>
                      {formik.touched.business_type && formik.errors.business_type && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.business_type}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        id="tax_id"
                        {...formik.getFieldProps('tax_id')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.tax_id && formik.errors.tax_id && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.tax_id}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...formik.getFieldProps('email')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        {...formik.getFieldProps('address')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.address && formik.errors.address && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        {...formik.getFieldProps('city')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.city && formik.errors.city && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        {...formik.getFieldProps('state')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.state && formik.errors.state && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zip_code"
                        {...formik.getFieldProps('zip_code')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.zip_code && formik.errors.zip_code && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.zip_code}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...formik.getFieldProps('phone')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        {...formik.getFieldProps('website')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.website && formik.errors.website && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.website}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </Tab.Panel>

              <Tab.Panel>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your payment methods and payout settings
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bank Account</p>
                        <p className="text-sm text-gray-500">••••8888</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payout Schedule</p>
                        <p className="text-sm text-gray-500">Weekly on Monday</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose what notifications you want to receive
                    </p>
                  </div>

                  <div className="space-y-4">
                    {notificationPreferences.map((preference) => (
                      <div key={preference.id} className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id={preference.id}
                            type="checkbox"
                            checked={notifications.has(preference.id)}
                            onChange={() => handleNotificationChange(preference.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor={preference.id} className="text-sm font-medium text-gray-700">
                            {preference.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your security preferences and authentication settings
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}