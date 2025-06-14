'use client';

import { useState, useEffect } from 'react';
import { Mail, Eye, Check, Search, Filter, Phone } from 'lucide-react';
import { apiService } from '@/lib/api';

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Responded';
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<ContactInquiry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getContactInquiries();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsResponded = async (id: string) => {
    try {
      await apiService.markContactAsResponded(id);
      await fetchContacts();
    } catch (error) {
      console.error('Error marking contact as responded:', error);
    }
  };

  const handleViewDetails = (contact: ContactInquiry) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  const handleEmailReply = (email: string, name: string) => {
    const subject = `Re: Your inquiry to POGS`;
    const body = `Dear ${name},\n\nThank you for contacting Patna Obstetrics & Gynaecological Society.\n\n\n\nBest regards,\nPOGS Admin Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = (contact.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (contact.phone || '').includes(searchTerm) ||
                         (contact.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContactInquiry['status']) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Inquiries</h1>
          <p className="admin-page-subtitle">Manage contact form submissions and inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Total Inquiries</p>
              <p className="admin-stat-number">{contacts.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">New Inquiries</p>
              <p className="admin-stat-number">{contacts.filter(c => c.status === 'New').length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">!</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-stat-label">Responded</p>
              <p className="admin-stat-number">{contacts.filter(c => c.status === 'Responded').length}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
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
                placeholder="Search inquiries by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 pl-10 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Responded">Responded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-grid gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact._id} className="admin-card">
              <div className="admin-card-content">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3">{contact.message}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(contact)}
                      className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEmailReply(contact.email, contact.name)}
                      className="btn-admin-primary btn-admin-sm flex items-center space-x-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                    {contact.status === 'New' && (
                      <button
                        onClick={() => handleMarkAsResponded(contact._id)}
                        className="btn-admin-success btn-admin-sm flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Responded</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="admin-card">
              <div className="admin-card-content text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
                <p className="text-gray-500">No contact inquiries match your current filters.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Details Modal */}
      {showDetailsModal && selectedContact && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-2xl">
            <div className="admin-modal-header">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Contact Inquiry Details</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                  {selectedContact.status}
                </span>
              </div>
            </div>
            <div className="admin-modal-body">
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900 font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p className="text-gray-900">
                        {new Date(selectedContact.createdAt).toLocaleDateString()} at {new Date(selectedContact.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn-admin-secondary"
                >
                  Close
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEmailReply(selectedContact.email, selectedContact.name)}
                    className="btn-admin-primary flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </button>
                  {selectedContact.status === 'New' && (
                    <button
                      onClick={() => {
                        handleMarkAsResponded(selectedContact._id);
                        setShowDetailsModal(false);
                      }}
                      className="btn-admin-success flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark as Responded</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 