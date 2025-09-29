'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Download, Search } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Newsletter {
  _id: string;
  title: string;
  fileUrl: string; // Google Drive file ID
  fileType: 'pdf' | 'image';
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    publishDate: ''
  });

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNewsletters();
      setNewsletters(data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid PDF or image file (JPEG, PNG, GIF, WebP)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('publishDate', formData.publishDate);
      
      if (selectedFile) {
        submitData.append('file', selectedFile);
      } else if (!editingNewsletter) {
        alert('Please select a file');
        return;
      }

      if (editingNewsletter) {
        await apiService.updateNewsletter(editingNewsletter._id, submitData);
      } else {
        await apiService.createNewsletter(submitData);
      }
      await fetchNewsletters();
      resetForm();
    } catch (error) {
      console.error('Error saving newsletter:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this newsletter?')) {
      try {
        await apiService.deleteNewsletter(id);
        await fetchNewsletters();
      } catch (error) {
        console.error('Error deleting newsletter:', error);
      }
    }
  };

  const handleDownload = (fileUrl: string, title: string, fileType: string) => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileUrl}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      publishDate: ''
    });
    setEditingNewsletter(null);
    setShowAddModal(false);
    setSelectedFile(null);
  };

  const startEdit = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      publishDate: newsletter.publishDate.split('T')[0] // Format for date input
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  const filteredNewsletters = newsletters.filter(newsletter =>
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div className="admin-flex-between">
          <div>
            <h1 className="admin-page-title">Newsletter Management</h1>
            <p className="admin-page-subtitle">Manage society newsletters and publications</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-admin-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Newsletter</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="admin-card mb-6">
        <div className="admin-card-content">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search newsletters by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      {/* Newsletters List */}
      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead className="admin-table-header">
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Publish Date</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {filteredNewsletters.map((newsletter) => (
                <tr key={newsletter._id} className="admin-table-row">
                  <td>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium">{newsletter.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      newsletter.fileType === 'pdf' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {newsletter.fileType.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(newsletter.publishDate).toLocaleDateString()}</td>
                  <td>{new Date(newsletter.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(newsletter.fileUrl, newsletter.title, newsletter.fileType)}
                        className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                        title={`Download ${newsletter.fileType.toUpperCase()}`}
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => startEdit(newsletter)}
                        className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(newsletter._id)}
                        className="btn-admin-danger btn-admin-sm flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredNewsletters.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No newsletters found</h3>
              <p className="text-gray-500">Get started by uploading your first newsletter.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-lg">
            <div className="admin-modal-header">
              <h2 className="text-xl font-semibold">
                {editingNewsletter ? 'Edit Newsletter' : 'Add New Newsletter'}
              </h2>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="admin-form-group">
                  <label className="admin-form-label">Newsletter Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., POGS Newsletter - January 2024"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    File Upload {editingNewsletter && '(Leave empty to keep current file)'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                        onChange={handleFileChange}
                        className="admin-form-input"
                        required={!editingNewsletter}
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload PDF or image file (max 10MB)</p>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <FileText className="w-4 h-4" />
                        <span>{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {editingNewsletter && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <FileText className="w-4 h-4" />
                      <span>Current file: {editingNewsletter.title}.{editingNewsletter.fileType}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-admin-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-admin-primary"
                  >
                    {editingNewsletter ? 'Update Newsletter' : 'Upload Newsletter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 