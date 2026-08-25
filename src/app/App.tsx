import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Help } from './pages/Help';
import { Adoptions } from './pages/Adoptions';
import { AdoptionCategory } from './pages/AdoptionCategory';
import { PetProfile } from './pages/PetProfile';
import { AdoptionRequest } from './pages/AdoptionRequest';
import { Events } from './pages/Events';
import { EventRegistration } from './pages/EventRegistration';
import { CastrationConfirmation } from './pages/CastrationConfirmation';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminEvents } from './pages/admin/Events';
import { AdminAdoptions } from './pages/admin/Adoptions';
import { AdminRegistrations } from './pages/admin/Registrations';
import { AdminProfile } from './pages/admin/Profile';
import { AdminSettings } from './pages/admin/Settings';
import { AdminUsers } from './pages/admin/Users';
import { AdminDonations } from './pages/admin/Donations';
import { AdminTracking } from './pages/admin/Tracking';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/adoptions" element={<Adoptions />} />
          <Route path="/adoptions/:category" element={<AdoptionCategory />} />
          <Route path="/adoptions/pet-profile/:petId" element={<PetProfile />} />
          <Route path="/adoption-request/:petId" element={<AdoptionRequest />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/register/:eventId" element={<EventRegistration />} />
          <Route path="/castration/confirmation" element={<CastrationConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="adoptions" element={<AdminAdoptions />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="tracking" element={<AdminTracking />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
