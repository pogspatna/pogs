'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { apiService } from '@/lib/api';

interface OfficeBearer {
  _id: string;
  name: string;
  designation: string;
  mobile?: string;
  email?: string;
  photo: string; // Google Drive file ID
  year: number;
  isCurrent: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function OfficeBearersPage() {
  const [officeBearers, setOfficeBearers] = useState<OfficeBearer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('current');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBearer, setEditingBearer] = useState<OfficeBearer | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [imageUrlIndex, setImageUrlIndex] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    mobile: '',
    email: '',
    year: new Date().getFullYear(),
    isCurrent: true,
    order: 1
  });

  const getGoogleDriveImageUrls = (fileId: string) => {
    // Multiple URL formats to try
    return [
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w200-h200`,
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/uc?id=${fileId}`,
    ];
  };

  const getCurrentImageUrl = (fileId: string) => {
    const urls = getGoogleDriveImageUrls(fileId);
    const index = imageUrlIndex[fileId] || 0;
    return urls[index];
  };

  const handleImageError = (fileId: string) => {
    const urls = getGoogleDriveImageUrls(fileId);
    const currentIndex = imageUrlIndex[fileId] || 0;
    
    if (currentIndex < urls.length - 1) {
      setImageUrlIndex(prev => ({
        ...prev,
        [fileId]: currentIndex + 1
      }));
    } else {
      setFailedImages(prev => new Set(prev).add(fileId));
    }
  };

  const handleImageLoad = () => {
    // Image loaded successfully
  };

  useEffect(() => {
    fetchOfficeBearers();
  }, []);

  const fetchOfficeBearers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOfficeBearers();
      setOfficeBearers(data);
    } catch (error) {
      console.error('Error fetching office bearers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });
      
      if (photoFile) {
        submitData.append('photo', photoFile);
      }

      if (editingBearer) {
        await apiService.updateOfficeBearer(editingBearer._id, submitData);
      } else {
        await apiService.createOfficeBearer(submitData);
      }
      await fetchOfficeBearers();
      resetForm();
    } catch (error) {
      console.error('Error saving office bearer:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this office bearer?')) {
      try {
        await apiService.deleteOfficeBearer(id);
        await fetchOfficeBearers();
      } catch (error) {
        console.error('Error deleting office bearer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      mobile: '',
      email: '',
      year: new Date().getFullYear(),
      isCurrent: true,
      order: 1
    });
    setEditingBearer(null);
    setShowAddModal(false);
    setPhotoFile(null);
    setPhotoPreview('');
    setFailedImages(new Set());
  };

  const startEdit = (bearer: OfficeBearer) => {
    setEditingBearer(bearer);
    setFormData({
      name: bearer.name,
      designation: bearer.designation,
      mobile: bearer.mobile || '',
      email: bearer.email || '',
      year: bearer.year,
      isCurrent: bearer.isCurrent,
      order: bearer.order
    });
    setPhotoPreview(''); // Will show existing photo from Google Drive
    setShowAddModal(true);
  };

  const filteredBearers = officeBearers.filter(bearer => {
    const matchesSearch = (bearer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (bearer.designation?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'all' || 
                       (yearFilter === 'current' && bearer.isCurrent) ||
                       (yearFilter !== 'current' && yearFilter !== 'all' && bearer.year.toString() === yearFilter);
    return matchesSearch && matchesYear;
  });

  const availableYears = [...new Set(officeBearers.map(b => b.year))].sort((a, b) => b - a);

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div className="admin-flex-between">
          <div>
            <h1 className="admin-page-title">Office Bearers Management</h1>
            <p className="admin-page-subtitle">Manage society office bearers and leadership</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-admin-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Office Bearer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="admin-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search office bearers by name or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="current">Current Office Bearers</option>
                <option value="all">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Office Bearers Grid */}
      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBearers.map((bearer) => (
            <div key={bearer._id} className="admin-card">
              <div className="admin-card-content text-center">
                <div className="mb-4">
                  {bearer.photo && !bearer.photo.startsWith('local-') && !failedImages.has(bearer.photo) ? (
                    <div className="relative">
                      <img
                        src={getCurrentImageUrl(bearer.photo)}
                        alt={bearer.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100"
                        onError={() => {
                          handleImageError(bearer.photo);
                        }}
                        onLoad={() => {
                          handleImageLoad();
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                      <Users className="w-8 h-8 text-gray-400" />
                      {bearer.photo && (
                        <span className="sr-only">Photo failed to load: {bearer.photo}</span>
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{bearer.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{bearer.designation}</p>
                {(bearer.mobile || bearer.email) && (
                  <div className="text-sm text-gray-600 mb-2 space-y-1">
                    {bearer.mobile && (
                      <div className="flex items-center justify-center space-x-1">
                        <span>📱</span>
                        <span>{bearer.mobile}</span>
                      </div>
                    )}
                    {bearer.email && (
                      <div className="flex items-center justify-center space-x-1">
                        <span>✉️</span>
                        <span className="truncate">{bearer.email}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                  <span>{bearer.year}</span>
                  {bearer.isCurrent && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => startEdit(bearer)}
                    className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(bearer._id)}
                    className="btn-admin-danger btn-admin-sm flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredBearers.length === 0 && (
            <div className="col-span-full">
              <div className="admin-card">
                <div className="admin-card-content text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No office bearers found</h3>
                  <p className="text-gray-500">Get started by adding your first office bearer.</p>
                </div>
              </div>
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
                {editingBearer ? 'Edit Office Bearer' : 'Add New Office Bearer'}
              </h2>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Photo Upload */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Photo</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : editingBearer?.photo && !editingBearer.photo.startsWith('local-') && !failedImages.has(editingBearer.photo) ? (
                        <img
                          src={getCurrentImageUrl(editingBearer.photo)}
                          alt="Current"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          onError={() => {
                            handleImageError(editingBearer.photo);
                          }}
                                                      onLoad={() => {
                              handleImageLoad();
                            }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="admin-form-input"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG or GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="admin-form-input"
                    placeholder="e.g., President, Secretary, Treasurer"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Mobile</label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="admin-form-input"
                      min="2000"
                      max="2050"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="admin-form-input"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isCurrent}
                      onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Current Office Bearer</span>
                  </label>
                </div>

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
                    {editingBearer ? 'Update Office Bearer' : 'Add Office Bearer'}
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