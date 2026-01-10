import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { submitAssignment, getAssignmentSubmission } from '../../api/student';

const AssignmentSubmission = ({ assignment, onSubmissionComplete }) => {
  const [submission, setSubmission] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if assignment is already submitted
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setSubmissionLoading(true);
        const response = await getAssignmentSubmission(assignment._id);
        if (response.success && response.data) {
          setSubmission(response.data);
          setSubmissionText(response.data.submissionText || '');
        }
      } catch (error) {
        // No submission found - this is normal for unsubmitted assignments
        console.log('No submission found for assignment:', assignment._id);
      } finally {
        setSubmissionLoading(false);
      }
    };

    if (assignment._id) {
      fetchSubmission();
    }
  }, [assignment._id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submissionText.trim() && selectedFiles.length === 0) {
      setError('Please provide either text submission or upload files');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('submissionText', submissionText);
      
      selectedFiles.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await submitAssignment(assignment._id, formData);
      
      if (response.success) {
        setSubmission(response.data);
        setSelectedFiles([]);
        if (onSubmissionComplete) {
          onSubmissionComplete(response.data);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const canSubmit = !submission && !isOverdue;

  if (submissionLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading submission status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{assignment.title}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            submission 
              ? 'bg-green-100 text-green-800' 
              : isOverdue 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
          }`}>
            {submission ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
          </span>
        </CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p><strong>Subject:</strong> {assignment.subject}</p>
            <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
            <p><strong>Max Marks:</strong> {assignment.maxMarks}</p>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Assignment Description */}
          <div>
            <h4 className="font-medium mb-2">Assignment Description:</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded">{assignment.description}</p>
          </div>

          {/* Assignment Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Assignment Files:</h4>
              <div className="space-y-2">
                {assignment.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.fileName}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(file.fileUrl, '_blank')}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Status */}
          {submission ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-medium text-green-800 mb-2">Your Submission</h4>
              <div className="space-y-2">
                <p><strong>Submitted on:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                {submission.submissionText && (
                  <div>
                    <strong>Text Submission:</strong>
                    <p className="mt-1 text-gray-700 bg-white p-2 rounded border">{submission.submissionText}</p>
                  </div>
                )}
                {submission.attachments && submission.attachments.length > 0 && (
                  <div>
                    <strong>Submitted Files:</strong>
                    <div className="mt-1 space-y-1">
                      {submission.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="text-sm">{file.fileName}</span>
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
                {submission.grade && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p><strong>Grade:</strong> {submission.grade.marks}/{assignment.maxMarks}</p>
                    {submission.grade.feedback && (
                      <p><strong>Feedback:</strong> {submission.grade.feedback}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : canSubmit ? (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Text Submission</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your assignment submission text here..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Files (Optional)</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB per file)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Selected Files:</h4>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                  {error}
                </div>
              )}
            </form>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">
                {isOverdue ? 'This assignment is overdue and can no longer be submitted.' : 'Submission not available.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {canSubmit && (
        <CardFooter>
          <Button 
            onClick={handleSubmit}
            disabled={loading || (!submissionText.trim() && selectedFiles.length === 0)}
            className="w-full"
          >
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AssignmentSubmission;
