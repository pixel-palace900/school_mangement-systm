import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import * as parentApi from '../../api/parent';

const Attendance = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    percentage: 0
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
    const fetchAttendance = async () => {
      if (!selectedChild) return;
      
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockAttendance();
        const attendanceData = response.data.attendance;
        
        setAttendance(attendanceData);
        
        // Calculate statistics
        const presentCount = attendanceData.filter(a => a.status === 'Present').length;
        const absentCount = attendanceData.filter(a => a.status === 'Absent').length;
        const totalDays = attendanceData.length;
        const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
        
        setStats({
          present: presentCount,
          absent: absentCount,
          percentage
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find(c => c._id === childId);
    setSelectedChild(child);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Tracking</h1>
      
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
          {/* Attendance Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>
                {selectedChild.name}'s attendance for the current month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                  <p className={`text-3xl font-bold ${stats.percentage >= 90 ? 'text-green-600' : stats.percentage >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.percentage}%
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Present Days</p>
                  <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Absent Days</p>
                  <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Detailed attendance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.remarks || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {attendance.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No attendance records found.</p>
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

export default Attendance;
