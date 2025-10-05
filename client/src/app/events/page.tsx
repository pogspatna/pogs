'use client';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, ChevronRight, Filter, X, Search } from 'lucide-react';

interface Event {
  _id: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  createdAt: string;
  image?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Past'];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use localhost:5000/api directly since environment variable might not be set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/events`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Events data not found');
        }
        throw new Error(`Failed to fetch events (${response.status})`);
      }
      
      const data = await response.json();
      
      // Handle case where data might be empty or null
      if (!data || !Array.isArray(data)) {
        setEvents([]);
        return;
      }
      
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Unable to load events at this time');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = useCallback(() => {
    let filtered = events;
    
    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(event =>
        (event.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.shortDescription?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'status-success';
      case 'Ongoing':
        return 'status-info';
      case 'Past':
        return 'status-warning';
      default:
        return 'status-warning';
    }
  };

  const EventDetailModal = ({ event, onClose }: { event: Event; onClose: () => void }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost btn-sm ml-4 !p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body p-0">
          <img
            src={event.image ? `https://drive.google.com/thumbnail?id=${event.image}&sz=w1920-h1080` : '/favicon.svg'}
            alt={`${event.name} image`}
            className="w-full object-contain"
            loading="lazy"
            onError={(e) => {
              // Fallback to direct view URL if thumbnail fails
              if (event.image) {
                e.currentTarget.src = `https://drive.google.com/uc?export=view&id=${event.image}`;
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-body text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchEvents}
                className="btn-outline btn-sm mt-4"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="page-header">
        <div className="container">
          <div className="text-center fade-in">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-hero mb-6">Medical Events</h1>
            <p className="text-subtitle text-blue-100 max-w-3xl mx-auto">
              Stay updated with our medical conferences, workshops, continuing education programs, and society activities
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="section-padding">
        <div className="container">
          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-title text-gray-900 mb-4">Discover Events</h2>
                <p className="text-body text-gray-600">
                  Find medical conferences, workshops, and educational programs tailored for healthcare professionals
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by name, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-base placeholder-gray-500"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-4">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter by status:</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      selectedStatus === status
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    {status}
                    {status !== 'All' && (
                      <span className="ml-2 text-xs opacity-75">
                        ({events.filter(e => e.status === status).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="responsive-grid">
              {filteredEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`card-elevated group cursor-pointer ${
                    index % 3 === 0 ? 'slide-in-left' : 
                    index % 3 === 1 ? 'slide-up' : 'slide-in-right'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="card-content">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {event.name}
                        </h3>
                        <span className={`${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                    </div>

                    <p className="text-body text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {event.shortDescription}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <MapPin className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:translate-y-0 active:shadow-sm">
                        <span>View Details</span>
                        <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-subtitle text-gray-900 mb-4">No Events Found</h3>
              <p className="text-body text-gray-600 max-w-md mx-auto mb-8">
                {searchTerm || selectedStatus !== 'All' 
                  ? "No events match your current search criteria. Try adjusting your filters."
                  : "There are currently no events available. Check back later for updates."}
              </p>
              {(searchTerm || selectedStatus !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('All');
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Call to Action */}
          {filteredEvents.length > 0 && (
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
                <h3 className="text-subtitle mb-4">Don&apos;t Miss Our Events</h3>
                <p className="text-body-lg text-blue-100 max-w-2xl mx-auto mb-8">
                  Join our medical community and stay updated with the latest events, workshops, and conferences.
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Notified
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsPage; 