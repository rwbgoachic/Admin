import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BusinessInfo from '../components/onboarding/BusinessInfo';
import PaymentSetup from '../components/onboarding/PaymentSetup';
import Documentation from '../components/onboarding/Documentation';
import Review from '../components/onboarding/Review.tsx';

export type OnboardingData = {
  businessInfo: {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
  };
  paymentSetup: {
    bankAccount: string;
    routingNumber: string;
    accountNumber: string;
  };
  documents: {
    businessLicense: File | null;
    idProof: File | null;
  };
};

export default function OnboardingFlow() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessInfo: {
      name: '',
      type: '',
      address: '',
      phone: '',
      email: '',
    },
    paymentSetup: {
      bankAccount: '',
      routingNumber: '',
      accountNumber: '',
    },
    documents: {
      businessLicense: null,
      idProof: null,
    },
  });

  const navigate = useNavigate();

  const updateData = (step: keyof OnboardingData, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const nextStep = (currentStep: string) => {
    const steps = ['business-info', 'payment-setup', 'documentation', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      navigate(`/onboarding/${steps[currentIndex + 1]}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route 
            path="/" 
            element={<BusinessInfo 
              data={onboardingData.businessInfo} 
              updateData={(data) => updateData('businessInfo', data)}
              onNext={() => nextStep('business-info')}
            />} 
          />
          <Route 
            path="/payment-setup" 
            element={<PaymentSetup 
              data={onboardingData.paymentSetup}
              updateData={(data) => updateData('paymentSetup', data)}
              onNext={() => nextStep('payment-setup')}
            />} 
          />
          <Route 
            path="/documentation" 
            element={<Documentation 
              data={onboardingData.documents}
              updateData={(data) => updateData('documents', data)}
              onNext={() => nextStep('documentation')}
            />} 
          />
          <Route 
            path="/review" 
            element={<Review data={onboardingData} />} 
          />
        </Routes>
      </div>
    </div>
  );
}