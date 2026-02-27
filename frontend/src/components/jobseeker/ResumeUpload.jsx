import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import { toast } from 'react-toastify';

const ResumeUpload = ({ currentResume, onUpload, onDelete, onParse }) => {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOC, and DOCX files are allowed');
      return false;
    }
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      await uploadFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      await onUpload(file);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleParse = async () => {
    setParsing(true);
    try {
      await onParse();
      toast.success('Resume parsed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to parse resume');
    } finally {
      setParsing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your resume?')) {
      try {
        await onDelete();
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete resume');
      }
    }
  };

  return (
    <div className="space-y-4">
      {currentResume ? (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {currentResume.filename || 'Resume.pdf'}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleParse}
                loading={parsing}
              >
                Parse Resume
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your resume here, or
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
            className="mt-4"
          >
            Browse Files
          </Button>
          
          <p className="mt-2 text-xs text-gray-500">
            PDF, DOC, or DOCX (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
