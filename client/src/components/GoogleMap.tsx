'use client';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface MapProps {
  className?: string;
}

const LocationMap: React.FC<MapProps> = ({ className = '' }) => {
  // POGS Office coordinates (Gandhi Maidan area, Patna)
  const latitude = 25.5941;
  const longitude = 85.1376;
  
  // OpenStreetMap iframe URL
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  
  // Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
  return (
    <div className={`w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white ${className}`}>
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">POGS Office Location</h3>
              <p className="text-blue-100 text-sm">Gandhi Maidan, Patna</p>
            </div>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-full">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          title="POGS Office Location - Gandhi Maidan, Patna"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Overlay with Address Details */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">Complete Address</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  IMA Building, Dr. A. K. N. Sinha Path,<br />
                  South East of Gandhi Maidan,<br />
                  Patna – 800 004 (Bihar), India
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                  <span>📞 0612-2321542</span>
                  <span>📱 7677253032</span>
                  <span>✉️ patnabogs@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap; 