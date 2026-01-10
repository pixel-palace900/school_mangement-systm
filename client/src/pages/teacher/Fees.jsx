import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '9', section: 'B' },
];

// Mock data for fee structures
const mockFeeStructures = [
  { 
    _id: '1', 
    title: 'Annual Fees 2023-24', 
    description: 'Annual fee structure for the academic year 2023-24',
    classId: { _id: '1', name: '10', section: 'A' },
    feeComponents: [
      { name: 'Tuition Fee', amount: 15000, mandatory: true },
      { name: 'Library Fee', amount: 1000, mandatory: true },
      { name: 'Sports Fee', amount: 2000, mandatory: false },
      { name: 'Transport Fee', amount: 5000, mandatory: false },
      { name: 'Examination Fee', amount: 1500, mandatory: true }
    ],
    totalMandatory: 17500,
    totalOptional: 7000,
    totalAmount: 24500,
    dueDate: '2023-07-31',
    createdBy: { _id: '1', name: 'Admin User', role: 'admin' },
    createdDate: '2023-06-01',
    isActive: true
  },
  { 
    _id: '2', 
    title: 'Quarterly Fees Q1 2023-24', 
    description: 'First quarter fee structure for the academic year 2023-24',
    classId: { _id: '2', name: '9', section: 'B' },
    feeComponents: [
      { name: 'Tuition Fee', amount: 4000, mandatory: true },
      { name: 'Library Fee', amount: 250, mandatory: true },
      { name: 'Sports Fee', amount: 500, mandatory: false },
      { name: 'Transport Fee', amount: 1250, mandatory: false }
    ],
    totalMandatory: 4250,
    totalOptional: 1750,
    totalAmount: 6000,
    dueDate: '2023-07-15',
    createdBy: { _id: '1', name: 'Admin User', role: 'admin' },
    createdDate: '2023-06-05',
    isActive: true
  },
];

const Fees = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [filteredStructures, setFilteredStructures] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    feeComponents: [
      { name: 'Tuition Fee', amount: 0, mandatory: true }
    ],
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch data from the API
        // Simulate API calls with setTimeout
        setTimeout(() => {
          setClasses(mockClasses);
          setFeeStructures(mockFeeStructures);
          setFilteredStructures(mockFeeStructures);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter fee structures when filters change
  useEffect(() => {
    let filtered = [...feeStructures];
    
    // Filter by class
    if (selectedClass) {
      filtered = filtered.filter(structure => structure.classId._id === selectedClass);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(structure => 
        structure.title.toLowerCase().includes(term) ||
        structure.description.toLowerCase().includes(term)
      );
    }
    
    // Sort by created date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    
    setFilteredStructures(filtered);
  }, [selectedClass, searchTerm, feeStructures]);

  // Calculate totals for form data
  const calculateTotals = (components) => {
    const totalMandatory = components
      .filter(comp => comp.mandatory)
      .reduce((sum, comp) => sum + Number(comp.amount || 0), 0);
    
    const totalOptional = components
      .filter(comp => !comp.mandatory)
      .reduce((sum, comp) => sum + Number(comp.amount || 0), 0);
    
    return {
      totalMandatory,
      totalOptional,
      totalAmount: totalMandatory + totalOptional
    };
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle fee component change
  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...formData.feeComponents];
    
    if (field === 'mandatory') {
      updatedComponents[index][field] = value === 'true';
    } else {
      updatedComponents[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      feeComponents: updatedComponents
    }));
  };

  // Add new fee component
  const addFeeComponent = () => {
    setFormData(prev => ({
      ...prev,
      feeComponents: [
        ...prev.feeComponents,
        { name: '', amount: 0, mandatory: true }
      ]
    }));
  };

  // Remove fee component
  const removeFeeComponent = (index) => {
    if (formData.feeComponents.length > 1) {
      const updatedComponents = formData.feeComponents.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        feeComponents: updatedComponents
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.classId || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate fee components
    const invalidComponents = formData.feeComponents.filter(
      comp => !comp.name.trim() || !comp.amount || Number(comp.amount) <= 0
    );
    
    if (invalidComponents.length > 0) {
      toast({
        title: "Error",
        description: "Please fill all fee component details with valid amounts.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send data to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Calculate totals
        const totals = calculateTotals(formData.feeComponents);
        
        // Create new fee structure
        const newFeeStructure = {
          _id: Date.now().toString(), // Generate a temporary ID
          title: formData.title,
          description: formData.description,
          classId: classes.find(cls => cls._id === formData.classId),
          feeComponents: formData.feeComponents.map(comp => ({
            ...comp,
            amount: Number(comp.amount)
          })),
          ...totals,
          dueDate: formData.dueDate,
          createdBy: {
            _id: user.id,
            name: user.name,
            role: user.role
          },
          createdDate: new Date().toISOString().split('T')[0],
          isActive: true
        };
        
        // Update fee structures state
        setFeeStructures(prev => [newFeeStructure, ...prev]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          classId: '',
          feeComponents: [
            { name: 'Tuition Fee', amount: 0, mandatory: true }
          ],
          dueDate: ''
        });
        
        // Hide form
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "Fee structure created successfully!",
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating fee structure:', error);
      toast({
        title: "Error",
        description: "Failed to create fee structure. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Toggle fee structure active status
  const toggleActiveStatus = async (id) => {
    try {
      // In a real app, we would send a request to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        setFeeStructures(prev => 
          prev.map(structure => 
            structure._id === id 
              ? { ...structure, isActive: !structure.isActive }
              : structure
          )
        );
        
        toast({
          title: "Success",
          description: "Fee structure status updated successfully!",
        });
      }, 500);
    } catch (error) {
      console.error('Error updating fee structure status:', error);
      toast({
        title: "Error",
        description: "Failed to update fee structure status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const currentTotals = calculateTotals(formData.feeComponents);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fee Structure Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Create Fee Structure'}
        </Button>
      </div>
      
      {/* Add Fee Structure Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Fee Structure</CardTitle>
            <CardDescription>
              Define fee components and amounts for a class
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Fees 2023-24"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classId">Class</Label>
                  <select
                    id="classId"
                    name="classId"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.classId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        Class {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter fee structure description"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                  required
                />
              </div>
              
              {/* Fee Components */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Fee Components</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeeComponent}>
                    Add Component
                  </Button>
                </div>
                
                {formData.feeComponents.map((component, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-3 border rounded-md">
                    <div className="space-y-1">
                      <Label htmlFor={`component-name-${index}`}>Component Name</Label>
                      <Input
                        id={`component-name-${index}`}
                        value={component.name}
                        onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                        placeholder="e.g., Tuition Fee"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`component-amount-${index}`}>Amount (₹)</Label>
                      <Input
                        id={`component-amount-${index}`}
                        type="number"
                        min="0"
                        value={component.amount}
                        onChange={(e) => handleComponentChange(index, 'amount', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`component-mandatory-${index}`}>Type</Label>
                      <select
                        id={`component-mandatory-${index}`}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={component.mandatory.toString()}
                        onChange={(e) => handleComponentChange(index, 'mandatory', e.target.value)}
                      >
                        <option value="true">Mandatory</option>
                        <option value="false">Optional</option>
                      </select>
                    </div>
                    <div>
                      {formData.feeComponents.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeFeeComponent(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Totals Summary */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Mandatory Total: </span>
                      <span className="text-green-600">₹{currentTotals.totalMandatory.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Optional Total: </span>
                      <span className="text-blue-600">₹{currentTotals.totalOptional.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Grand Total: </span>
                      <span className="text-purple-600 font-bold">₹{currentTotals.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Fee Structure'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description"
              />
            </div>
            <div>
              <Label htmlFor="filter-class">Filter by Class</Label>
              <select
                id="filter-class"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fee Structures List */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structures</CardTitle>
          <CardDescription>
            {filteredStructures.length} fee structures found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStructures.length === 0 ? (
            <p className="text-center text-gray-500">No fee structures found.</p>
          ) : (
            <div className="space-y-4">
              {filteredStructures.map((structure) => (
                <Card key={structure._id} className="border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {structure.title}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            structure.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {structure.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Class {structure.classId.name} - {structure.classId.section} | 
                          Due: {new Date(structure.dueDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleActiveStatus(structure._id)}
                        >
                          {structure.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700 mb-3">{structure.description}</p>
                    
                    {/* Fee Components */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Fee Components:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {structure.feeComponents.map((component, index) => (
                          <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <span className="flex items-center gap-2">
                              {component.name}
                              <span className={`px-1 py-0.5 text-xs rounded ${
                                component.mandatory 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {component.mandatory ? 'M' : 'O'}
                              </span>
                            </span>
                            <span className="font-medium">₹{component.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Totals */}
                    <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mandatory:</span>
                        <span className="font-medium text-green-600">₹{structure.totalMandatory.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optional:</span>
                        <span className="font-medium text-blue-600">₹{structure.totalOptional.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-purple-600">₹{structure.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="text-xs text-gray-500">
                      Created by {structure.createdBy.name} on {new Date(structure.createdDate).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Fees;
