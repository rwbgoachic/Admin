import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { processPayment, validateCard } from '../../services/payment';
import { useNotification } from '../../contexts/NotificationContext';

type PaymentSetupProps = {
  data: {
    bankAccount: string;
    routingNumber: string;
    accountNumber: string;
  };
  updateData: (data: any) => void;
  onNext: () => void;
};

export default function PaymentSetup({ data, updateData, onNext }: PaymentSetupProps) {
  const { showSuccess, showError } = useNotification();

  const formik = useFormik({
    initialValues: data,
    validationSchema: Yup.object({
      bankAccount: Yup.string().required('Bank account name is required'),
      routingNumber: Yup.string()
        .matches(/^\d{9}$/, 'Routing number must be 9 digits')
        .required('Routing number is required'),
      accountNumber: Yup.string()
        .matches(/^\d{8,17}$/, 'Account number must be between 8 and 17 digits')
        .required('Account number is required'),
    }),
    onSubmit: async (values) => {
      try {
        // Validate the bank account details
        await validateCard({
          number: values.accountNumber,
          expMonth: '12', // Not applicable for bank accounts
          expYear: '2025', // Not applicable for bank accounts
          cvc: '000', // Not applicable for bank accounts
        });

        // Process a test payment
        await processPayment({
          amount: 0, // Test amount
          currency: 'USD',
          cardData: {
            number: values.accountNumber,
            expMonth: '12',
            expYear: '2025',
            cvc: '000',
          },
        });

        updateData(values);
        showSuccess('Payment setup validated successfully');
        onNext();
      } catch (error) {
        showError('Failed to validate payment setup');
      }
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Setup</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Bank Account Name"
            id="bankAccount"
            type="text"
            {...formik.getFieldProps('bankAccount')}
            error={formik.touched.bankAccount && formik.errors.bankAccount}
          />
        </div>

        <div>
          <Input
            label="Routing Number"
            id="routingNumber"
            type="text"
            {...formik.getFieldProps('routingNumber')}
            error={formik.touched.routingNumber && formik.errors.routingNumber}
          />
        </div>

        <div>
          <Input
            label="Account Number"
            id="accountNumber"
            type="text"
            {...formik.getFieldProps('accountNumber')}
            error={formik.touched.accountNumber && formik.errors.accountNumber}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            loading={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Validating...' : 'Next'}
          </Button>
        </div>
      </form>
    </Card>
  );
}