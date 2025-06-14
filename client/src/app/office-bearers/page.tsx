'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, User, Archive, Users, Crown, Medal } from 'lucide-react';

interface OfficeBearer {
  _id: string;
  name: string;
  designation: string;
  mobile?: string;
  email?: string;
  photo: string;
  year: number;
  isCurrent: boolean;
  order: number;
}

const OfficeBearersPage = () => {
  const [currentBearers, setCurrentBearers] = useState<OfficeBearer[]>([]);
  const [pastBearers, setPastBearers] = useState<OfficeBearer[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGoogleDriveImageUrl = (fileId: string) => {
    // Use the same URL format as admin panel for consistency
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  useEffect(() => {
    fetchOfficeBearers();
  }, []);

  const fetchOfficeBearers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use localhost:5000/api directly since environment variable might not be set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/office-bearers`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Office bearers data not found');
        }
        throw new Error(`Failed to fetch office bearers (${response.status})`);
      }
      
      const data = await response.json();
      
      // Handle case where data might be empty or null
      if (!data || !Array.isArray(data)) {
        setCurrentBearers([]);
        setPastBearers([]);
        return;
      }
      
      const current = data.filter((bearer: OfficeBearer) => bearer.isCurrent)
        .sort((a: OfficeBearer, b: OfficeBearer) => a.order - b.order);
      const past = data.filter((bearer: OfficeBearer) => !bearer.isCurrent);
      
      setCurrentBearers(current);
      setPastBearers(past);
    } catch (err) {
      console.error('Error fetching office bearers:', err);
      setError(err instanceof Error ? err.message : 'Unable to load office bearers at this time');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueYears = () => {
    const years = [...new Set(pastBearers.map(bearer => bearer.year))];
    return years.sort((a, b) => b - a);
  };

  const getPastBearersByYear = (year: number) => {
    return pastBearers
      .filter(bearer => bearer.year === year)
      .sort((a, b) => a.order - b.order);
  };

  const getDesignationIcon = (designation: string) => {
    const lower = designation.toLowerCase();
    if (lower.includes('president') || lower.includes('chairman')) {
      return Crown;
    } else if (lower.includes('secretary') || lower.includes('treasurer')) {
      return Medal;
    } else {
      return User;
    }
  };

  const getDesignationColor = (designation: string) => {
    const lower = designation.toLowerCase();
    if (lower.includes('president') || lower.includes('chairman')) {
      return 'from-yellow-500 to-yellow-600';
    } else if (lower.includes('secretary') || lower.includes('treasurer')) {
      return 'from-blue-500 to-blue-600';
    } else {
      return 'from-green-500 to-green-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-body text-gray-600">Loading office bearers...</p>
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
                onClick={fetchOfficeBearers}
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
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-hero mb-6">Office Bearers</h1>
            <p className="text-subtitle text-blue-100 max-w-3xl mx-auto">
              Meet the distinguished medical professionals who lead POGS with dedication, expertise, and unwavering commitment to women&apos;s healthcare
            </p>
          </div>
        </div>
      </div>

      {/* Current Office Bearers */}
      <div className="section-padding">
        <div className="container">
          <div className="text-center mb-16 slide-up">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-title text-gray-900">Current Leadership Team</h2>
            </div>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Our current office bearers who guide POGS with vision, expertise, and commitment to excellence in medical education and practice
            </p>
          </div>

          {currentBearers.length > 0 ? (
            <div className="responsive-grid-4">
              {currentBearers.map((bearer, index) => {
                const DesignationIcon = getDesignationIcon(bearer.designation);
                const colorClass = getDesignationColor(bearer.designation);
                
                return (
                  <div 
                    key={bearer._id} 
                    className={`card-elevated group ${
                      index % 4 === 0 ? 'slide-in-left' : 
                      index % 4 === 1 ? 'slide-up' : 
                      index % 4 === 2 ? 'slide-up' : 'slide-in-right'
                    }`}
                  >
                    <div className="relative">
                      <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                        {bearer.photo && !bearer.photo.startsWith('local-') ? (
                          <Image
                            src={getGoogleDriveImageUrl(bearer.photo)}
                            alt={bearer.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                            <User className="w-20 h-20 text-blue-400" />
                          </div>
                        )}
                        
                        {/* Designation Badge */}
                        <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}>
                          <DesignationIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="card-content">
                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {bearer.name}
                          </h3>
                          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 mb-3">
                            <p className="text-blue-800 font-semibold text-sm">{bearer.designation}</p>
                          </div>
                          {(bearer.mobile || bearer.email) && (
                            <div className="space-y-2 text-sm text-gray-600">
                              {bearer.mobile && (
                                <div className="flex items-center justify-center space-x-2">
                                  <span className="text-blue-500">📱</span>
                                  <span>{bearer.mobile}</span>
                                </div>
                              )}
                              {bearer.email && (
                                <div className="flex items-center justify-center space-x-2">
                                  <span className="text-blue-500">✉️</span>
                                  <span className="truncate max-w-[200px]">{bearer.email}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-subtitle text-gray-900 mb-4">No Current Office Bearers</h3>
              <p className="text-body text-gray-600">Office bearer information will be updated soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Office Bearers Archive */}
      {pastBearers.length > 0 && (
        <div className="section-padding bg-white">
          <div className="container">
            <div className="text-center mb-16 slide-up">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-title text-gray-900">Leadership Archive</h2>
              </div>
              <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
                Honor the legacy of our previous office bearers who have contributed significantly to the growth and development of POGS over the years
              </p>
            </div>

            {/* Year Selection */}
            <div className="text-center mb-12">
              <p className="text-body text-gray-600 mb-6">Select a year to view the office bearers from that term:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {getUniqueYears().map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      selectedYear === year
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200 hover:border-blue-200 shadow-sm'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                    <span className="text-xs opacity-75">
                      ({getPastBearersByYear(year).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Past Bearers Display */}
            {selectedYear ? (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Office Bearers - {selectedYear}</h3>
                  <p className="text-body text-gray-600">
                    {getPastBearersByYear(selectedYear).length} office bearers served during this term
                  </p>
                </div>
                
                <div className="responsive-grid-4">
                  {getPastBearersByYear(selectedYear).map((bearer, index) => {
                    const DesignationIcon = getDesignationIcon(bearer.designation);
                    const colorClass = getDesignationColor(bearer.designation);
                    
                    return (
                      <div 
                        key={bearer._id} 
                        className={`card group ${
                          index % 4 === 0 ? 'slide-in-left' : 
                          index % 4 === 1 ? 'slide-up' : 
                          index % 4 === 2 ? 'slide-up' : 'slide-in-right'
                        }`}
                      >
                        <div className="relative">
                          <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                            {bearer.photo && !bearer.photo.startsWith('local-') ? (
                              <Image
                                src={getGoogleDriveImageUrl(bearer.photo)}
                                alt={bearer.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <User className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Year Badge */}
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                              <span className="text-white text-xs font-semibold">{bearer.year}</span>
                            </div>
                            
                            {/* Designation Badge */}
                            <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center shadow-lg`}>
                              <DesignationIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          
                          <div className="card-content">
                            <div className="text-center">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {bearer.name}
                              </h3>
                              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 mb-3">
                                <p className="text-gray-700 font-medium text-sm">{bearer.designation}</p>
                              </div>
                              {(bearer.mobile || bearer.email) && (
                                <div className="space-y-1 text-xs text-gray-500">
                                  {bearer.mobile && (
                                    <div className="flex items-center justify-center space-x-1">
                                      <span>📱</span>
                                      <span>{bearer.mobile}</span>
                                    </div>
                                  )}
                                  {bearer.email && (
                                    <div className="flex items-center justify-center space-x-1">
                                      <span>✉️</span>
                                      <span className="truncate max-w-[150px]">{bearer.email}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Archive className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-subtitle text-gray-900 mb-4">Select a Year</h3>
                <p className="text-body text-gray-600 max-w-md mx-auto">
                  Choose a year from the buttons above to view the office bearers who served during that term.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="section-padding">
        <div className="container">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
              <h3 className="text-subtitle mb-4">Join Our Leadership</h3>
              <p className="text-body-lg text-blue-100 max-w-2xl mx-auto mb-8">
                Interested in contributing to POGS leadership? Learn about opportunities to serve our medical community and advance women&apos;s healthcare.
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Involved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeBearersPage; 