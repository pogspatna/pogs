'use client';

import { useEffect, useState } from 'react';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Notice {
  _id: string;
  title: string;
  content: string;
  expiryDate: string;
  pdfViewUrl?: string | null;
  pdfDownloadUrl?: string | null;
  pdfName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: '', content: '', expiryDate: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllNotices();
      setNotices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', expiryDate: '' });
    setPdfFile(null);
    setShowModal(true);
  };

  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, expiryDate: n.expiryDate.split('T')[0] });
    setPdfFile(null);
    setShowModal(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        if (pdfFile) {
          const fd = new FormData();
          fd.append('title', form.title);
          fd.append('content', form.content);
          fd.append('expiryDate', form.expiryDate);
          fd.append('pdf', pdfFile);
          await apiService.updateNoticeFormData(editing._id, fd);
        } else {
          await apiService.updateNotice(editing._id, form);
        }
      } else {
        if (pdfFile) {
          const fd = new FormData();
          fd.append('title', form.title);
          fd.append('content', form.content);
          fd.append('expiryDate', form.expiryDate);
          fd.append('pdf', pdfFile);
          await apiService.createNoticeFormData(fd);
        } else {
          await apiService.createNotice(form);
        }
      }
      setShowModal(false);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await apiService.deleteNotice(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div className="admin-flex-between">
          <div>
            <h1 className="admin-page-title">Notices</h1>
            <p className="admin-page-subtitle">Manage important notices for homepage</p>
          </div>
          <button onClick={openCreate} className="btn-admin-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Notice</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-grid gap-4">
          {notices.map((n) => {
            const expired = new Date(n.expiryDate) < new Date();
            return (
              <div key={n._id} className={`admin-card ${expired ? 'opacity-60' : ''}`}>
                <div className="admin-card-content">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{n.title}</h3>
                      <p className="text-gray-600 mb-2 whitespace-pre-wrap">{n.content}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Expires: {new Date(n.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEdit(n)} className="btn-admin-secondary btn-admin-sm flex items-center space-x-1">
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => remove(n._id)} className="btn-admin-danger btn-admin-sm flex items-center space-x-1">
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {notices.length === 0 && (
            <div className="admin-card">
              <div className="admin-card-content text-center py-12 text-gray-600">
                No notices yet.
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-xl">
            <div className="admin-modal-header">
              <h2 className="text-xl font-semibold">{editing ? 'Edit Notice' : 'Add Notice'}</h2>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={save} className="space-y-4">
                <div className="admin-form-group">
                  <label className="admin-form-label">Heading</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Short Paragraph</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="admin-form-input"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Attach PDF (optional)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="admin-form-input"
                    onChange={(e) => setPdfFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  />
                  {editing && (editing.pdfViewUrl || editing.pdfDownloadUrl) && (
                    <p className="text-sm text-gray-600 mt-2">
                      Existing: {editing.pdfName || 'PDF'} —
                      {editing.pdfViewUrl && (
                        <a href={editing.pdfViewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">View</a>
                      )}
                      {editing.pdfDownloadUrl && (
                        <a href={editing.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">Download</a>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" className="btn-admin-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-admin-primary">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
