import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/login') || 
                          error.config?.url?.includes('/auth');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      console.warn('⚠️ Authentication required for:', error.config?.url);
      // User requested to only logout manually. We remove the auto-redirect.
    }
    return Promise.reject(error);
  }
);

// ============ DRIVER PANEL AUTH ============
export const driverAuthAPI = {
  login: (email, password) => api.post('/transport-panel/driver/login', { email, password }),
  getProfile: () => api.get('/transport-panel/driver/profile'),
  updateProfile: (data) => api.put('/transport-panel/driver/profile', data, {
    headers: {
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  }),
  changePassword: (oldPassword, newPassword) => 
    api.put('/transport-panel/driver/change-password', { oldPassword, newPassword })
};

// ============ DRIVER PANEL - DASHBOARD ============
export const driverDashboardAPI = {
  getStats: () => api.get('/transport-panel/driver/dashboard'),
  getRouteDetails: () => api.get('/transport-panel/driver/route-details'),
  getNotices: () => api.get('/transport-panel/driver/notices')
};

// ============ VEHICLE CHECKLIST ============
export const vehicleChecklistAPI = {
  submit: (data) => api.post('/transport-panel/checklist/submit', data),
  getHistory: (page = 1, limit = 20) => 
    api.get('/transport-panel/checklist/history', { params: { page, limit } }),
  getToday: () => api.get('/transport-panel/checklist/today'),
  getAllForBranch: (date) => 
    api.get('/transport-panel/checklist/branch/all', { params: { date } })
};

// ============ DRIVER COMPLAINTS ============
export const driverComplaintAPI = {
  submit: (data) => api.post('/transport-panel/complaints/submit', data),
  getMyHistory: (page = 1, limit = 20) => 
    api.get('/transport-panel/complaints/my-history', { params: { page, limit } }),
  getAllForBranch: (status, reportType) => 
    api.get('/transport-panel/complaints/branch/all', { params: { status, reportType } }),
  updateStatus: (id, data) => api.put(`/transport-panel/complaints/status/${id}`, data)
};

// ============ ADMIN DRIVER MANAGEMENT ============
export const driverAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/driver/all', { params: { page, limit } }),
  getById: (id) => api.get(`/driver/${id}`),
  create: (data) => api.post('/driver/create', data),
  update: (id, data) => api.put(`/driver/update/${id}`, data),
  delete: (id) => api.delete(`/driver/delete/${id}`),
  toggleStatus: (id) => api.patch(`/driver/toggle-status/${id}`)
};

// ============ VEHICLE MANAGEMENT ============
export const vehicleAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/vehicle', { params: { page, limit } }),
  getById: (id) => api.get(`/vehicle/${id}`),
  create: (data) => api.post('/vehicle', data),
  update: (id, data) => api.put(`/vehicle/${id}`, data),
  delete: (id) => api.delete(`/vehicle/${id}`)
};

// ============ ROUTE MANAGEMENT ============
export const routeAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/route', { params: { page, limit } }),
  getById: (id) => api.get(`/route/${id}`),
  create: (data) => api.post('/route', data),
  update: (id, data) => api.put(`/route/${id}`, data),
  delete: (id) => api.delete(`/route/${id}`)
};

// ============ ROUTE STOPS ============
export const routeStopAPI = {
  getByRoute: (routeId) => api.get(`/route-stop/route/${routeId}`),
  create: (data) => {
    const payload = {
      routeId: data.routeId,
      stops: [{
        stopName: data.stopName,
        stopOrder: data.sequence,
        pickupTime: data.arrivalTime,
        dropTime: data.departureTime
      }]
    };
    return api.post('/route-stop/add', payload);
  },
  update: (id, data) => {
    const payload = {
      stopName: data.stopName,
      stopOrder: data.sequence,
      pickupTime: data.arrivalTime,
      dropTime: data.departureTime
    };
    return api.put(`/route-stop/update/${id}`, payload);
  },
  delete: (id) => api.delete(`/route-stop/delete/${id}`)
};

// ============ ROUTE CHARGES ============
export const routeChargeAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/route-charge', { params: { page, limit } }),
  getById: (id) => api.get(`/route-charge/${id}`),
  create: (data) => api.post('/route-charge', data),
  update: (id, data) => api.put(`/route-charge/${id}`, data),
  delete: (id) => api.delete(`/route-charge/${id}`)
};

// ============ TRANSPORT ALLOCATION ============
export const transportAllocationAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/transport-allocation', { params: { page, limit } }),
  getById: (id) => api.get(`/transport-allocation/${id}`),
  create: (data) => api.post('/transport-allocation', data),
  update: (id, data) => api.put(`/transport-allocation/${id}`, data),
  delete: (id) => api.delete(`/transport-allocation/${id}`)
};

// ============ TRANSPORT ASSIGNMENT ============
export const transportAssignmentAPI = {
  getAll: (page = 1, limit = 20) => 
    api.get('/transport-assignment', { params: { page, limit } }),
  create: (data) => api.post('/transport-assignment', data),
  update: (id, data) => api.put(`/transport-assignment/${id}`, data),
  delete: (id) => api.delete(`/transport-assignment/${id}`)
};

export const studentAPI = {
  search: (query) => api.get('/student-optimized/all', { params: { search: query, limit: 50 } })
};

export const staffAPI = {
  search: (query, role = 'staff') => api.get('/admin-panel/staff/all', { params: { search: query, limit: 50, role } })
};

// ============ DRIVER SALARY & DOCUMENTS ============
export const driverSalaryAPI = {
  getSalary: () => api.get('/transport-panel/salary-docs/salary'),
  getDocuments: () => api.get('/transport-panel/salary-docs/documents')
};

// ============ GPS TRACKING ============
export const gpsTrackingAPI = {
  updateLocation: (data) => api.post('/transport-panel/gps/location/update', data),
  getDriverDashboard: () => api.get('/transport-panel/gps/driver/dashboard')
};

// ============ TRIP MANAGEMENT ============
export const tripAPI = {
  getActiveTrip: () => api.get('/transport-panel/trip/active'),
  startTrip: (data) => api.post('/transport-panel/trip/start', data),
  arriveAtStop: (tripId, stopId) => api.post('/transport-panel/trip/arrive', { tripId, stopId }),
  markAttendance: (tripId, stopId, attendanceData) => 
    api.post('/transport-panel/trip/attendance', { tripId, stopId, attendanceData }),
  departStop: (tripId, stopId) => api.post('/transport-panel/trip/depart', { tripId, stopId }),
  endTrip: (tripId) => api.post('/transport-panel/trip/end', { tripId })
};

export default api;
