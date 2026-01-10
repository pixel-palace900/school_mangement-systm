import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as parentApi from '../../api/parent';

const Circulars = () => {
  const { user } = useAuth();
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircular, setSelectedCircular] = useState(null);

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockCirculars();
        setCirculars(response.data.circulars);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching circulars:', error);
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  const handleCircularClick = (circular) => {
    setSelectedCircular(circular);
  };

  const handleBackClick = () => {
    setSelectedCircular(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedCircular) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Circular Details</h1>
          <Button variant="outline" onClick={handleBackClick}>
            Back to List
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{selectedCircular.title}</CardTitle>
            <CardDescription>
              Issued on: {new Date(selectedCircular.issueDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>{selectedCircular.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Circulars & Notifications</h1>
      
      <div className="space-y-4">
        {circulars.map((circular) => (
          <Card 
            key={circular._id} 
            className="hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleCircularClick(circular)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{circular.title}</CardTitle>
                <span className="text-xs text-gray-500">
                  {new Date(circular.issueDate).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">{circular.content}</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {circulars.length === 0 && (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">No Circulars Found</h2>
            <p className="text-gray-500">There are no circulars or notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Circulars;
