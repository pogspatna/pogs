import Link from 'next/link';
import { Users, Calendar, FileText, UserCheck, MapPin, Award, ArrowRight, Stethoscope, Heart, Shield, Star, CheckCircle, Globe } from 'lucide-react';
import EventsCarousel from '@/components/EventsCarousel';

export default function HomePage() {
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
                    <span className="text-blue-200 text-xs md:text-sm">Trusted by 500+ Members</span>
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
               {/* Events Carousel - Enhanced */}
               <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-lg border border-purple-200/20 rounded-3xl p-4 md:p-6 shadow-2xl">
                 <div className="flex items-center justify-between mb-3 md:mb-4">
                   <h3 className="text-lg md:text-xl font-bold text-white">Upcoming Events</h3>
                   <div className="flex items-center space-x-1">
                     <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></div>
                     <span className="text-purple-200 text-xs md:text-sm">Live Updates</span>
                   </div>
                 </div>
                 <EventsCarousel limit={4} showArrows={true} />
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

      {/* Enhanced Key Features Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-md">
              <Award className="w-5 h-5" />
              <span>Why Choose POGS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Excellence in 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Medical Practice
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Connecting medical professionals, advancing knowledge, and improving patient care 
              through excellence in obstetrics and gynaecology.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-blue-500 hover:border-blue-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Award className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">FOGSI Affiliated</h3>
                <p className="text-gray-600 leading-relaxed">
                  Proud member of the Federation of Obstetric and Gynaecological Societies of India, 
                  ensuring national-level recognition and standards.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-green-500 hover:border-green-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Users className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors">Expert Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with leading obstetricians and gynaecologists in Bihar, 
                  fostering professional growth and collaboration.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-purple-500 hover:border-purple-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Calendar className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors">Regular Events</h3>
                <p className="text-gray-600 leading-relaxed">
                  Educational conferences, workshops, and continuing medical education programs 
                  to stay updated with latest practices.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-orange-500 hover:border-orange-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <FileText className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">Rich Resources</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access comprehensive newsletters, research papers, clinical guidelines, 
                  and educational materials for professional development.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 5 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-red-500 hover:border-red-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <UserCheck className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors">Easy Membership</h3>
                <p className="text-gray-600 leading-relaxed">
                  Simple online and offline membership application process with 
                  transparent fee structure and quick approval.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 6 - Enhanced */}
            <div className="group card hover:scale-105 transition-all duration-500 hover:shadow-2xl border-l-4 border-teal-500 hover:border-teal-600">
              <div className="card-content text-center relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <MapPin className="text-white w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-teal-600 transition-colors">Patna Based</h3>
                <p className="text-gray-600 leading-relaxed">
                  Serving the medical community in Bihar with strong local presence, 
                  regional expertise, and dedicated support.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Preview Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full -translate-y-48 translate-x-48 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full translate-y-40 -translate-x-40 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-50 to-pink-100 rounded-full opacity-30"></div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold shadow-md">
                <Heart className="w-5 h-5" />
                <span>About POGS</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Leading Healthcare
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Excellence
                </span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-600 leading-relaxed">
                  The Patna Obstetrics &amp; Gynaecological Society (POGS) has been at the forefront 
                  of advancing women&apos;s healthcare in Bihar. Our society brings together dedicated 
                  medical professionals committed to excellence in obstetrics and gynaecology.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  As a proud affiliate of FOGSI, we maintain the highest standards of medical 
                  practice while serving our local community with dedication, expertise, and 
                  continuous professional development opportunities.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105">
                  <Heart className="w-5 h-5 mr-3" />
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/members" className="group inline-flex items-center bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700">
                  <Users className="w-5 h-5 mr-3" />
                  View Members
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 p-10 rounded-3xl shadow-2xl border border-blue-100 hover:shadow-3xl transition-all duration-500">
              <div className="space-y-6">
                {/* Enhanced Feature Items */}
                <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Expert Members</h4>
                    <p className="text-gray-600">Leading O&amp;G professionals in Bihar</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-600 text-sm">500+ Active Members</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Award className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">FOGSI Affiliated</h4>
                    <p className="text-gray-600">National recognition and standards</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 text-sm">Certified Excellence</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Regular Programs</h4>
                    <p className="text-gray-600">CME & educational events throughout the year</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-600 text-sm">100+ Annual Events</span>
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

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/20">
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200 font-medium">Active Members</div>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">65+</div>
                <div className="text-blue-200 font-medium">Years of Excellence</div>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-blue-200 font-medium">Annual Events</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
