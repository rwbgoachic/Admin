import type { OnboardingData } from '../../pages/OnboardingFlow';

type ReviewProps = {
  data: OnboardingData;
};

export default function Review({ data }: ReviewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Information</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Business Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="text-sm text-gray-900">{data.businessInfo.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                <dd className="text-sm text-gray-900">{data.businessInfo.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm text-gray-900">{data.businessInfo.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-sm text-gray-900">{data.businessInfo.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{data.businessInfo.email}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Bank Account</dt>
                <dd className="text-sm text-gray-900">{data.paymentSetup.bankAccount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Routing Number</dt>
                <dd className="text-sm text-gray-900">••••••{data.paymentSetup.routingNumber.slice(-4)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                <dd className="text-sm text-gray-900">••••••{data.paymentSetup.accountNumber.slice(-4)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Documents</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business License</dt>
                <dd className="text-sm text-gray-900">
                  {data.documents.businessLicense ? data.documents.businessLicense.name : 'Not uploaded'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ID Proof</dt>
                <dd className="text-sm text-gray-900">
                  {data.documents.idProof ? data.documents.idProof.name : 'Not uploaded'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}