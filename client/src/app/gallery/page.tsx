'use client';

import { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface Gallery {
  _id: string;
  imageUrl: string;
  uploadDate: string;
  order: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/gallery?active=true`);
      if (response.ok) {
        const data: Gallery[] = await response.json();
        setImages(data);
        
        // Auto-expand all dates by default
        const dateStrings: string[] = data.map((img: Gallery) => new Date(img.uploadDate).toDateString());
        const uniqueDatesSet = new Set(dateStrings);
        const uniqueDates = Array.from<string>(uniqueDatesSet);
        setExpandedDates(uniqueDates);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (fileId: string) => {
    return `https://drive.google.com/uc?id=${fileId}`;
  };

  const groupImagesByDate = () => {
    const grouped: { [key: string]: Gallery[] } = {};
    images.forEach(image => {
      const dateKey = new Date(image.uploadDate).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(image);
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(grouped).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    return sortedDates.map(date => ({
      date,
      images: grouped[date].sort((a, b) => a.order - b.order)
    }));
  };

  const toggleDateExpansion = (date: string) => {
    setExpandedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const isDateExpanded = (date: string) => {
    return expandedDates.includes(date);
  };

  const groupedImages = groupImagesByDate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">POGS Gallery</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore our collection of memorable moments, events, and achievements from the Patna Obstetrics & Gynaecological Society
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gallery Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : groupedImages.length > 0 ? (
          <div className="space-y-8">
            {groupedImages.map(({ date, images }) => (
              <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleDateExpansion(date)}
                  className="w-full px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {images.length} {images.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>
                  {isDateExpanded(date) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {isDateExpanded(date) && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {images.map((image) => (
                        <div
                          key={image._id}
                          className="group cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square">
                            <img
                              src={getImageUrl(image.imageUrl)}
                              alt="Gallery image"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://drive.google.com/thumbnail?id=${image.imageUrl}&sz=w400`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-500">
              Images will appear here once they are uploaded.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
            >
              ✕
            </button>
            <img
              src={getImageUrl(selectedImage.imageUrl)}
              alt="Gallery image"
              className="w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://drive.google.com/thumbnail?id=${selectedImage.imageUrl}&sz=w800`;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 