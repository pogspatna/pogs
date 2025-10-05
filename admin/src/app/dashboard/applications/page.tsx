'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Eye, Check, X, Search, Filter, Download } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MembershipApplication {
  _id: string;
  name: string;
  address: string;
  district: string;
  pinCode: string;
  state: string;
  mobile: string;
  email: string;
  membershipType: 'Life' | 'Annual';
  qualification: string;
  dateOfBirth: string;
  paymentScreenshot: string; // Google Drive file ID
  applicationPdf: string; // Google Drive file ID
  signature?: string; // Google Drive file ID for signature image
  applicationIdentifier?: string; // Unique application identifier
  paymentTransactionId?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMembershipApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (confirm('Are you sure you want to approve this application?')) {
      try {
        setProcessing(id);
        await apiService.approveMembershipApplication(id);
        await fetchApplications();
      } catch (error) {
        console.error('Error approving application:', error);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) { // User didn't cancel
      try {
        setProcessing(id);
        await apiService.rejectMembershipApplication(id, reason);
        await fetchApplications();
      } catch (error) {
        console.error('Error rejecting application:', error);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleViewDetails = (application: MembershipApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleDownloadPayment = (fileId: string, applicantName: string) => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${applicantName}_payment_screenshot`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadApplication = (fileId: string, applicantName: string) => {
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${applicantName}_application.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (app.mobile || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: MembershipApplication['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type: MembershipApplication['membershipType']) => {
    return type === 'Life' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Membership Applications</h1>
          <p className="admin-page-subtitle">Review and process membership applications</p>
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
                placeholder="Search applications by name, email or mobile..."
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead className="admin-table-header">
              <tr>
                <th>Applicant</th>
                <th>Membership Type</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="admin-table-row">
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">{application.name}</div>
                      <div className="text-sm text-gray-500">{application.qualification}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipTypeColor(application.membershipType)}`}>
                      {application.membershipType}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{application.email}</div>
                      <div className="text-gray-500">{application.mobile}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {application.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(application._id)}
                            disabled={processing === application._id}
                            className="btn-admin-success btn-admin-sm flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(application._id)}
                            disabled={processing === application._id}
                            className="btn-admin-danger btn-admin-sm flex items-center space-x-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">No membership applications match your current filters.</p>
            </div>
          )}
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-4xl">
            <div className="admin-modal-header">
              <h2 className="text-xl font-semibold">Application Details</h2>
            </div>
            <div className="admin-modal-body">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Qualification</label>
                      <p className="text-gray-900">{selectedApplication.qualification}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Membership Type</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMembershipTypeColor(selectedApplication.membershipType)}`}>
                        {selectedApplication.membershipType} - {selectedApplication.membershipType === 'Life' ? '₹15,000' : '₹1,500'}
                      </span>
                    </div>
                    {selectedApplication.paymentTransactionId && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">UTR / Transaction ID</label>
                        <p className="text-gray-900 break-all">{selectedApplication.paymentTransactionId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mobile</label>
                      <p className="text-gray-900">{selectedApplication.mobile}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{selectedApplication.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">District</label>
                        <p className="text-gray-900">{selectedApplication.district}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pin Code</label>
                        <p className="text-gray-900">{selectedApplication.pinCode}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-gray-900">{selectedApplication.state}</p>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Application Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                      <p className="text-gray-900">{new Date(selectedApplication.submittedAt).toLocaleDateString()}</p>
                    </div>
                    {selectedApplication.paymentTransactionId && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">UTR / Transaction ID</label>
                        <p className="text-gray-900 break-all">{selectedApplication.paymentTransactionId}</p>
                      </div>
                    )}
                    {selectedApplication.processedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Processed Date</label>
                        <p className="text-gray-900">{new Date(selectedApplication.processedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Payment Screenshot</h4>
                      <button
                        onClick={() => handleDownloadPayment(selectedApplication.paymentScreenshot, selectedApplication.name)}
                        className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                    {selectedApplication.signature && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Signature</h4>
                        <button
                          onClick={() => handleDownloadPayment(selectedApplication.signature as string, selectedApplication.name)}
                          className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
                    {selectedApplication.applicationPdf && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Application PDF</h4>
                        <button
                          onClick={() => handleDownloadApplication(selectedApplication.applicationPdf, selectedApplication.name)}
                          className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
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
                {selectedApplication.status === 'Pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleReject(selectedApplication._id);
                        setShowDetailsModal(false);
                      }}
                      className="btn-admin-danger flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedApplication._id);
                        setShowDetailsModal(false);
                      }}
                      className="btn-admin-success flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Application</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 