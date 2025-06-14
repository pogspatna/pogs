'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Save
} from 'lucide-react';
import { membersAPI, Member, APIError } from '@/lib/api';
import { format } from 'date-fns';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    membershipType: 'Life' as 'Life' | 'Annual',
    status: 'Active' as 'Active' | 'Inactive',
    dateJoined: new Date().toISOString().split('T')[0]
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await membersAPI.getAll();
      setMembers(data);
    } catch (error) {
      if (error instanceof APIError) {
        setError(error.message);
      } else {
        setError('Failed to load members');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setFormData({
      name: '',
      address: '',
      membershipType: 'Life',
      status: 'Active',
      dateJoined: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      address: member.address,
      membershipType: member.membershipType,
      status: member.status,
      dateJoined: new Date(member.dateJoined).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleDeleteMember = (member: Member) => {
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (showAddModal) {
        await membersAPI.create(formData);
      } else if (showEditModal && editingMember) {
        await membersAPI.update(editingMember._id, formData);
      }
      
      await fetchMembers();
      closeModals();
    } catch (error) {
      setError('Failed to save member');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingMember) return;
    
    setFormLoading(true);
    try {
      await membersAPI.delete(deletingMember._id);
      await fetchMembers();
      closeModals();
    } catch (error) {
      setError('Failed to delete member');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Address', 'Membership Type', 'Date Joined', 'Status'],
      ...filteredMembers.map(member => [
        member.name,
        member.address,
        member.membershipType,
        format(new Date(member.dateJoined), 'yyyy-MM-dd'),
        member.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingMember(null);
    setDeletingMember(null);
    setFormData({
      name: '',
      address: '',
      membershipType: 'Life',
      status: 'Active',
      dateJoined: new Date().toISOString().split('T')[0]
    });
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (member.address?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Members</h1>
          <p className="admin-page-subtitle">Manage society members</p>
        </div>
        
        <div className="admin-card">
          <div className="admin-card-content">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="admin-loading-skeleton h-10 w-10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="admin-loading-skeleton h-4 w-32 mb-2"></div>
                    <div className="admin-loading-skeleton h-3 w-48"></div>
                  </div>
                  <div className="admin-loading-skeleton h-6 w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Members</h1>
          <p className="admin-page-subtitle">Manage society members</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchMembers}
            className="mt-3 btn-admin-primary btn-admin-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="admin-page-header admin-flex-between">
        <div>
          <h1 className="admin-page-title">Members</h1>
          <p className="admin-page-subtitle">Manage society members ({members.length} total)</p>
        </div>
        <button onClick={handleAddMember} className="btn-admin-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Filters and Search */}
      <div className="admin-card">
        <div className="admin-card-content">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Inactive')}
                className="admin-form-select"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Export Button */}
            <button onClick={handleExport} className="btn-admin-secondary flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="admin-card">
        <div className="admin-card-content p-0">
          {filteredMembers.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead className="admin-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Membership Type</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="admin-table-body">
                  {filteredMembers.map((member) => (
                    <tr key={member._id} className="admin-table-row">
                      <td>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-700">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-gray-900">{member.address}</p>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.membershipType === 'Life' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {member.membershipType}
                        </span>
                      </td>
                      <td>
                        <p className="text-gray-900">
                          {format(new Date(member.dateJoined), 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td>
                        <span className={`admin-status-${member.status?.toLowerCase() || 'inactive'}`}>
                          {member.status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditMember(member)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit member"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMember(member)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'All' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first member.'
                }
              </p>
              {!searchTerm && filterStatus === 'All' && (
                <button onClick={handleAddMember} className="btn-admin-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Total Members</p>
              <p className="admin-stat-number">{members.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Active Members</p>
              <p className="admin-stat-number">
                {members.filter(m => m.status === 'Active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Life Members</p>
              <p className="admin-stat-number">
                {members.filter(m => m.membershipType === 'Life').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {showAddModal ? 'Add New Member' : 'Edit Member'}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-form-input"
                  placeholder="Enter member name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="admin-form-input"
                  rows={3}
                  placeholder="Enter member address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership Type *
                </label>
                <select
                  value={formData.membershipType}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as 'Life' | 'Annual' })}
                  className="admin-form-select"
                >
                  <option value="Life">Life Membership</option>
                  <option value="Annual">Annual Membership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                  className="admin-form-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Joined *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateJoined}
                  onChange={(e) => setFormData({ ...formData, dateJoined: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="btn-admin-secondary"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-primary flex items-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {showAddModal ? 'Add Member' : 'Update Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Delete Member</h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Are you sure you want to delete this member?
                  </p>
                  <p className="text-gray-500 text-sm">
                    {deletingMember.name} - This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModals}
                  className="btn-admin-secondary"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 