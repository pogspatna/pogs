'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Event {
  _id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  createdAt: string;
}

interface EventsCarouselProps {
  limit?: number;
  showArrows?: boolean;
}

const EventsCarousel = ({ limit = 6, showArrows = true }: EventsCarouselProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        setEvents([]);
        return;
      }
      
      // Filter for upcoming and ongoing events, then limit
      const activeEvents = data
        .filter(event => event.status === 'Upcoming' || event.status === 'Ongoing')
        .slice(0, limit);
      
      setEvents(activeEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Unable to load events');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds
  }, [events.length]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (events.length > 0 && isAutoPlaying) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events, isAutoPlaying, startAutoPlay]);

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000); // Resume auto-play after 5 seconds
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? events.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === events.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Past':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-white/80">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-white/60 mx-auto mb-3" />
          <p className="text-white/80">No upcoming events at the moment</p>
          <Link href="/events" className="text-white/90 hover:text-white underline text-sm mt-2 inline-block">
            View all events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Upcoming Events</h3>
          <p className="text-blue-100">Stay updated with our latest medical conferences and workshops</p>
        </div>
        <Link 
          href="/events" 
          className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div 
        className="relative"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={() => setIsAutoPlaying(true)}
        ref={carouselRef}
      >
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {events.map((event) => {
              const eventDate = formatDate(event.date);
              return (
                <div key={event._id} className="w-full flex-shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mx-2 hover:bg-white/15 transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      {/* Date Badge */}
                      <div className="flex-shrink-0">
                        <div className="bg-white rounded-xl p-4 text-center shadow-lg min-w-[80px]">
                          <div className="text-2xl font-bold text-blue-600">{eventDate.day}</div>
                          <div className="text-sm font-medium text-blue-500 uppercase">{eventDate.month}</div>
                          <div className="text-xs text-gray-500">{eventDate.year}</div>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors line-clamp-2">
                              {event.name}
                            </h4>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-blue-100 mb-4 line-clamp-2 leading-relaxed">
                          {event.shortDescription}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-4 text-sm text-blue-200">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{eventDate.full}</span>
                            </div>
                          </div>
                          
                          <Link 
                            href="/events" 
                            className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors group/link text-sm font-medium"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        {showArrows && events.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:text-blue-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Previous event"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:text-blue-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Next event"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {events.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile View All Link */}
      <div className="md:hidden mt-6 text-center">
        <Link 
          href="/events" 
          className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
        >
          <span>View All Events</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default EventsCarousel; 