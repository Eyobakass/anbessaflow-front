import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBuses from './pages/admin/AdminBuses';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminBusStops from './pages/admin/AdminBusStops';
import AdminArrivalLogs from './pages/admin/AdminArrivalLogs';

// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorArrivals from './pages/operator/OperatorArrivals';
import OperatorQueues from './pages/operator/OperatorQueues';

// Passenger Pages
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import PassengerQueue from './pages/passenger/PassengerQueue';
import PassengerWaiting from './pages/passenger/PassengerWaiting';
import PassengerRoutes from './pages/passenger/PassengerRoutes';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="buses" element={<AdminBuses />} />
                <Route path="routes" element={<AdminRoutes />} />
                <Route path="bus-stops" element={<AdminBusStops />} />
                <Route path="arrival-logs" element={<AdminArrivalLogs />} />
              </Route>
            </Route>

            {/* Operator Routes */}
            <Route element={<ProtectedRoute allowedRoles={['OPERATOR']} />}>
              <Route path="/operator" element={<DashboardLayout />}>
                <Route index element={<OperatorDashboard />} />
                <Route path="arrivals" element={<OperatorArrivals />} />
                <Route path="queues" element={<OperatorQueues />} />
              </Route>
            </Route>

            {/* Passenger Routes */}
            <Route element={<ProtectedRoute allowedRoles={['PASSENGER']} />}>
              <Route path="/passenger" element={<DashboardLayout />}>
                <Route index element={<PassengerDashboard />} />
                <Route path="queue" element={<PassengerQueue />} />
                <Route path="waiting" element={<PassengerWaiting />} />
                <Route path="routes" element={<PassengerRoutes />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
