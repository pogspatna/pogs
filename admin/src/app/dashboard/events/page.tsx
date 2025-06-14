'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { apiService } from '@/lib/api';

interface Event {
  _id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    detailedDescription: '',
    date: '',
    location: '',
    status: 'Upcoming' as Event['status']
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await apiService.updateEvent(editingEvent._id, formData);
      } else {
        await apiService.createEvent(formData);
      }
      await fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await apiService.deleteEvent(id);
        await fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      detailedDescription: '',
      date: '',
      location: '',
      status: 'Upcoming'
    });
    setEditingEvent(null);
    setShowAddModal(false);
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      shortDescription: event.shortDescription,
      detailedDescription: event.detailedDescription,
      date: event.date.split('T')[0], // Format for date input
      location: event.location,
      status: event.status
    });
    setShowAddModal(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <div className="admin-flex-between">
          <div>
            <h1 className="admin-page-title">Events Management</h1>
            <p className="admin-page-subtitle">Manage society events and activities</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-admin-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
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
                placeholder="Search events by name or location..."
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
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="admin-flex-center py-12">
          <div className="admin-loading-spinner"></div>
        </div>
      ) : (
        <div className="admin-grid gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="admin-card">
              <div className="admin-card-content">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{event.shortDescription}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => startEdit(event)}
                    className="btn-admin-secondary btn-admin-sm flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="btn-admin-danger btn-admin-sm flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="admin-card">
              <div className="admin-card-content text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Get started by creating your first event.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content max-w-2xl">
            <div className="admin-modal-header">
              <h2 className="text-xl font-semibold">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="admin-form-group">
                  <label className="admin-form-label">Event Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Short Description</label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="admin-form-textarea"
                    rows={3}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Detailed Description</label>
                  <textarea
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="admin-form-textarea"
                    rows={5}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="admin-form-input"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
                      className="admin-form-select"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Past">Past</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="admin-form-input"
                    required
                  />
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
                    {editingEvent ? 'Update Event' : 'Create Event'}
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