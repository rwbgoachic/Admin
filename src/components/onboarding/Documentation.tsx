import { useRef } from 'react';

type DocumentationProps = {
  data: {
    businessLicense: File | null;
    idProof: File | null;
  };
  updateData: (data: any) => void;
  onNext: () => void;
};

export default function Documentation({ data, updateData, onNext }: DocumentationProps) {
  const businessLicenseRef = useRef<HTMLInputElement>(null);
  const idProofRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'businessLicense' | 'idProof') => {
    const file = event.target.files?.[0] || null;
    updateData({ [type]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Required Documentation</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business License</label>
          <div className="mt-1 flex items-center">
            <input
              ref={businessLicenseRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'businessLicense')}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => businessLicenseRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Upload Business License
            </button>
            {data.businessLicense && (
              <span className="ml-3 text-sm text-gray-600">{data.businessLicense.name}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ID Proof</label>
          <div className="mt-1 flex items-center">
            <input
              ref={idProofRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'idProof')}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => idProofRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Upload ID Proof
            </button>
            {data.idProof && (
              <span className="ml-3 text-sm text-gray-600">{data.idProof.name}</span>
            )}
          </div>
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