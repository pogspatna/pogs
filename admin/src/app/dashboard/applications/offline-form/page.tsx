'use client';

import { useState, useEffect } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '@/lib/api';

interface OfflineForm {
  available: boolean;
  fileId?: string;
  downloadUrl?: string;
}

export default function OfflineFormPage() {
  const [offlineForm, setOfflineForm] = useState<OfflineForm>({ available: false });
  const [loading, setLoading] = useState(true);
  const [uploadingForm, setUploadingForm] = useState(false);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchOfflineForm();
  }, []);

  const fetchOfflineForm = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOfflineForm();
      setOfflineForm(data);
    } catch (error) {
      console.error('Error fetching offline form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormUpload = async () => {
    if (!formFile) return;

    try {
      setUploadingForm(true);
      const result = await apiService.uploadOfflineForm(formFile);
      console.log('Upload result:', result);
      
      // Show success message
      alert('Form uploaded successfully! The form is now available for download on the public website.');
      
      await fetchOfflineForm();
      setFormFile(null);
    } catch (error) {
      console.error('Error uploading form:', error);
      alert('Error uploading form. Please try again.');
    } finally {
      setUploadingForm(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }
    setFormFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (offlineForm.downloadUrl) {
      window.open(offlineForm.downloadUrl, '_blank');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Offline Application Form</h1>
          <p className="admin-page-subtitle">Manage the downloadable membership application form</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Form Status */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Current Form Status</h2>
            </div>
            <div className="admin-card-content">
              {offlineForm.available ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Form Available</p>
                      <p className="text-sm text-green-600">Users can download the offline application form</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="admin-btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Current Form</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">No Form Available</p>
                    <p className="text-sm text-yellow-600">Upload a form to make it available for download</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload New Form */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">Upload New Form</h2>
              <p className="text-sm text-gray-600">Upload a new PDF form to replace the current one</p>
            </div>
            <div className="admin-card-content">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : formFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formFile ? (
                  <div className="space-y-4">
                    <FileText className="w-12 h-12 text-green-600 mx-auto" />
                    <div>
                      <p className="font-medium text-green-800">{formFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(formFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={handleFormUpload}
                        disabled={uploadingForm}
                        className="admin-btn-primary flex items-center space-x-2"
                      >
                        {uploadingForm ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Form</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setFormFile(null)}
                        className="admin-btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your PDF file here, or{' '}
                        <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                          browse
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500">PDF files up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload the official membership application form in PDF format</li>
                  <li>• The form will be stored in Google Drive and made publicly downloadable</li>
                  <li>• Once uploaded, the form will be immediately available for download</li>
                  <li>• Users will be able to download this form from the membership page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 