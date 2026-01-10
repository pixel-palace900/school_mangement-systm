import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const GradeAssignment = ({ submission, assignment, onGradeSubmitted }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (submission?.grade) {
      setMarks(submission.grade.marks || '');
      setFeedback(submission.grade.feedback || '');
    }
  }, [submission]);

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    
    if (!marks || marks < 0 || marks > assignment.maxMarks) {
      setError(`Marks must be between 0 and ${assignment.maxMarks}`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // In a real app, this would call the API
      const gradeData = {
        submissionId: submission._id,
        marks: parseInt(marks),
        feedback: feedback.trim(),
        maxMarks: assignment.maxMarks
      };

      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onGradeSubmitted) {
        onGradeSubmitted(gradeData);
      }
    } catch (error) {
      setError('Failed to submit grade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Grade Submission</span>
          <span className="text-sm font-normal text-gray-500">
            Student: {submission.student?.name}
          </span>
        </CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p><strong>Assignment:</strong> {assignment.title}</p>
            <p><strong>Subject:</strong> {assignment.subject}</p>
            <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
            <p><strong>Max Marks:</strong> {assignment.maxMarks}</p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Student Submission */}
          <div>
            <h4 className="font-medium mb-3">Student Submission</h4>
            
            {/* Text Submission */}
            {submission.submissionText && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Text Submission:</h5>
                <div className="bg-gray-50 p-4 rounded border max-h-40 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{submission.submissionText}</p>
                </div>
              </div>
            )}

            {/* File Attachments */}
            {submission.attachments && submission.attachments.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Submitted Files:</h5>
                <div className="space-y-2">
                  {submission.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="text-sm font-medium">{file.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.fileSize)} • {file.fileType}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(file.fileUrl, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grading Form */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Grade This Submission</h4>
            
            <form onSubmit={handleSubmitGrade} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Marks (out of {assignment.maxMarks})
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={assignment.maxMarks}
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="Enter marks"
                    required
                  />
                  {marks && (
                    <p className="text-sm text-gray-500 mt-1">
                      Grade: {calculateGrade(parseInt(marks), assignment.maxMarks)} 
                      ({((parseInt(marks) / assignment.maxMarks) * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}

              {/* Current Grade Display */}
              {submission.grade && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h5 className="font-medium text-blue-800 mb-2">Current Grade</h5>
                  <div className="space-y-1 text-sm">
                    <p><strong>Marks:</strong> {submission.grade.marks}/{assignment.maxMarks}</p>
                    <p><strong>Grade:</strong> {calculateGrade(submission.grade.marks, assignment.maxMarks)}</p>
                    <p><strong>Percentage:</strong> {((submission.grade.marks / assignment.maxMarks) * 100).toFixed(1)}%</p>
                    {submission.grade.feedback && (
                      <p><strong>Previous Feedback:</strong> {submission.grade.feedback}</p>
                    )}
                    <p className="text-xs text-gray-600">
                      Graded on: {new Date(submission.grade.gradedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubmitGrade}
          disabled={loading || !marks}
          className="w-full"
        >
          {loading ? 'Submitting Grade...' : submission.grade ? 'Update Grade' : 'Submit Grade'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GradeAssignment;
