const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types based on backend models
export interface Member {
  _id: string;
  name: string;
  address: string;
  membershipType: 'Life' | 'Annual';
  dateJoined: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  createdAt: string;
  updatedAt: string;
}

export interface OfficeBearer {
  _id: string;
  name: string;
  designation: string;
  mobile?: string;
  email?: string;
  photo: string;
  year: number;
  isCurrent: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Committee {
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

export interface MembershipApplication {
  _id: string;
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
  paymentScreenshot: string;
  applicationPdf: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Responded';
  createdAt: string;
}

export interface Gallery {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  uploadDate: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// API Error handling
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        errorData.message || 'Request failed'
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, 'Network error');
  }
}

// Members API
export const membersAPI = {
  getAll: () => apiRequest<Member[]>('/members'),
  getById: (id: string) => apiRequest<Member>(`/members/${id}`),
  create: (data: Omit<Member, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Member>) =>
    apiRequest<Member>(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/members/${id}`, {
      method: 'DELETE',
    }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest<Event[]>('/events'),
  getById: (id: string) => apiRequest<Event>(`/events/${id}`),
  create: (data: Omit<Event, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Event>) =>
    apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// Office Bearers API
export const officeBearersAPI = {
  getAll: () => apiRequest<OfficeBearer[]>('/office-bearers'),
  getById: (id: string) => apiRequest<OfficeBearer>(`/office-bearers/${id}`),
  create: (data: Omit<OfficeBearer, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<OfficeBearer>('/office-bearers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<OfficeBearer>) =>
    apiRequest<OfficeBearer>(`/office-bearers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/office-bearers/${id}`, {
      method: 'DELETE',
    }),
};

// Newsletters API
export const newslettersAPI = {
  getAll: () => apiRequest<Newsletter[]>('/newsletters'),
  getById: (id: string) => apiRequest<Newsletter>(`/newsletters/${id}`),
  create: (data: Omit<Newsletter, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Newsletter>('/newsletters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Newsletter>) =>
    apiRequest<Newsletter>(`/newsletters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/newsletters/${id}`, {
      method: 'DELETE',
    }),
};

// Membership Applications API
export const membershipApplicationsAPI = {
  getAll: () => apiRequest<MembershipApplication[]>('/membership-applications'),
  getById: (id: string) => apiRequest<MembershipApplication>(`/membership-applications/${id}`),
  approve: (id: string, adminEmail: string) =>
    apiRequest<MembershipApplication>(`/membership-applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminEmail }),
    }),
  reject: (id: string, adminEmail: string) =>
    apiRequest<MembershipApplication>(`/membership-applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminEmail }),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/membership-applications/${id}`, {
      method: 'DELETE',
    }),
  getOfflineForm: () => apiRequest<{
    available: boolean;
    fileId?: string;
    downloadUrl?: string;
  }>('/membership-applications/offline-form'),
  uploadOfflineForm: async (file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await fetch(`${API_BASE_URL}/membership-applications/offline-form`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// Contact Inquiries API
export const contactInquiriesAPI = {
  getAll: () => apiRequest<ContactInquiry[]>('/contact-inquiries'),
  getById: (id: string) => apiRequest<ContactInquiry>(`/contact-inquiries/${id}`),
  markAsResponded: (id: string) =>
    apiRequest<ContactInquiry>(`/contact-inquiries/${id}/respond`, {
      method: 'POST',
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/contact-inquiries/${id}`, {
      method: 'DELETE',
    }),
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: () => apiRequest<{
    totalMembers: number;
    pendingApplications: number;
    totalEvents: number;
    newInquiries: number;
    recentMembers: Member[];
    upcomingEvents: Event[];
  }>('/dashboard/stats'),
};

// Gallery API
export const galleryAPI = {
  getAll: () => apiRequest<Gallery[]>('/gallery'),
  getById: (id: string) => apiRequest<Gallery>(`/gallery/${id}`),
  getDates: () => apiRequest<{
    date: string;
    count: number;
    formattedDate: string;
  }[]>('/gallery/dates'),
  getByDate: (date: string) => apiRequest<Gallery[]>(`/gallery/by-date/${date}`),
  create: (data: Omit<Gallery, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Gallery>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Gallery>) =>
    apiRequest<Gallery>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};

// Committee API
export const committeesAPI = {
  getAll: () => apiRequest<Committee[]>('/committees'),
  getById: (id: string) => apiRequest<Committee>(`/committees/${id}`),
  create: (data: Omit<Committee, '_id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Committee>('/committees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Committee>) =>
    apiRequest<Committee>(`/committees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/committees/${id}`, {
      method: 'DELETE',
    }),
};

// Unified API Service
export const apiService = {
  // Members
  getMembers: membersAPI.getAll,
  getMember: membersAPI.getById,
  createMember: membersAPI.create,
  updateMember: membersAPI.update,
  deleteMember: membersAPI.delete,

  // Events
  getEvents: eventsAPI.getAll,
  getEvent: eventsAPI.getById,
  createEvent: eventsAPI.create,
  updateEvent: eventsAPI.update,
  deleteEvent: eventsAPI.delete,

  // Office Bearers
  getOfficeBearers: officeBearersAPI.getAll,
  getOfficeBearer: officeBearersAPI.getById,
  createOfficeBearer: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/office-bearers`, {
      method: 'POST',
      body: data, // FormData for file upload
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  updateOfficeBearer: async (id: string, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/office-bearers/${id}`, {
      method: 'PUT',
      body: data, // FormData for file upload
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  deleteOfficeBearer: officeBearersAPI.delete,

  // Newsletters
  getNewsletters: newslettersAPI.getAll,
  getNewsletter: newslettersAPI.getById,
  createNewsletter: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/newsletters`, {
      method: 'POST',
      body: data, // FormData for file upload
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  updateNewsletter: async (id: string, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: 'PUT',
      body: data, // FormData for file upload
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  deleteNewsletter: newslettersAPI.delete,

  // Membership Applications
  getMembershipApplications: membershipApplicationsAPI.getAll,
  getMembershipApplication: membershipApplicationsAPI.getById,
  approveMembershipApplication: (id: string) =>
    apiRequest<MembershipApplication>(`/membership-applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminEmail: 'admin@pogs.com' }),
    }),
  rejectMembershipApplication: (id: string, _reason?: string) =>
    apiRequest<MembershipApplication>(`/membership-applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminEmail: 'admin@pogs.com', rejectionReason: _reason }),
    }),
  deleteMembershipApplication: membershipApplicationsAPI.delete,
  getOfflineForm: membershipApplicationsAPI.getOfflineForm,
  uploadOfflineForm: membershipApplicationsAPI.uploadOfflineForm,

  // Contact Inquiries
  getContactInquiries: contactInquiriesAPI.getAll,
  getContactInquiry: contactInquiriesAPI.getById,
  markContactAsResponded: contactInquiriesAPI.markAsResponded,
  deleteContactInquiry: contactInquiriesAPI.delete,

  // Dashboard
  getDashboardStats: dashboardAPI.getStats,

  // Gallery
  getGalleryImages: galleryAPI.getAll,
  getGalleryImage: galleryAPI.getById,
  uploadGalleryImage: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      body: data,
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  createGalleryImage: async (data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      body: data,
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  updateGalleryImage: async (id: string, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      body: data, // FormData for file upload
    });
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
  deleteGalleryImage: galleryAPI.delete,
  getGalleryDates: galleryAPI.getDates,
  getGalleryByDate: galleryAPI.getByDate,

  // Committees
  getCommittees: committeesAPI.getAll,
  getCommittee: committeesAPI.getById,
  createCommittee: committeesAPI.create,
  updateCommittee: committeesAPI.update,
  deleteCommittee: committeesAPI.delete,
};

export { APIError }; 