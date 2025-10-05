'use client';

import { useEffect, useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle,
  X,
  Save,
  User,
  UserCheck,
  Users
} from 'lucide-react';
import { apiService, Committee } from '@/lib/api';

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [deletingCommittee, setDeletingCommittee] = useState<Committee | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    advisor: '',
    chairperson: '',
    coChairperson: '',
    description: '',
    isActive: true,
    order: 0
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCommittees();
      setCommittees(data);
    } catch (error) {
      console.error('Error fetching committees:', error);
      setError('Failed to load committees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommittee = () => {
    setFormData({
      name: '',
      advisor: '',
      chairperson: '',
      coChairperson: '',
      description: '',
      isActive: true,
      order: 0
    });
    setShowAddModal(true);
  };

  const handleEditCommittee = (committee: Committee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name,
      advisor: committee.advisor,
      chairperson: committee.chairperson,
      coChairperson: committee.coChairperson,
      description: committee.description || '',
      isActive: committee.isActive,
      order: committee.order
    });
    setShowEditModal(true);
  };

  const handleDeleteCommittee = (committee: Committee) => {
    setDeletingCommittee(committee);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (showAddModal) {
        await apiService.createCommittee(formData);
      } else if (showEditModal && editingCommittee) {
        await apiService.updateCommittee(editingCommittee._id, formData);
      }
      
      await fetchCommittees();
      closeModals();
    } catch (error) {
      console.error('Error saving committee:', error);
      setError('Failed to save committee');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingCommittee) return;
    
    setFormLoading(true);
    try {
      await apiService.deleteCommittee(deletingCommittee._id);
      await fetchCommittees();
      closeModals();
    } catch (error) {
      console.error('Error deleting committee:', error);
      setError('Failed to delete committee');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingCommittee(null);
    setDeletingCommittee(null);
    setFormData({
      name: '',
      advisor: '',
      chairperson: '',
      coChairperson: '',
      description: '',
      isActive: true,
      order: 0
    });
  };

  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = searchTerm === '' || 
      committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.advisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.chairperson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.coChairperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && committee.isActive) ||
      (statusFilter === 'inactive' && !committee.isActive);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div className="admin-flex-between">
          <div>
            <h1 className="admin-page-title">Committees Management</h1>
            <p className="admin-page-subtitle">Manage POGS committees and their leadership</p>
          </div>
          <button
            onClick={handleAddCommittee}
            className="btn-admin-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Committee</span>
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
                placeholder="Search committees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="all">All Committees</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="admin-card mb-6">
          <div className="admin-card-content">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Committees List */}
      <div className="admin-card">
        <div className="admin-card-content">
          {filteredCommittees.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No committees found' : 'No committees yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Get started by adding your first committee'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={handleAddCommittee}
                  className="btn-admin-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Committee
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCommittees.map((committee) => (
                <div key={committee._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{committee.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          committee.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {committee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {committee.description && (
                        <p className="text-gray-600 text-sm mb-3">{committee.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Advisor</p>
                            <p className="text-sm font-medium text-gray-900">{committee.advisor}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Chairperson</p>
                            <p className="text-sm font-medium text-gray-900">{committee.chairperson}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Co-Chairperson</p>
                            <p className="text-sm font-medium text-gray-900">{committee.coChairperson}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditCommittee(committee)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit committee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommittee(committee)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete committee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Committee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Committee</h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Committee Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter committee name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Display order (0-9999)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advisor *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.advisor}
                  onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter advisor name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chairperson *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.chairperson}
                  onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter chairperson name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Co-Chairperson *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.coChairperson}
                  onChange={(e) => setFormData({ ...formData, coChairperson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter co-chairperson name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter committee description (optional)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Committee
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-admin-primary flex items-center space-x-2"
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{formLoading ? 'Saving...' : 'Save Committee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Committee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Edit Committee</h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Committee Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter committee name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Display order (0-9999)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Advisor *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.advisor}
                  onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter advisor name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chairperson *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.chairperson}
                  onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter chairperson name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Co-Chairperson *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.coChairperson}
                  onChange={(e) => setFormData({ ...formData, coChairperson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter co-chairperson name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter committee description (optional)"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-700">
                  Active Committee
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-admin-primary flex items-center space-x-2"
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{formLoading ? 'Saving...' : 'Update Committee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCommittee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Committee</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the committee &quot;{deletingCommittee.name}&quot;? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={formLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                {formLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{formLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
