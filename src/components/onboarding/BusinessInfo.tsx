import { useFormik } from 'formik';
import * as Yup from 'yup';

type BusinessInfoProps = {
  data: {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
  };
  updateData: (data: any) => void;
  onNext: () => void;
};

export default function BusinessInfo({ data, updateData, onNext }: BusinessInfoProps) {
  const formik = useFormik({
    initialValues: data,
    validationSchema: Yup.object({
      name: Yup.string().required('Business name is required'),
      type: Yup.string().required('Business type is required'),
      address: Yup.string().required('Address is required'),
      phone: Yup.string().required('Phone number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: (values) => {
      updateData(values);
      onNext();
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Business Information</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Business Type</label>
          <select
            id="type"
            {...formik.getFieldProps('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select a business type</option>
            <option value="sole_proprietorship">Sole Proprietorship</option>
            <option value="partnership">Partnership</option>
            <option value="corporation">Corporation</option>
            <option value="llc">LLC</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.type}</div>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Business Address</label>
          <input
            id="address"
            type="text"
            {...formik.getFieldProps('address')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.address}</div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            type="tel"
            {...formik.getFieldProps('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.phone}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}