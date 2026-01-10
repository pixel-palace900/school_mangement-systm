import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { circularApi } from '../../api/admin/circular';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';

const Circulars = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all'
  });

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      setLoading(true);
      
      // For development, use mock data
      // In production, uncomment the line below and remove mock data
      // const response = await circularApi.getAllCirculars();
      const response = circularApi.getMockCirculars();
      
      setCirculars(response.data.circulars);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching circulars:', error);
      toast({
        title: "Error",
        description: "Failed to fetch circulars. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCircular) {
        // Update existing circular
        // await circularApi.updateCircular(editingCircular._id, formData);
        
        // Mock update for development
        setCirculars(prev => prev.map(circular => 
          circular._id === editingCircular._id 
            ? { ...circular, ...formData, issueDate: new Date().toISOString() }
            : circular
        ));
        
        toast({
          title: "Success",
          description: "Circular updated successfully!",
        });
      } else {
        // Create new circular
        // await circularApi.createCircular(formData);
        
        // Mock create for development
        const newCircular = {
          _id: Date.now().toString(),
          ...formData,
          issueDate: new Date().toISOString(),
          issuedBy: user.id,
          issuedByModel: 'Admin'
        };
        
        setCirculars(prev => [newCircular, ...prev]);
        
        toast({
          title: "Success",
          description: "Circular created successfully!",
        });
      }
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        targetAudience: 'all'
      });
      setShowCreateForm(false);
      setEditingCircular(null);
      
    } catch (error) {
      console.error('Error saving circular:', error);
      toast({
        title: "Error",
        description: "Failed to save circular. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (circular) => {
    setEditingCircular(circular);
    setFormData({
      title: circular.title,
      content: circular.content,
      targetAudience: circular.targetAudience
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (circularId) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) {
      return;
    }

    try {
      // await circularApi.deleteCircular(circularId);
      
      // Mock delete for development
      setCirculars(prev => prev.filter(circular => circular._id !== circularId));
      
      toast({
        title: "Success",
        description: "Circular deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting circular:', error);
      toast({
        title: "Error",
        description: "Failed to delete circular. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      targetAudience: 'all'
    });
    setShowCreateForm(false);
    setEditingCircular(null);
  };

  // Filter circulars based on search term and audience filter
  const filteredCirculars = circulars.filter(circular => {
    const matchesSearch = circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circular.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = filterAudience === 'all' || circular.targetAudience === filterAudience;
    return matchesSearch && matchesAudience;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading circulars...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Circular Management</h1>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          📢 Create New Circular
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search Circulars</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filter">Filter by Audience</Label>
              <select
                id="filter"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.target.value)}
              >
                <option value="all">All Audiences</option>
                <option value="teachers">Teachers</option>
                <option value="parents">Parents</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingCircular ? 'Edit Circular' : 'Create New Circular'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter circular title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <select
                  id="targetAudience"
                  name="targetAudience"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="all">All (Teachers, Parents & Students)</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="parents">Parents Only</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  name="content"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[120px]"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter circular content"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingCircular ? 'Update Circular' : 'Create Circular'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.length > 0 ? (
          filteredCirculars.map((circular) => (
            <Card key={circular._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{circular.title}</CardTitle>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>📅 {new Date(circular.issueDate).toLocaleDateString()}</span>
                      <span>👥 {circular.targetAudience === 'all' ? 'All' : circular.targetAudience}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(circular)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(circular._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{circular.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No circulars found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Circulars;
