import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as parentApi from '../../api/parent';

const Exams = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'results'

  // Mock exam results data (in a real app, this would come from the API)
  const mockResults = [
    { examId: '1', subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Excellent work!' },
    { examId: '2', subject: 'Science', marks: 78, maxMarks: 100, grade: 'B', remarks: 'Good understanding of concepts.' },
    { examId: '3', subject: 'English', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Outstanding performance!' }
  ];

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
    const fetchExams = async () => {
      if (!selectedChild) return;
      
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockExams();
        setExams(response.data.exams);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setLoading(false);
      }
    };

    fetchExams();
  }, [selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find(c => c._id === childId);
    setSelectedChild(child);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exams</h1>
      
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
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${
              activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming Exams
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`${
              activeTab === 'results'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Exam Results
          </button>
        </nav>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : selectedChild ? (
        <>
          {activeTab === 'upcoming' ? (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>
                  {selectedChild.name}'s upcoming examination schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Max Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exams.map((exam) => (
                        <tr key={exam._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {exam.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exam.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(exam.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exam.startTime} - {exam.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exam.maxMarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {exams.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No upcoming exams found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>
                  {selectedChild.name}'s examination results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockResults.map((result) => (
                        <tr key={result.examId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.marks} / {result.maxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-800' : 
                              result.grade === 'B' ? 'bg-blue-100 text-blue-800' : 
                              result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {result.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {mockResults.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No exam results found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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

export default Exams;
