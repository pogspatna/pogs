'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, User, UserCheck, Search, AlertCircle, X } from 'lucide-react';

interface Committee {
  _id: string;
  name: string;
  advisor: string;
  chairperson: string;
  coChairperson: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const CommitteesPage = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [filteredCommittees, setFilteredCommittees] = useState<Committee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use localhost:5000/api directly since environment variable might not be set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/committees`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Committees data not found');
        }
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(`Failed to fetch committees (${response.status})`);
      }
      
      const data = await response.json();
      
      // Handle case where data might be empty or null
      if (!data || !Array.isArray(data)) {
        setCommittees([]);
        return;
      }
      
      setCommittees(data);
    } catch (err) {
      console.error('Error fetching committees:', err);
      setError(err instanceof Error ? err.message : 'Unable to load committees at this time');
    } finally {
      setLoading(false);
    }
  };

  const filterCommittees = useCallback(() => {
    let filtered = committees;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(committee =>
        committee.name.toLowerCase().includes(searchLower) ||
        committee.advisor.toLowerCase().includes(searchLower) ||
        committee.chairperson.toLowerCase().includes(searchLower) ||
        committee.coChairperson.toLowerCase().includes(searchLower) ||
        (committee.description && committee.description.toLowerCase().includes(searchLower))
      );
    }

    // Only show active committees
    filtered = filtered.filter(committee => committee.isActive);

    setFilteredCommittees(filtered);
  }, [committees, searchTerm]);

  useEffect(() => {
    fetchCommittees();
  }, []);

  useEffect(() => {
    filterCommittees();
  }, [filterCommittees]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading committees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Committees</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCommittees}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              POGS Committees
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto">
              Explore the various committees that drive our organization&apos;s mission and activities
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-50 border-b relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Find Committees</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Search through our committees by name, advisor, or leadership to discover the teams driving our mission
            </p>
          </div>
          <div className="max-w-2xl lg:max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5 sm:w-6 sm:h-6 z-10 group-focus-within:text-blue-700 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search committees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 lg:py-5 text-base sm:text-lg text-gray-900 placeholder-gray-500 border-2 border-blue-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl bg-white focus:scale-[1.01] sm:focus:scale-[1.02]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  title="Clear search"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 sm:mt-4 text-center">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium max-w-full">
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Showing {filteredCommittees.length} committee{filteredCommittees.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCommittees.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No committees found' : 'No committees available'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Committees will be displayed here once they are added'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCommittees.map((committee) => (
                <div
                  key={committee._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <div className="p-4 sm:p-6">
                    {/* Committee Header */}
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {committee.name}
                      </h3>
                      {committee.description && (
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {committee.description}
                        </p>
                      )}
                    </div>

                    {/* Committee Members */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Advisor */}
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Advisor</p>
                          <p className="text-xs sm:text-sm text-gray-900 truncate">{committee.advisor}</p>
                        </div>
                      </div>

                      {/* Chairperson */}
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Chairperson</p>
                          <p className="text-xs sm:text-sm text-gray-900 truncate">{committee.chairperson}</p>
                        </div>
                      </div>

                      {/* Co-Chairperson */}
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Co-Chairperson</p>
                          <p className="text-xs sm:text-sm text-gray-900 truncate">{committee.coChairperson}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommitteesPage;
