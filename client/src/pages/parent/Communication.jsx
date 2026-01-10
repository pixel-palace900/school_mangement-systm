import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import * as parentApi from '../../api/parent';

const Communication = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [message, setMessage] = useState('');
  
  // Mock messages data (in a real app, this would come from the API)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'parent', text: 'Hello, I wanted to ask about the upcoming science project.', timestamp: '2023-06-01T10:30:00' },
    { id: 2, sender: 'teacher', text: 'Hi! The science project details will be shared next week. Students will need to prepare a model on renewable energy sources.', timestamp: '2023-06-01T11:15:00' },
    { id: 3, sender: 'parent', text: 'Thank you for the information. Will there be any specific materials required?', timestamp: '2023-06-01T11:30:00' },
    { id: 4, sender: 'teacher', text: 'Students can use recycled materials from home. We encourage creativity and sustainability.', timestamp: '2023-06-01T12:00:00' }
  ]);

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
    const fetchTeachers = async () => {
      if (!selectedChild) return;
      
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockTeachers();
        setTeachers(response.data.teachers);
        
        if (response.data.teachers.length > 0) {
          setSelectedTeacher(response.data.teachers[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [selectedChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const child = children.find(c => c._id === childId);
    setSelectedChild(child);
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    const teacher = teachers.find(t => t._id === teacherId);
    setSelectedTeacher(teacher);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the API
    const newMessage = {
      id: messages.length + 1,
      sender: 'parent',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Communication</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Contact</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Child Selector */}
              {children.length > 0 && (
                <div className="mb-4">
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
              
              {/* Teacher Selector */}
              {teachers.length > 0 && (
                <div>
                  <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Teacher
                  </label>
                  <select
                    id="teacher-select"
                    value={selectedTeacher?._id || ''}
                    onChange={handleTeacherChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                  >
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.subjectSpecialization}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Teacher Info */}
              {selectedTeacher && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">{selectedTeacher.name}</h3>
                  <p className="text-sm text-gray-500">{selectedTeacher.subjectSpecialization} Teacher</p>
                  <p className="text-sm mt-2">Email: {selectedTeacher.email}</p>
                  <p className="text-sm">Phone: {selectedTeacher.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>
                {selectedTeacher ? `Chat with ${selectedTeacher.name}` : 'Select a teacher to start chatting'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : selectedTeacher ? (
                <>
                  {/* Messages */}
                  <div className="flex-grow overflow-y-auto mb-4 space-y-4 h-80">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                            msg.sender === 'parent'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={handleMessageChange}
                      placeholder="Type your message..."
                      className="flex-grow"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Please select a teacher to start communication.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communication;
