import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    feeType: 'tuition',
    description: ''
  });

  // Mock data
  useEffect(() => {
    const mockFees = [
      {
        _id: '1',
        studentId: {
          _id: '1',
          name: 'John Doe',
          rollNumber: 'ST001',
          class: { name: '10', section: 'A' }
        },
        amount: 5000,
        dueDate: '2024-02-15',
        paidDate: null,
        status: 'unpaid',
        feeType: 'tuition',
        description: 'Monthly tuition fee'
      },
      {
        _id: '2',
        studentId: {
          _id: '2',
          name: 'Jane Smith',
          rollNumber: 'ST002',
          class: { name: '11', section: 'A' }
        },
        amount: 3000,
        dueDate: '2024-01-15',
        paidDate: '2024-01-10',
        status: 'paid',
        feeType: 'library',
        description: 'Library fee'
      },
      {
        _id: '3',
        studentId: {
          _id: '3',
          name: 'Mike Johnson',
          rollNumber: 'ST003',
          class: { name: '12', section: 'A' }
        },
        amount: 2000,
        dueDate: '2024-02-20',
        paidDate: null,
        status: 'unpaid',
        feeType: 'transport',
        description: 'Transportation fee'
      }
    ];

    const mockStudents = [
      { _id: '1', name: 'John Doe', rollNumber: 'ST001', class: { name: '10', section: 'A' } },
      { _id: '2', name: 'Jane Smith', rollNumber: 'ST002', class: { name: '11', section: 'A' } },
      { _id: '3', name: 'Mike Johnson', rollNumber: 'ST003', class: { name: '12', section: 'A' } },
      { _id: '4', name: 'Sarah Wilson', rollNumber: 'ST004', class: { name: '10', section: 'B' } }
    ];

    setFees(mockFees);
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const feeTypes = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'transport', label: 'Transportation Fee' },
    { value: 'exam', label: 'Exam Fee' },
    { value: 'sports', label: 'Sports Fee' },
    { value: 'other', label: 'Other' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.studentId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.studentId.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fee.status === filterStatus;
    const matchesClass = filterClass === 'all' || 
                        `${fee.studentId.class.name}-${fee.studentId.class.section}` === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedStudent = students.find(student => student._id === formData.studentId);
    
    if (editingFee) {
      // Update existing fee
      setFees(prev => prev.map(fee => 
        fee._id === editingFee._id 
          ? { 
              ...fee, 
              ...formData, 
              studentId: selectedStudent,
              amount: parseFloat(formData.amount),
              _id: editingFee._id 
            }
          : fee
      ));
    } else {
      // Add new fee
      const newFee = {
        ...formData,
        _id: Date.now().toString(),
        studentId: selectedStudent,
        amount: parseFloat(formData.amount),
        paidDate: null,
        status: 'unpaid'
      };
      setFees(prev => [...prev, newFee]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      amount: '',
      dueDate: '',
      feeType: 'tuition',
      description: ''
    });
    setEditingFee(null);
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      studentId: fee.studentId._id,
      amount: fee.amount.toString(),
      dueDate: fee.dueDate,
      feeType: fee.feeType,
      description: fee.description
    });
    setIsDialogOpen(true);
  };

  const handleMarkAsPaid = (feeId) => {
    setFees(prev => prev.map(fee => 
      fee._id === feeId 
        ? { ...fee, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : fee
    ));
  };

  const handleDelete = (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      setFees(prev => prev.filter(fee => fee._id !== feeId));
    }
  };

  const getTotalStats = () => {
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidAmount = fees.filter(fee => fee.status === 'unpaid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidCount = fees.filter(fee => fee.status === 'unpaid').length;

    return { totalAmount, paidAmount, unpaidAmount, unpaidCount };
  };

  const stats = getTotalStats();
  const uniqueClasses = [...new Set(students.map(student => `${student.class.name}-${student.class.section}`))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading fees...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💰 Fees Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              ➕ Add Fee Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFee ? 'Edit Fee Record' : 'Add New Fee Record'}
              </DialogTitle>
              <DialogDescription>
                {editingFee ? 'Update fee information' : 'Create a new fee record for a student'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name} ({student.rollNumber}) - Class {student.class.name}-{student.class.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feeType">Fee Type</Label>
                  <Select value={formData.feeType} onValueChange={(value) => setFormData(prev => ({ ...prev, feeType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Monthly tuition fee"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingFee ? 'Update Fee' : 'Add Fee'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Fees</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Paid Amount</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.paidAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Unpaid Amount</p>
                <p className="text-2xl font-bold text-red-700">{formatCurrency(stats.unpaidAmount)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pending Records</p>
                <p className="text-2xl font-bold text-orange-700">{stats.unpaidCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by student name, roll number, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-40">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees List */}
      <div className="space-y-4">
        {filteredFees.length > 0 ? (
          filteredFees.map((fee) => (
            <Card key={fee._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      💰 {fee.description}
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {fee.studentId.name} ({fee.studentId.rollNumber}) • Class {fee.studentId.class.name}-{fee.studentId.class.section}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {fee.status === 'unpaid' && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(fee._id)} className="text-green-600 hover:text-green-700">
                        ✅ Mark Paid
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(fee)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(fee._id)} className="text-red-600 hover:text-red-700">
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium text-lg">{formatCurrency(fee.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{formatDate(fee.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fee Type</p>
                    <p className="font-medium">{feeTypes.find(type => type.value === fee.feeType)?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paid Date</p>
                    <p className="font-medium">{fee.paidDate ? formatDate(fee.paidDate) : 'Not paid'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-medium mb-2">No fee records found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' || filterClass !== 'all'
                  ? "No fee records match your search criteria."
                  : "Start by adding your first fee record."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                💰 Add Fee Record
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminFees;
