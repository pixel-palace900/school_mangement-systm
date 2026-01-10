import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

// Mock data for messages
const mockMessages = [
  {
    _id: '1',
    type: 'parent',
    from: 'Sarah Johnson',
    fromRole: 'Parent',
    studentName: 'Emily Johnson',
    subject: 'Regarding Emily\'s Math Performance',
    message: 'Hello, I wanted to discuss Emily\'s recent math test scores. She seems to be struggling with algebra. Could we schedule a meeting?',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'unread',
    priority: 'normal'
  },
  {
    _id: '2',
    type: 'student',
    from: 'John Smith',
    fromRole: 'Student',
    studentName: 'John Smith',
    subject: 'Assignment Extension Request',
    message: 'Dear Teacher, I was sick last week and missed the assignment deadline. Could I please get an extension for the physics project?',
    timestamp: '2024-01-14T14:20:00Z',
    status: 'read',
    priority: 'normal'
  },
  {
    _id: '3',
    type: 'admin',
    from: 'Principal Office',
    fromRole: 'Admin',
    studentName: null,
    subject: 'Staff Meeting Tomorrow',
    message: 'Reminder: Staff meeting tomorrow at 3:00 PM in the conference room. Please bring your monthly reports.',
    timestamp: '2024-01-13T09:00:00Z',
    status: 'read',
    priority: 'high'
  },
  {
    _id: '4',
    type: 'parent',
    from: 'Michael Brown',
    fromRole: 'Parent',
    studentName: 'Lisa Brown',
    subject: 'Thank You Note',
    message: 'Thank you for the extra help you provided Lisa with her mathematics. Her confidence has improved significantly!',
    timestamp: '2024-01-12T16:45:00Z',
    status: 'read',
    priority: 'normal'
  }
];

const Communication = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, parent, student, admin
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch messages from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 500);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return message.status === 'unread' && matchesSearch;
    return message.type === filter && matchesSearch;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'parent': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg._id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Communication</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800 mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowCompose(true)}
        >
          ✉️ Compose Message
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'parent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('parent')}
            className={filter === 'parent' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Parents
          </Button>
          <Button
            variant={filter === 'student' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('student')}
            className={filter === 'student' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Students
          </Button>
          <Button
            variant={filter === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('admin')}
            className={filter === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            Admin
          </Button>
        </div>
      </div>

      {/* Messages list */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card 
              key={message._id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                message.status === 'unread' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (message.status === 'unread') {
                  markAsRead(message._id);
                }
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(message.type)}>
                        {message.fromRole}
                      </Badge>
                      {message.priority === 'high' && (
                        <Badge className={getPriorityColor(message.priority)}>
                          High Priority
                        </Badge>
                      )}
                      {message.status === 'unread' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    <CardDescription>
                      From: {message.from}
                      {message.studentName && ` • Student: ${message.studentName}`}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">
                  {message.message}
                </p>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm">
                    💬 Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? "No messages match your search criteria."
                  : "You don't have any messages yet."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Communication Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
              <p className="text-sm text-gray-500">Total Messages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {messages.filter(m => m.type === 'parent').length}
              </p>
              <p className="text-sm text-gray-500">From Parents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {messages.filter(m => m.type === 'student').length}
              </p>
              <p className="text-sm text-gray-500">From Students</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Communication;
