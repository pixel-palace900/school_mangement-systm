import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Icons (using emoji placeholders)
const Icons = {
  Book: () => <span className="text-2xl">📚</span>,
  Search: () => <span className="text-xl">🔍</span>,
  Calendar: () => <span className="text-xl">📅</span>,
  User: () => <span className="text-xl">👤</span>,
  Clock: () => <span className="text-xl">🕒</span>,
  CheckCircle: () => <span className="text-xl">✅</span>,
  AlertCircle: () => <span className="text-xl">⚠️</span>,
  BookOpen: () => <span className="text-xl">📖</span>,
  Plus: () => <span className="text-xl">➕</span>,
};

// Mock library data
const mockLibraryData = {
  borrowedBooks: [
    {
      _id: '1',
      title: 'Advanced Mathematics',
      author: 'Dr. John Smith',
      isbn: '978-0123456789',
      borrowDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'borrowed',
      renewalCount: 0,
      maxRenewals: 2
    },
    {
      _id: '2',
      title: 'Physics Fundamentals',
      author: 'Prof. Sarah Johnson',
      isbn: '978-0987654321',
      borrowDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'borrowed',
      renewalCount: 1,
      maxRenewals: 2
    },
    {
      _id: '3',
      title: 'Chemistry Lab Manual',
      author: 'Dr. Michael Brown',
      isbn: '978-0456789123',
      borrowDate: '2023-12-20',
      dueDate: '2024-01-20',
      status: 'overdue',
      renewalCount: 2,
      maxRenewals: 2
    }
  ],
  availableBooks: [
    {
      _id: '4',
      title: 'Computer Science Principles',
      author: 'Dr. Emily Davis',
      isbn: '978-0789123456',
      category: 'Computer Science',
      availability: 'available',
      totalCopies: 5,
      availableCopies: 3
    },
    {
      _id: '5',
      title: 'English Literature Anthology',
      author: 'Prof. Robert Wilson',
      isbn: '978-0321654987',
      category: 'Literature',
      availability: 'available',
      totalCopies: 8,
      availableCopies: 2
    },
    {
      _id: '6',
      title: 'World History',
      author: 'Dr. Lisa Anderson',
      isbn: '978-0654321789',
      category: 'History',
      availability: 'available',
      totalCopies: 4,
      availableCopies: 1
    }
  ]
};

const Library = () => {
  const { user } = useAuth();
  const [libraryData, setLibraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('borrowed');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        setTimeout(() => {
          setLibraryData(mockLibraryData);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching library data:', error);
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'borrowed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'returned': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'borrowed': return <Icons.BookOpen />;
      case 'overdue': return <Icons.AlertCircle />;
      case 'returned': return <Icons.CheckCircle />;
      default: return <Icons.Book />;
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAvailableBooks = libraryData?.availableBooks?.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
        <Icons.Book />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-gray-600">Browse and manage your borrowed books from the school library.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('borrowed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'borrowed'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.BookOpen />
              <span className="ml-2">My Books ({libraryData?.borrowedBooks?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.Search />
              <span className="ml-2">Browse Books</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Borrowed Books Tab */}
      {activeTab === 'borrowed' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Icons.BookOpen />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-blue-600 font-medium">Currently Borrowed</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {libraryData?.borrowedBooks?.filter(book => book.status === 'borrowed').length || 0}
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
                    <p className="text-sm text-red-600 font-medium">Overdue Books</p>
                    <p className="text-2xl font-bold text-red-700">
                      {libraryData?.borrowedBooks?.filter(book => book.status === 'overdue').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-full">
                    <Icons.CheckCircle />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-green-600 font-medium">Books Returned</p>
                    <p className="text-2xl font-bold text-green-700">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Borrowed Books List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.BookOpen />
                <span className="ml-2">My Borrowed Books</span>
              </CardTitle>
              <CardDescription>
                Books currently borrowed from the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {libraryData?.borrowedBooks?.map((book) => (
                  <div key={book._id} className={`p-4 rounded-lg border ${
                    book.status === 'overdue' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(book.status)}`}>
                            <span className="mr-1">{getStatusIcon(book.status)}</span>
                            {book.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                        
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Icons.Calendar />
                            <div className="ml-2">
                              <p className="text-gray-500">Borrowed</p>
                              <p className="font-medium">{formatDate(book.borrowDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Icons.Clock />
                            <div className="ml-2">
                              <p className="text-gray-500">Due Date</p>
                              <p className={`font-medium ${isOverdue(book.dueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                                {formatDate(book.dueDate)}
                                {isOverdue(book.dueDate) ? (
                                  <span className="ml-1 text-red-500">(Overdue)</span>
                                ) : (
                                  <span className="ml-1 text-gray-500">
                                    ({getDaysUntilDue(book.dueDate)} days left)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Icons.User />
                            <div className="ml-2">
                              <p className="text-gray-500">Renewals</p>
                              <p className="font-medium">{book.renewalCount}/{book.maxRenewals}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        {book.renewalCount < book.maxRenewals && book.status !== 'overdue' && (
                          <Button variant="outline" size="sm">
                            Renew
                          </Button>
                        )}
                        <Button variant="default" size="sm">
                          Return
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(!libraryData?.borrowedBooks || libraryData.borrowedBooks.length === 0) && (
                <div className="text-center py-8">
                  <Icons.Book />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No borrowed books</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't borrowed any books from the library yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Browse Books Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Icons.Search />
                <Input
                  type="text"
                  placeholder="Search books by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Available Books */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.Search />
                <span className="ml-2">Available Books</span>
              </CardTitle>
              <CardDescription>
                Browse and borrow books from the library collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAvailableBooks.map((book) => (
                  <div key={book._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <h3 className="font-medium text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-xs text-gray-500 mt-1">{book.category}</p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Available: {book.availableCopies}/{book.totalCopies} copies
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={book.availableCopies === 0}
                    >
                      <Icons.Plus />
                      <span className="ml-1">
                        {book.availableCopies === 0 ? 'Not Available' : 'Borrow Book'}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>

              {filteredAvailableBooks.length === 0 && (
                <div className="text-center py-8">
                  <Icons.Search />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No books available in the library.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Library;
