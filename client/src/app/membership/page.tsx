'use client';
import { useState, useEffect } from 'react';
import { Users, Download, CreditCard, Upload, Check, AlertCircle, Calendar, User, Mail, Phone, MapPin, GraduationCap, ArrowRight, FileText, ExternalLink, Building, Hash, Globe } from 'lucide-react';

interface MembershipForm {
  name: string;
  address: string;
  district: string;
  pinCode: string;
  state: string;
  mobile: string;
  email: string;
  membershipType: 'Life' | 'Annual';
  qualification: string;
  dateOfBirth: string;
  paymentScreenshot: File | null;
  signature: File | null;
  paymentTransactionId: string;
}

interface OfflineForm {
  available: boolean;
  fileId?: string;
  downloadUrl?: string;
}

const MembershipPage = () => {
  const [activeTab, setActiveTab] = useState<'options' | 'online' | 'offline'>('options');
  const [formData, setFormData] = useState<MembershipForm>({
    name: '',
    address: '',
    district: '',
    pinCode: '',
    state: '',
    mobile: '',
    email: '',
    membershipType: 'Life',
    qualification: '',
    dateOfBirth: '',
    paymentScreenshot: null,
    signature: null,
    paymentTransactionId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [offlineForm, setOfflineForm] = useState<OfflineForm>({ available: false });
  const [loadingOfflineForm, setLoadingOfflineForm] = useState(false);

  useEffect(() => {
    fetchOfflineForm();
  }, []);

  const fetchOfflineForm = async () => {
    try {
      setLoadingOfflineForm(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/membership-applications/offline-form`);
      if (response.ok) {
        const data = await response.json();
        setOfflineForm(data);
      }
    } catch (error) {
      console.error('Error fetching offline form:', error);
    } finally {
      setLoadingOfflineForm(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file
    }));
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      signature: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'paymentScreenshot' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key === 'signature' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key !== 'paymentScreenshot') {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/membership-applications`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitStatus('success');
      setSubmitMessage('Your membership application has been submitted successfully! You will receive a confirmation email shortly.');
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        district: '',
        pinCode: '',
        state: '',
        mobile: '',
        email: '',
        membershipType: 'Life',
        qualification: '',
        dateOfBirth: '',
        paymentScreenshot: null,
        signature: null,
        paymentTransactionId: ''
      });
      
      // Reset file input
      const fileInput = document.getElementById('paymentScreenshot') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      const sigInput = document.getElementById('signature') as HTMLInputElement;
      if (sigInput) sigInput.value = '';
      
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit your application. Please try again later.');
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadOfflineForm = () => {
    if (offlineForm.available && offlineForm.downloadUrl) {
      window.open(offlineForm.downloadUrl, '_blank');
    } else {
      alert('Offline application form is not available at the moment. Please try the online application or contact us directly.');
    }
  };

  const paymentDetails = {
    accountHolder: "Patna Obstetrics & Gynaecological Society",
    accountNumber: "1234567890123456",
    ifscCode: "SBIN0012345",
    bankName: "State Bank of India",
    branch: "Patna Main Branch"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="page-header">
        <div className="container">
          <div className="text-center fade-in">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-hero mb-6">Membership Application</h1>
            <p className="text-subtitle text-blue-100 max-w-3xl mx-auto">
              Join POGS and be part of our distinguished medical community committed to excellence in women&apos;s healthcare
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-20 z-40">
        <div className="container">
          <div className="flex overflow-x-auto">
            {[
              { id: 'options', label: 'Application Options', icon: Users },
              { id: 'online', label: 'Online Application', icon: User },
              { id: 'offline', label: 'Offline Application', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'options' | 'online' | 'offline')}
                className={`flex items-center space-x-2 py-4 px-6 border-b-4 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container">
          {/* Application Options */}
          {activeTab === 'options' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 slide-up">
                <h2 className="text-title text-gray-900 mb-6">Choose Your Application Method</h2>
                <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
                  Select the most convenient way to apply for POGS membership and join our medical community
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                {/* Online Application Option */}
                <div className="card-elevated border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 group">
                  <div className="card-content text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-subtitle text-gray-900 mb-4">Online Application</h3>
                    <p className="text-body text-gray-600 mb-8 leading-relaxed">
                      Fill out the digital form, upload payment proof, and submit instantly for faster processing 
                      with automated confirmations.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-green-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Instant submission & processing</span>
                      </div>
                      <div className="flex items-center text-green-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Automated email confirmations</span>
                      </div>
                      <div className="flex items-center text-green-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Digital document management</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('online')}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:translate-y-0 active:shadow-sm"
                    >
                      <span>Start Online Application</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Offline Application Option */}
                <div className="card-elevated border-2 border-gray-100 hover:border-gray-300 transition-all duration-300 group">
                  <div className="card-content text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Download className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-subtitle text-gray-900 mb-4">Offline Application</h3>
                    <p className="text-body text-gray-600 mb-8 leading-relaxed">
                      Download the PDF form, fill it out manually, and submit it through traditional channels 
                      for conventional processing.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-blue-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Printable PDF format</span>
                      </div>
                      <div className="flex items-center text-blue-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Manual submission option</span>
                      </div>
                      <div className="flex items-center text-blue-600 justify-center">
                        <Check className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">Traditional processing method</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('offline')}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:translate-y-0 active:shadow-sm"
                    >
                      <span>Download Form</span>
                      <Download className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Membership Types */}
              <div className="slide-up">
                <h3 className="text-title text-gray-900 mb-12 text-center">Membership Types & Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="card-elevated border-l-4 border-green-500">
                    <div className="card-content">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-subtitle text-gray-900">Life Membership</h4>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-4xl font-bold text-green-600 mb-2">₹15,000</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          One-time Payment
                        </span>
                      </div>
                      <p className="text-body text-gray-600 leading-relaxed">
                        Lifetime membership benefits with permanent access to all society resources, 
                        events, and professional development programs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="card-elevated border-l-4 border-blue-500">
                    <div className="card-content">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-subtitle text-gray-900">Annual Membership</h4>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-4xl font-bold text-blue-600 mb-2">₹1,500</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Annual Renewal
                        </span>
                      </div>
                      <p className="text-body text-gray-600 leading-relaxed">
                        Yearly renewable membership with full access to society benefits, 
                        events, and continuous medical education programs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Online Application Form */}
          {activeTab === 'online' && (
            <div className="max-w-4xl mx-auto">
              <div className="card-elevated">
                <div className="card-header border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-title text-gray-900">Online Membership Application</h2>
                      <p className="text-caption text-gray-600">Complete the form below to apply for POGS membership</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-content">
                  {/* Payment Details */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
                    <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3" />
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <span className="font-semibold text-gray-700">Account Holder:</span>
                        <p className="text-gray-900 font-medium">{paymentDetails.accountHolder}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-semibold text-gray-700">Account Number:</span>
                        <p className="text-gray-900 font-mono text-lg">{paymentDetails.accountNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-semibold text-gray-700">IFSC Code:</span>
                        <p className="text-gray-900 font-mono text-lg">{paymentDetails.ifscCode}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-semibold text-gray-700">Bank & Branch:</span>
                        <p className="text-gray-900 font-medium">
                          {paymentDetails.bankName}<br />
                          {paymentDetails.branch}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                      <p className="text-yellow-800 text-sm font-medium flex items-start">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        Please make the payment and upload the transaction screenshot below before submitting your application.
                      </p>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                      <div className="flex items-start space-x-3">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-green-800 font-semibold mb-1">Application Submitted Successfully!</p>
                          <p className="text-green-700 text-sm">{submitMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 mb-8">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-red-800 font-semibold mb-1">Application Submission Failed</p>
                          <p className="text-red-700 text-sm">{submitMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Personal Information Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                        <User className="w-5 h-5 mr-3 text-blue-600" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            required
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="form-input text-gray-600"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <GraduationCap className="w-4 h-4 inline mr-2" />
                            Qualification
                          </label>
                          <input
                            type="text"
                            name="qualification"
                            required
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g., MBBS, MD, MS"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <Users className="w-4 h-4 inline mr-2" />
                            Membership Type
                          </label>
                          <select
                            name="membershipType"
                            required
                            value={formData.membershipType}
                            onChange={handleInputChange}
                            className="form-input text-gray-600"
                          >
                            <option value="Life">Life Membership (₹15,000)</option>
                            <option value="Annual">Annual Membership (₹1,500)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                        <Mail className="w-5 h-5 mr-3 text-blue-600" />
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            required
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                        Address Information
                      </h4>
                      <div className="space-y-6">
                        <div className="form-group">
                          <label className="form-label form-label-required">
                            <Building className="w-4 h-4 inline mr-2" />
                            Complete Address
                          </label>
                          <textarea
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="form-input"
                            placeholder="Enter your complete address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="form-group">
                            <label className="form-label form-label-required">
                              <MapPin className="w-4 h-4 inline mr-2" />
                              District
                            </label>
                            <input
                              type="text"
                              name="district"
                              required
                              value={formData.district}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="District"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label form-label-required">
                              <Hash className="w-4 h-4 inline mr-2" />
                              PIN Code
                            </label>
                            <input
                              type="text"
                              name="pinCode"
                              required
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="PIN Code"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label form-label-required">
                              <Globe className="w-4 h-4 inline mr-2" />
                              State
                            </label>
                            <input
                              type="text"
                              name="state"
                              required
                              value={formData.state}
                              onChange={handleInputChange}
                              className="form-input"
                              placeholder="State"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Screenshot Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                        <Upload className="w-5 h-5 mr-3 text-blue-600" />
                        Payment Screenshot
                      </h4>
                      <div className="form-group">
                        <label className="form-label form-label-required">
                          UTR / Transaction ID
                        </label>
                        <input
                          type="text"
                          name="paymentTransactionId"
                          required
                          value={formData.paymentTransactionId}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="Enter your payment UTR/Transaction ID"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the reference number from your payment receipt.</p>
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload Payment Screenshot
                        </label>
                        <input
                          type="file"
                          id="paymentScreenshot"
                          name="paymentScreenshot"
                          required
                          accept="image/*"
                          onChange={handleFileChange}
                          className="form-input text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Upload a clear screenshot of your payment transaction (JPG, PNG, or other image formats)
                        </p>
                        {formData.paymentScreenshot && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">
                              ✓ File selected: {formData.paymentScreenshot.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Signature Upload Section */}
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200 flex items-center">
                        <Upload className="w-5 h-5 mr-3 text-blue-600" />
                        Applicant Signature
                      </h4>
                      <div className="form-group">
                        <label className="form-label form-label-required">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload Signature Image
                        </label>
                        <input
                          type="file"
                          id="signature"
                          name="signature"
                          required
                          accept="image/*"
                          onChange={handleSignatureChange}
                          className="form-input text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Upload a clear image of your signature (JPG or PNG preferred)
                        </p>
                        {formData.signature && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 font-medium">
                              ✓ File selected: {formData.signature.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-12 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-3"></div>
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Offline Application */}
          {activeTab === 'offline' && (
            <div className="max-w-4xl mx-auto">
              <div className="card-elevated">
                <div className="card-header border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-title text-gray-900">Offline Membership Application</h2>
                      <p className="text-caption text-gray-600">Download and submit the PDF application form</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-content">
                  {loadingOfflineForm ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading form information...</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Form Status */}
                      {offlineForm.available ? (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                          <div className="flex items-start space-x-3">
                            <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="text-green-800 font-semibold mb-2">Application Form Available</h3>
                              <p className="text-green-700 text-sm mb-4">
                                The offline application form is ready for download. Click the button below to get the PDF form.
                              </p>
                              <button
                                onClick={handleDownloadOfflineForm}
                                className="btn-primary flex items-center space-x-2"
                              >
                                <Download className="w-4 h-4" />
                                <span>Download Application Form</span>
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                              <h3 className="text-yellow-800 font-semibold mb-2">Form Currently Unavailable</h3>
                              <p className="text-yellow-700 text-sm">
                                The offline application form is not available at the moment. Please try the online application 
                                or contact us directly for assistance.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                          <FileText className="w-5 h-5 mr-3 text-blue-600" />
                          How to Apply Offline
                        </h3>
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              1
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Download the Form</h4>
                              <p className="text-gray-600 text-sm">
                                Click the download button above to get the PDF application form on your device.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              2
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Fill Out the Form</h4>
                              <p className="text-gray-600 text-sm">
                                Print the form and fill it out completely with accurate information. Ensure all required fields are completed.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              3
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Make Payment</h4>
                              <p className="text-gray-600 text-sm">
                                Transfer the membership fee to our bank account and attach the payment receipt with your application.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                              4
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Submit the Application</h4>
                              <p className="text-gray-600 text-sm">
                                Submit the completed form along with payment proof to our office address or email it to us.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8">
                        <h3 className="text-lg font-bold text-blue-900 mb-6">Submission Details</h3>
                        <div className="space-y-4 text-sm">
                          <div>
                            <span className="font-semibold text-blue-800">Office Address:</span>
                            <p className="text-blue-700 mt-1">
                              IMA Building, Dr. A. K. N. Sinha Path,<br />
                              South East of Gandhi Maidan,<br />
                              Patna – 800 004 (Bihar)
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800">Email:</span>
                            <p className="text-blue-700 mt-1">patnabogs@gmail.com</p>
                          </div>
                          <div>
                            <span className="font-semibold text-blue-800">Phone:</span>
                            <p className="text-blue-700 mt-1">0612-2321542, 7677253032</p>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Option */}
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">Prefer a faster process?</p>
                        <button
                          onClick={() => setActiveTab('online')}
                          className="btn-outline"
                        >
                          Try Online Application Instead
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;