import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  Megaphone: () => <span className="text-2xl">📢</span>,
  Calendar: () => <span className="text-xl">📅</span>,
  Search: () => <span className="text-xl">🔍</span>,
  FileText: () => <span className="text-xl">📄</span>,
  Tag: () => <span className="text-xl">🏷️</span>,
  Clock: () => <span className="text-xl">🕒</span>,
  Bell: () => <span className="text-xl">🔔</span>,
  Info: () => <span className="text-xl">ℹ️</span>,
  Star: () => <span className="text-xl">⭐</span>,
};

const Circulars = () => {
  const { user } = useAuth();
  const [circulars, setCirculars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const circularsResponse = studentApi.getMockCirculars();
        setCirculars(circularsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching circulars:', error);
        setLoading(false);
      }
    };

    fetchCirculars();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'general': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'meeting': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'event': return 'text-green-600 bg-green-50 border-green-200';
      case 'holiday': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'exam': return 'text-red-600 bg-red-50 border-red-200';
      case 'academic': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'general': return <Icons.Info />;
      case 'meeting': return <Icons.Calendar />;
      case 'event': return <Icons.Star />;
      case 'holiday': return <Icons.Calendar />;
      case 'exam': return <Icons.FileText />;
      case 'academic': return <Icons.FileText />;
      default: return <Icons.Bell />;
    }
  };

  const isRecent = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const categories = ['all', ...new Set(circulars?.circulars?.map(circular => circular.category.toLowerCase()) || [])];

  const filteredCirculars = circulars?.circulars?.filter(circular => {
    const matchesSearch = circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circular.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           circular.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

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
        <Icons.Megaphone />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Circulars & Announcements</h1>
          <p className="text-gray-600">Stay updated with school announcements, notices, and important information.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Icons.Search />
                <Input
                  type="text"
                  placeholder="Search circulars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-full">
                <Icons.FileText />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">Total Circulars</p>
                <p className="text-2xl font-bold text-blue-700">{circulars?.circulars?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full">
                <Icons.Clock />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">Recent</p>
                <p className="text-2xl font-bold text-green-700">
                  {circulars?.circulars?.filter(c => isRecent(c.issueDate)).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-full">
                <Icons.Star />
              </div>
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">Events</p>
                <p className="text-2xl font-bold text-purple-700">
                  {circulars?.circulars?.filter(c => c.category.toLowerCase() === 'event').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-full">
                <Icons.Calendar />
              </div>
              <div className="ml-4">
                <p className="text-sm text-orange-600 font-medium">Meetings</p>
                <p className="text-2xl font-bold text-orange-700">
                  {circulars?.circulars?.filter(c => c.category.toLowerCase() === 'meeting').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circulars List */}
      <div className="space-y-6">
        {filteredCirculars.map((circular) => (
          <Card key={circular._id} className={`${isRecent(circular.issueDate) ? 'border-l-4 border-l-indigo-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CardTitle className="text-lg">{circular.title}</CardTitle>
                    {isRecent(circular.issueDate) && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Icons.Bell />
                        <span className="ml-1">New</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Icons.Calendar />
                      <span className="ml-1">{formatDate(circular.issueDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Icons.Clock />
                      <span className="ml-1">{getTimeAgo(circular.issueDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(circular.category)}`}>
                    <span className="mr-1">{getCategoryIcon(circular.category)}</span>
                    {circular.category}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{circular.content}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Circular ID: {circular._id}
                  </div>
                  <Button variant="outline" size="sm">
                    <Icons.FileText />
                    <span className="ml-1">View Details</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCirculars.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Icons.Search />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No circulars found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search terms or filters.' 
                  : 'No circulars have been posted yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Circulars;
