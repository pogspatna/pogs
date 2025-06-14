'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import LocationMap from '@/components/GoogleMap';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="page-header">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center fade-in">
            <h1 className="text-hero mb-6">
              Contact Us
            </h1>
            <p className="text-subtitle text-blue-100 mb-8">
              Get in touch with POGS
            </p>
            <p className="text-body-lg text-blue-50 max-w-3xl mx-auto leading-relaxed">
              We&apos;re here to help and answer any questions you might have. 
              We look forward to hearing from you and connecting with our medical community.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="section-padding-sm bg-white">
        <div className="container">
          <div className="responsive-grid-4 mb-16">
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="card-content">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-caption">Gandhi Maidan, Patna</p>
              </div>
            </div>
            
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="card-content">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Phone className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-caption">0612-2321542</p>
              </div>
            </div>
            
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="card-content">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-caption">patnabogs@gmail.com</p>
              </div>
            </div>
            
            <div className="card text-center group hover:shadow-xl transition-all duration-300">
              <div className="card-content">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="text-white w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Office Hours</h3>
                <p className="text-caption">Mon-Fri: 9AM-5PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="responsive-grid-2 gap-12">
            {/* Contact Information */}
            <div className="slide-up">
              <div className="card-elevated">
                <div className="card-header">
                  <h2 className="text-title text-gray-900">
                    Contact Information
                  </h2>
                  <p className="text-body text-gray-600 mt-2">
                    Reach out to us through any of these channels
                  </p>
                </div>
                
                <div className="card-content space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <MapPin className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Office Address</h4>
                      <p className="text-body text-gray-600 leading-relaxed">
                        IMA Building, Dr. A. K. N. Sinha Path,<br />
                        South East of Gandhi Maidan,<br />
                        Patna – 800 004 (Bihar), India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Phone className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Phone Numbers</h4>
                      <div className="space-y-1">
                        <p className="text-body text-gray-600">
                          <a href="tel:06122321542" className="hover:text-blue-600 transition-colors font-medium">
                            0612-2321542
                          </a>
                        </p>
                        <p className="text-body text-gray-600">
                          <a href="tel:7677253032" className="hover:text-blue-600 transition-colors font-medium">
                            7677253032
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Mail className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Email Address</h4>
                      <p className="text-body text-gray-600">
                        <a 
                          href="mailto:patnabogs@gmail.com" 
                          className="hover:text-blue-600 transition-colors font-medium underline"
                        >
                          patnabogs@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Clock className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Office Hours</h4>
                      <div className="space-y-1 text-body text-gray-600">
                        <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                        <p>Saturday: 9:00 AM - 1:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="slide-up">
              <div className="card-elevated">
                <div className="card-header">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-title text-gray-900">
                        Send us a Message
                      </h2>
                      <p className="text-caption">We&apos;ll respond within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-content">
                  {submitStatus === 'success' && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center space-x-3">
                      <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 font-semibold">Message sent successfully!</p>
                        <p className="text-green-700 text-sm mt-1">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center space-x-3">
                      <XCircle className="text-red-600 w-6 h-6 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 font-semibold">Error sending message</p>
                        <p className="text-red-700 text-sm mt-1">Please try again or contact us directly via phone.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input text-gray-600"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input text-gray-600"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input text-gray-600"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="form-input resize-none text-gray-600"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner mr-2" />
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-title text-gray-900 mb-6">
              Find Our Office
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Patna at Gandhi Maidan area, 
              our office is easily accessible by public transport and private vehicles.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <LocationMap className="shadow-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
} 