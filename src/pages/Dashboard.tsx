import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Transactions',
    value: '2,190',
    change: '+15.3%',
    changeType: 'positive',
    icon: ArrowTrendingUpIcon,
  },
  {
    name: 'Customers',
    value: '1,245',
    change: '+12.5%',
    changeType: 'positive',
    icon: UserGroupIcon,
  },
  {
    name: 'Avg. Processing Time',
    value: '1.2s',
    change: '-3.2%',
    changeType: 'positive',
    icon: ClockIcon,
  },
];

const recentTransactions = [
  {
    id: 1,
    date: '2025-02-15',
    description: 'Payment from John Doe',
    amount: 299.99,
    status: 'completed',
  },
  {
    id: 2,
    date: '2025-02-15',
    description: 'Subscription Payment',
    amount: 49.99,
    status: 'completed',
  },
  {
    id: 3,
    date: '2025-02-14',
    description: 'Product Purchase',
    amount: 149.99,
    status: 'completed',
  },
  {
    id: 4,
    date: '2025-02-14',
    description: 'Service Payment',
    amount: 199.99,
    status: 'pending',
  },
  {
    id: 5,
    date: '2025-02-13',
    description: 'Monthly Service',
    amount: 79.99,
    status: 'completed',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [merchantProfile, setMerchantProfile] = useState(null);

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
      }
    }

    fetchMerchantProfile();
  }, [user]);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30000, 35000, 32000, 38000, 42000, 45000],
        borderColor: 'rgb(2, 132, 199)',
        backgroundColor: 'rgba(2, 132, 199, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const paymentMethodsData = {
    labels: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(2, 132, 199, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(186, 230, 253, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {merchantProfile?.business_name || 'Merchant'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
            <div className="mt-4 h-[300px]">
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Payment Methods Chart */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
            <div className="mt-4 h-[300px] flex justify-center">
              <Doughnut
                data={paymentMethodsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <div className="rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
            </div>
            <div className="overflow-hidden">
              <div className="flex flex-col">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  transaction.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}