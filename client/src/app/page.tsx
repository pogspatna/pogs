'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Calendar, UserCheck, Award, ArrowRight, Stethoscope, Heart, Shield, Star, CheckCircle, Globe } from 'lucide-react';
import EventsCarousel from '@/components/EventsCarousel';
import { useEffect, useState } from 'react';

function PdfModal({ fileId, title, onClose }: { fileId: string; title: string; onClose: () => void }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl w-full">
        <div className="modal-header flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 truncate pr-4">{title}</h3>
          <button onClick={onClose} className="btn-ghost btn-sm !p-2">✕</button>
        </div>
        <div className="modal-body p-0">
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            className="w-full h-[75vh]"
          />
        </div>
      </div>
    </div>
  );
}

interface Notice {
  _id: string;
  title: string;
  content: string;
  expiryDate: string;
  createdAt: string;
  pdfViewUrl?: string | null;
  pdfDownloadUrl?: string | null;
}

export default function HomePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openPdf, setOpenPdf] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/notices`);
        if (res.ok) {
          const data = await res.json();
          setNotices(Array.isArray(data) ? data : []);
        }
      } catch {
        // Silent fail; homepage should still render
      }
    };
    loadNotices();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen gradient-medical text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 md:w-80 md:h-80 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-32 h-32 md:w-64 md:h-64 bg-teal-300/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-10 right-10 w-16 h-16 md:w-32 md:h-32 bg-white/15 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-10 w-20 h-20 md:w-40 md:h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container relative z-10 px-4 py-8 md:py-16 lg:py-20 flex flex-col justify-center min-h-screen">
          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              {/* Logo & Branding */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                    <Stethoscope className="text-white w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none">
                    POGS
                  </h1>
                  <p className="text-blue-100 text-base md:text-lg lg:text-xl font-medium">Patna O&G Society</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 md:space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    </div>
                    <span className="text-blue-200 text-xs md:text-sm">Trusted by 950+ Members</span>
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Patna Obstetric &
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                    Gynaecological Society
                  </span>
                </h2>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3">
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full border border-white/20">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-300" />
                    <span className="text-white text-xs md:text-sm font-medium">FOGSI Affiliated</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full border border-white/20">
                    <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-300" />
                    <span className="text-white text-xs md:text-sm font-medium">Since 1958</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full border border-white/20">
                    <Globe className="w-3 h-3 md:w-4 md:h-4 text-blue-300" />
                    <span className="text-white text-xs md:text-sm font-medium">Bihar&apos;s Premier</span>
                  </div>
                </div>

                

                <p className="text-base md:text-lg text-blue-50 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Join Bihar&apos;s leading medical society dedicated to promoting the highest standards 
                  of obstetrics and gynaecology practice, proudly affiliated with FOGSI.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link href="/membership" className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                    Join POGS Today
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
                
                <Link href="/about" className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-2xl transition-all duration-300 hover:bg-white hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span className="flex items-center justify-center">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                    Learn More
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Trust Indicators - Enhanced */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8 border-t border-white/20">
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 group-hover:scale-110 transition-transform">950+</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium">Active Members</div>
                  <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mt-1 md:mt-2"></div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 group-hover:scale-110 transition-transform">65+</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium">Years Excellence</div>
                  <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-1 md:mt-2"></div>
                </div>
                <div className="text-center group">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 group-hover:scale-110 transition-transform">100+</div>
                  <div className="text-blue-200 text-xs md:text-sm font-medium">Annual Events</div>
                  <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-1 md:mt-2"></div>
                </div>
              </div>
            </div>

            {/* Right Column: Events */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8 mt-8 lg:mt-0">
              {/* Events Section - Redesigned */}
              <div className="relative">
                {/* Background Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">Upcoming Events</h3>
                        <p className="text-blue-100 text-sm">Stay updated with our latest programs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-medium">Live</span>
                  </div>
                </div>

                  {/* Events Content */}
                  <div className="relative">
                    <EventsCarousel limit={3} showArrows={true} />
              </div>

                  {/* Footer CTA */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link 
                      href="/events" 
                      className="group flex items-center justify-center w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      <span className="flex items-center space-x-2">
                        <span>View All Events</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-sm"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Important Notices + Leadership Section */}
      <section className="section-padding bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full -translate-y-36 translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-emerald-100/30 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Important Notices */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Important Notices</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Updated</span>
                </h2>
                <p className="text-gray-600 text-lg">Latest announcements and important updates from POGS</p>
            </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">📢</span>
                </div>
                    <div>
                      <h3 className="text-white font-semibold">Active Notices</h3>
                      <p className="text-blue-100 text-sm">{notices.length} notice{notices.length !== 1 ? 's' : ''} available</p>
                </div>
              </div>
            </div>

                <div className="p-6 max-h-80 overflow-y-auto scrollbar-hide">
                  {notices.length > 0 ? (
                    <div className="space-y-4">
                      {notices.map((notice, index) => (
                        <div key={notice._id} className="group">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                  {notice.title}
                                </h4>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                                  {notice.content}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Valid till {new Date(notice.expiryDate).toLocaleDateString()}</span>
                                  </div>
                                  <div>
                                    {notice.pdfViewUrl && (
                                      <button
                                        onClick={() => setOpenPdf({ id: new URL(notice.pdfViewUrl as string).searchParams.get('id') || '', title: notice.title })}
                                        className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                                      >
                                        View Details
                                      </button>
                                    )}
                                  </div>
                </div>
              </div>
            </div>
                </div>
              </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📋</span>
            </div>
                      <h3 className="text-gray-600 font-medium mb-2">No Active Notices</h3>
                      <p className="text-gray-500 text-sm">Check back later for updates</p>
                </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Leadership */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Leadership</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Leaders</span>
                </h2>
                <p className="text-gray-600 text-lg">Dedicated professionals leading POGS forward</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* President */}
                <div className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <Image 
                            src="/president.png" 
                            alt="POGS President" 
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
              </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">👑</span>
              </div>
            </div>
                  </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        President
                      </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Leading POGS with vision and dedication to advance women&apos;s healthcare in Bihar.
                    </p>
                      <div className="mt-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Executive Leadership</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Secretary */}
                <div className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <Image 
                            src="/secretary.png" 
                            alt="POGS Secretary" 
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                  </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">📝</span>
                    </div>
                  </div>
                </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                        Secretary
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Managing POGS operations and ensuring smooth coordination of all activities.
                      </p>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Administrative Leadership</span>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="section-padding gradient-medical text-white relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-green-300/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-white/30 shadow-xl">
              <UserCheck className="w-5 h-5" />
              <span>Join Our Community</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Ready to Join Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                Medical Community?
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
              Become part of Bihar&apos;s leading obstetrics and gynaecology society. Connect with experts, 
              advance your career, and contribute to excellence in women&apos;s healthcare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/membership" className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                <span className="relative z-10 flex items-center">
                  <UserCheck className="w-6 h-6 mr-3" />
                  Apply for Membership
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </Link>
              
              <Link href="/contact" className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 hover:bg-white hover:text-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center">
                  <Heart className="w-6 h-6 mr-3" />
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Numbers section removed as requested */}
          </div>
        </div>
      </section>
      {openPdf && (
        <PdfModal
          fileId={openPdf.id}
          title={openPdf.title}
          onClose={() => setOpenPdf(null)}
        />
      )}
    </div>
  );
}
