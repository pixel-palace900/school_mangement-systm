import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  Calendar: () => <span className="text-2xl">📅</span>,
  Check: () => <span className="text-xl">✅</span>,
  X: () => <span className="text-xl">❌</span>,
  Clock: () => <span className="text-xl">🕒</span>,
  TrendingUp: () => <span className="text-xl">📈</span>,
};

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const attendanceResponse = studentApi.getMockAttendance();
        setAttendance(attendanceResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present': return 'text-green-600 bg-green-50 border-green-200';
      case 'absent': return 'text-red-600 bg-red-50 border-red-200';
      case 'late': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'present': return <Icons.Check />;
      case 'absent': return <Icons.X />;
      case 'late': return <Icons.Clock />;
      default: return <Icons.Calendar />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
        <Icons.Calendar />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-gray-600">Track your daily attendance and view attendance statistics.</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full">
                <Icons.Check />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">Present Days</p>
                <p className="text-2xl font-bold text-green-700">{attendance?.summary?.present || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-red-500 p-3 rounded-full">
                <Icons.X />
              </div>
              <div className="ml-4">
                <p className="text-sm text-red-600 font-medium">Absent Days</p>
                <p className="text-2xl font-bold text-red-700">{attendance?.summary?.absent || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full">
                <Icons.Calendar />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">Total Days</p>
                <p className="text-2xl font-bold text-blue-700">{attendance?.summary?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-full">
                <Icons.TrendingUp />
              </div>
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">Attendance %</p>
                <p className={`text-2xl font-bold ${getPercentageColor(attendance?.summary?.percentage || 0)}`}>
                  {attendance?.summary?.percentage || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.Calendar />
            <span className="ml-2">Attendance Records</span>
          </CardTitle>
          <CardDescription>
            Your daily attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance?.attendance?.map((record, index) => (
                  <tr key={record._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          <span className="mr-1">{getStatusIcon(record.status)}</span>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {record.remarks || '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!attendance?.attendance || attendance.attendance.length === 0) && (
            <div className="text-center py-8">
              <Icons.Calendar />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
              <p className="mt-1 text-sm text-gray-500">
                No attendance records found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;