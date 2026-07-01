import api from './axiosClient';

// AUTH
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

// ADMIN
export const adminService = {
  // Users
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPendingOperators: () => api.get('/admin/pending-operators'),
  approveOperator: (id) => api.put(`/admin/approve-operator/${id}`),
  rejectOperator: (id) => api.put(`/admin/reject-operator/${id}`),
};

// BUSES
export const busService = {
  getAll: () => api.get('/api/v1/buses'),
  getById: (id) => api.get(`/api/v1/buses/${id}`),
  create: (data) => api.post('/api/v1/buses', data),
  update: (id, data) => api.put(`/api/v1/buses/${id}`, data),
  delete: (id) => api.delete(`/api/v1/buses/${id}`),
};

// ROUTES
export const routeService = {
  getAll: () => api.get('/api/v1/routes'),
  getById: (id) => api.get(`/api/v1/routes/${id}`),
  create: (data) => api.post('/api/v1/routes', data),
  update: (id, data) => api.put(`/api/v1/routes/${id}`, data),
  delete: (id) => api.delete(`/api/v1/routes/${id}`),
};

// BUS STOPS
export const busStopService = {
  getAll: () => api.get('/api/v1/bus-stops'),
  getById: (id) => api.get(`/api/v1/bus-stops/${id}`),
  create: (data) => api.post('/api/v1/bus-stops', data),
  update: (id, data) => api.put(`/api/v1/bus-stops/${id}`, data),
  delete: (id) => api.delete(`/api/v1/bus-stops/${id}`),
};

// QUEUE
export const queueService = {
  getAll: () => api.get('/queue'),
  getById: (id) => api.get(`/queue/${id}`),
  join: (data) => api.post('/queue/join', data),
  updateStatus: (id, status) => api.put(`/queue/${id}/status`, { status }),
  getByStop: (stopId) => api.get(`/queue/stop/${stopId}`),
};

// OPERATOR
export const operatorService = {
  getDashboard: () => api.get('/operator/dashboard'),
  getMyAssignments: () => api.get('/operator/assignments'),
  logArrival: (data) => api.post('/operator/log-arrival', data),
  updateQueue: (queueId, data) => api.put(`/operator/queue/${queueId}`, data),
};

// PASSENGER
export const passengerService = {
  getProfile: () => api.get('/passenger/profile'),
  getMyQueue: () => api.get('/passenger/my-queue'),
};

// ARRIVAL LOGS
export const arrivalLogService = {
  getAll: () => api.get('/api/v1/arrival-logs'),
  getById: (id) => api.get(`/api/v1/arrival-logs/${id}`),
};

// USERS (current user profile)
export const userService = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};
