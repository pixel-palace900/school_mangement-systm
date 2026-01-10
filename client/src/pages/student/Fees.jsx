import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  CreditCard: () => <span className="text-2xl">💳</span>,
  DollarSign: () => <span className="text-xl">💰</span>,
  Calendar: () => <span className="text-xl">📅</span>,
  CheckCircle: () => <span className="text-xl">✅</span>,
  AlertCircle: () => <span className="text-xl">⚠️</span>,
  Receipt: () => <span className="text-xl">🧾</span>,
  Clock: () => <span className="text-xl">🕒</span>,
  Download: () => <span className="text-xl">⬇️</span>,
};

const Fees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const feesResponse = studentApi.getMockFees();
        setFees(feesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fees:', error);
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'unpaid': return 'text-red-600 bg-red-50 border-red-200';
      case 'overdue': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return <Icons.CheckCircle />;
      case 'unpaid': return <Icons.AlertCircle />;
      case 'overdue': return <Icons.Clock />;
      case 'partial': return <Icons.Clock />;
      default: return <Icons.Receipt />;
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status.toLowerCase() === 'paid') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Icons.CreditCard />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Fee Management</h1>
          <p className="text-gray-600">View your fee payment details and pending payments.</p>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full">
                <Icons.CheckCircle />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(fees?.totalPaid || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-full">
                <Icons.AlertCircle />
              </div>
              <div className="ml-4">
                <p className="text-sm text-red-600 font-medium">Total Pending</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(fees?.totalPending || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full">
                <Icons.DollarSign />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency((fees?.totalPaid || 0) + (fees?.totalPending || 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.Receipt />
            <span className="ml-2">Fee Details</span>
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your fee payments and pending amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fees?.fees?.map((fee, index) => (
                  <tr key={fee._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee.term}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(fee.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(fee.dueDate)}
                        {isOverdue(fee.dueDate, fee.status) && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(fee.status)}`}>
                        <span className="mr-1">{getStatusIcon(fee.status)}</span>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {fee.status.toLowerCase() === 'paid' && fee.receiptNo && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            <Icons.Download />
                            <span className="ml-1">Receipt</span>
                          </Button>
                        )}
                        {fee.status.toLowerCase() !== 'paid' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex items-center"
                          >
                            <Icons.CreditCard />
                            <span className="ml-1">Pay Now</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!fees?.fees || fees.fees.length === 0) && (
            <div className="text-center py-8">
              <Icons.Receipt />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fee records</h3>
              <p className="mt-1 text-sm text-gray-500">
                No fee records found for your account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      {fees?.fees?.some(fee => fee.status.toLowerCase() === 'paid') && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icons.CheckCircle />
              <span className="ml-2">Payment History</span>
            </CardTitle>
            <CardDescription>
              Your completed fee payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.fees
                .filter(fee => fee.status.toLowerCase() === 'paid')
                .map((fee, index) => (
                  <div key={fee._id || index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <Icons.CheckCircle />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{fee.term}</p>
                        <p className="text-sm text-gray-500">
                          Paid on {formatDate(fee.paidDate)} • Receipt: {fee.receiptNo}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(fee.amount)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                      >
                        <Icons.Download />
                        <span className="ml-1">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Fees;
