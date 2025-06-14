'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { dashboardAPI, Member, Event, APIError } from '@/lib/api';
import { format } from 'date-fns';

interface DashboardStats {
  totalMembers: number;
  pendingApplications: number;
  totalEvents: number;
  newInquiries: number;
  recentMembers: Member[];
  upcomingEvents: Event[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      if (error instanceof APIError) {
        setError(error.message);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome to POGS Admin Panel</p>
        </div>
        
        <div className="admin-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-stat-card">
              <div className="admin-loading-skeleton h-4 w-20 mb-2"></div>
              <div className="admin-loading-skeleton h-8 w-16 mb-1"></div>
              <div className="admin-loading-skeleton h-3 w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Welcome to POGS Admin Panel</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchDashboardStats}
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
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome to POGS Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid">
        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Total Members</p>
              <p className="admin-stat-number">{stats?.totalMembers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="admin-stat-change admin-stat-change-positive">
            <TrendingUp className="w-4 h-4 mr-1" />
            Active members
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Pending Applications</p>
              <p className="admin-stat-number">{stats?.pendingApplications || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="admin-stat-change">
            <span className="text-gray-600">Awaiting review</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">Total Events</p>
              <p className="admin-stat-number">{stats?.totalEvents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="admin-stat-change admin-stat-change-positive">
            <CheckCircle className="w-4 h-4 mr-1" />
            All events
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-flex-between">
            <div>
              <p className="admin-stat-label">New Inquiries</p>
              <p className="admin-stat-number">{stats?.newInquiries || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="admin-stat-change">
            <span className="text-gray-600">Unread messages</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="admin-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/members" className="group">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700">Add Member</h3>
                <p className="text-sm text-gray-500">Add new society member</p>
              </div>
            </Link>

            <Link href="/dashboard/events" className="group">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <Calendar className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-green-700">Create Event</h3>
                <p className="text-sm text-gray-500">Schedule new event</p>
              </div>
            </Link>

            <Link href="/dashboard/applications" className="group">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
                <FileText className="w-8 h-8 text-yellow-600 mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-yellow-700">Review Applications</h3>
                <p className="text-sm text-gray-500">Process membership requests</p>
              </div>
            </Link>

            <Link href="/dashboard/newsletters" className="group">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Plus className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900 group-hover:text-purple-700">Upload Newsletter</h3>
                <p className="text-sm text-gray-500">Add new newsletter</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-grid-2">
        {/* Recent Members */}
        <div className="admin-card">
          <div className="admin-card-header admin-flex-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Members</h2>
            <Link href="/dashboard/members" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="admin-card-content">
            {stats?.recentMembers && stats.recentMembers.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMembers.slice(0, 5).map((member) => (
                  <div key={member._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.membershipType} Member</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {format(new Date(member.dateJoined), 'MMM dd, yyyy')}
                      </p>
                      <span className={`admin-status-${member.status?.toLowerCase() || 'inactive'}`}>
                        {member.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent members</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="admin-card">
          <div className="admin-card-header admin-flex-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Link href="/dashboard/events" className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="admin-card-content">
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event._id} className="py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {format(new Date(event.date), 'MMM dd')}
                        </p>
                        <span className={`admin-status-${event.status?.toLowerCase() || 'upcoming'}`}>
                          {event.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 