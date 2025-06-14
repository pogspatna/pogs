'use client';
import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Newsletter {
  _id: string;
  title: string;
  pdfUrl: string;
  publishDate: string;
  createdAt: string;
}

const NewslettersPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  useEffect(() => {
    filterNewsletters();
  }, [newsletters, searchTerm, selectedYear, sortOrder]);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use localhost:5000/api directly since environment variable might not be set
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/newsletters`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Newsletters data not found');
        }
        throw new Error(`Failed to fetch newsletters (${response.status})`);
      }
      
      const data = await response.json();
      
      // Handle case where data might be empty or null
      if (!data || !Array.isArray(data)) {
        setNewsletters([]);
        return;
      }
      
      setNewsletters(data);
    } catch (err) {
      console.error('Error fetching newsletters:', err);
      setError(err instanceof Error ? err.message : 'Unable to load newsletters at this time');
    } finally {
      setLoading(false);
    }
  };

  const filterNewsletters = () => {
    let filtered = newsletters;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(newsletter =>
        (newsletter.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'All') {
      filtered = filtered.filter(newsletter => {
        const year = new Date(newsletter.publishDate).getFullYear().toString();
        return year === selectedYear;
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNewsletters(filtered);
  };

  const getUniqueYears = () => {
    const years = newsletters.map(newsletter => 
      new Date(newsletter.publishDate).getFullYear().toString()
    );
    return [...new Set(years)].sort((a, b) => parseInt(b) - parseInt(a));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (newsletter: Newsletter) => {
    // For Google Drive files, construct the download URL
    // This assumes the pdfUrl contains the Google Drive file ID
    const fileId = newsletter.pdfUrl;
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = `${newsletter.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-body text-gray-600">Loading newsletters...</p>
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
                onClick={fetchNewsletters}
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
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-hero mb-6">Newsletter Archive</h1>
            <p className="text-subtitle text-blue-100 max-w-3xl mx-auto">
              Access our comprehensive collection of newsletters featuring medical insights, society updates, research publications, and professional developments
            </p>
          </div>
        </div>
      </div>

      {/* Newsletters Section */}
      <div className="section-padding">
        <div className="container">
          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-title text-gray-900 mb-4">Explore Our Publications</h2>
                <p className="text-body text-gray-600">
                  Stay informed with our latest newsletters covering medical advances, society news, and professional insights
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search newsletters by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 pl-12 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-base placeholder-gray-500"
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600 mb-6">
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter and sort:</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {/* Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-700 font-medium cursor-pointer"
                >
                  <option value="All">All Years ({newsletters.length})</option>
                  {getUniqueYears().map((year) => (
                    <option key={year} value={year}>
                      {year} ({newsletters.filter(n => new Date(n.publishDate).getFullYear().toString() === year).length})
                    </option>
                  ))}
                </select>

                {/* Sort Order */}
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                  {sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {newsletters.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-body text-gray-600">
                {filteredNewsletters.length === newsletters.length 
                  ? `Showing all ${newsletters.length} newsletters`
                  : `Showing ${filteredNewsletters.length} of ${newsletters.length} newsletters`
                }
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedYear !== 'All' && ` from ${selectedYear}`}
              </p>
            </div>
          )}

          {/* Newsletters List */}
          {filteredNewsletters.length > 0 ? (
            <div className="space-y-6">
              {filteredNewsletters.map((newsletter, index) => (
                <div 
                  key={newsletter._id} 
                  className={`card-elevated group ${
                    index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'
                  }`}
                >
                  <div className="card-content">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                              {newsletter.title}
                            </h3>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">Published: {formatDate(newsletter.publishDate)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium">PDF Format</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => window.open(`https://drive.google.com/file/d/${newsletter.pdfUrl}/view`, '_blank')}
                          className="btn-secondary btn-sm group/preview"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Preview
                        </button>
                        
                        <button
                          onClick={() => handleDownload(newsletter)}
                          className="btn-primary btn-sm group/download"
                        >
                          <Download className="w-4 h-4 mr-2 group-hover/download:translate-y-1 transition-transform" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-subtitle text-gray-900 mb-4">No Newsletters Found</h3>
              <p className="text-body text-gray-600 max-w-md mx-auto mb-8">
                {searchTerm || selectedYear !== 'All' 
                  ? "No newsletters match your current search criteria. Try adjusting your filters."
                  : "There are currently no newsletters available. Check back later for updates."}
              </p>
              {(searchTerm || selectedYear !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedYear('All');
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Call to Action */}
          {filteredNewsletters.length > 0 && (
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
                <h3 className="text-subtitle mb-4">Stay Updated</h3>
                <p className="text-body-lg text-green-100 max-w-2xl mx-auto mb-8">
                  Subscribe to receive notifications when new newsletters are published and stay connected with our medical community.
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Subscribe for Updates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewslettersPage; 