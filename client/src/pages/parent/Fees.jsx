import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as parentApi from '../../api/parent';

const Fees = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockChildren();
        setChildren(response.data.children);
        
        // If childId is provided in URL, select that child
        if (childId) {
          const child = response.data.children.find(c => c._id === childId);
          if (child) {
            setSelectedChild(child);
          } else if (response.data.children.length > 0) {
            setSelectedChild(response.data.children[0]);
          }
        } else if (response.data.children.length > 0) {
          setSelectedChild(response.data.children[0]);
        }
        
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    };

    fetchChildren();
  }, [childId]);

  useEffect(() => {
    const fetchFees = async () => {
      if (!selectedChild) return;
      
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockFees();
        const feesData = response.data.fees;
        
        setFees(feesData);
        
        // Calculate statistics
        const totalAmount = feesData.reduce((sum, fee) => sum + fee.amount, 0);
        const paidAmount = feesData
          .filter(fee => fee.status === 'paid')
          .reduce((sum, fee) => sum + fee.amount, 0);
        const pendingAmount = totalAmount - paidAmount;
        
        setStats({
          totalAmount,
          paidAmount,
          pendingAmount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fees:', error);
        setLoading(false);
      }
    };

    fetchFees();
  }, [selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find(c => c._id === childId);
    setSelectedChild(child);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fee Management</h1>
      
      {/* Child Selector */}
      {children.length > 0 && (
        <div className="mb-6">
          <label htmlFor="child-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Child
          </label>
          <select
            id="child-select"
            value={selectedChild?._id || ''}
            onChange={handleChildChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
          >
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name} - Class {child.classId.name} {child.classId.section}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : selectedChild ? (
        <>
          {/* Fee Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
              <CardDescription>
                {selectedChild.name}'s fee details for the current academic year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Fees</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(stats.paidAmount)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Fee Records */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
              <CardDescription>
                Detailed fee payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fees.map((fee) => (
                      <tr key={fee._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(fee.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fee.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {fee.status === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {fee.status === 'unpaid' && (
                            <Button size="sm">Pay Now</Button>
                          )}
                          {fee.status === 'paid' && (
                            <Button variant="outline" size="sm">Receipt</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {fees.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No fee records found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Children Found</h2>
          <p className="text-gray-500">There are no children associated with your account.</p>
        </div>
      )}
    </div>
  );
};

export default Fees;
