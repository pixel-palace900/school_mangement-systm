import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import * as studentApi from '../../api/student';

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState({ terms: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = studentApi.getMockGrades();
        setGrades({
          terms: response.data.terms
        });
        
        // Set the first term as selected by default
        if (response.data.terms.length > 0) {
          setSelectedTerm(response.data.terms[0].name);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Get the selected term data
  const selectedTermData = grades.terms.find(term => term.name === selectedTerm);

  // Calculate overall GPA and percentage
  const calculateOverallStats = () => {
    if (!grades.terms.length) return { gpa: 0, percentage: 0 };
    
    const totalGPA = grades.terms.reduce((sum, term) => sum + term.gpa, 0);
    const avgGPA = totalGPA / grades.terms.length;
    
    // Calculate percentage (assuming all subjects have the same max marks)
    const allSubjects = grades.terms.flatMap(term => term.subjects);
    const totalMarks = allSubjects.reduce((sum, subject) => sum + subject.marks, 0);
    const totalMaxMarks = allSubjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
    const percentage = (totalMarks / totalMaxMarks) * 100;
    
    return { gpa: avgGPA.toFixed(2), percentage: percentage.toFixed(2) };
  };

  const { gpa, percentage } = calculateOverallStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Academic Performance</h1>
      
      {/* Overall Performance Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>
            Your academic performance across all terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-500">Overall GPA</p>
              <p className="text-3xl font-bold text-indigo-600">{gpa}</p>
              <p className="text-sm text-gray-500">out of 4.0</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-sm text-gray-500">Overall Percentage</p>
              <p className="text-3xl font-bold text-indigo-600">{percentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Term Selector */}
      {grades.terms.length > 0 && (
        <div className="mb-6">
          <label htmlFor="term-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Term
          </label>
          <select
            id="term-select"
            value={selectedTerm || ''}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            {grades.terms.map((term, index) => (
              <option key={index} value={term.name}>
                {term.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Term Performance Card */}
      {selectedTermData && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTermData.name} Performance</CardTitle>
            <CardDescription>
              Your academic performance for {selectedTermData.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-500">Term GPA</p>
                <p className="text-3xl font-bold text-indigo-600">{selectedTermData.gpa}</p>
                <p className="text-sm text-gray-500">out of 4.0</p>
              </div>
            </div>
            
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
                  {selectedTermData.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.marks} / {subject.maxMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-800' : 
                          subject.grade === 'B' || subject.grade === 'A-' ? 'bg-blue-100 text-blue-800' : 
                          subject.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {grades.terms.length === 0 && (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Grades Available</h2>
          <p className="text-gray-500">There are no grades available for you at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Grades;
