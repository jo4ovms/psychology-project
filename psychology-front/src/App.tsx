import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AppThemeProvider } from "./themes/ThemeProvider";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";

import MainLayout from "./components/layout/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/feedback/ErrorBoundary";

import LoginPage from "./pages/auth/LoginPage";

import DashboardPage from "./pages/dashboard/DashboardPage";

import NotFoundPage from "./pages/error/NotFoundPage";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";

const Register = () => <div>Register Page</div>;
const PatientsList = () => <div>Patients List</div>;
const PatientDetails = () => <div>Patient Details</div>;
const PatientForm = () => <div>Patient Form</div>;
const AppointmentsList = () => <div>Appointments List</div>;
const AppointmentForm = () => <div>Appointment Form</div>;
const AppointmentDetails = () => <div>Appointment Details</div>;
const AppointmentCalendar = () => <div>Appointment Calendar</div>;
const ConsultationsList = () => <div>Consultations List</div>;
const ConsultationForm = () => <div>Consultation Form</div>;
const ConsultationDetails = () => <div>Consultation Details</div>;
const ProfilePage = () => <div>User Profile</div>;
const ChangePasswordPage = () => <div>Change Password</div>;

import { UserRole } from "./types/models";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<Register />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />

                  <Route path="/patients" element={<PatientsList />} />
                  <Route path="/patients/new" element={<PatientForm />} />
                  <Route path="/patients/:id" element={<PatientDetails />} />
                  <Route path="/patients/:id/edit" element={<PatientForm />} />

                  <Route path="/appointments" element={<AppointmentsList />} />
                  <Route
                    path="/appointments/new"
                    element={<AppointmentForm />}
                  />
                  <Route
                    path="/appointments/:id"
                    element={<AppointmentDetails />}
                  />
                  <Route
                    path="/appointments/:id/edit"
                    element={<AppointmentForm />}
                  />
                  <Route path="/calendar" element={<AppointmentCalendar />} />

                  <Route
                    path="/consultations"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          UserRole.PROFISSIONAL_SAUDE,
                          UserRole.ADMIN,
                        ]}
                      >
                        <ConsultationsList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations/new"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          UserRole.PROFISSIONAL_SAUDE,
                          UserRole.ADMIN,
                        ]}
                      >
                        <ConsultationForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations/:id"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          UserRole.PROFISSIONAL_SAUDE,
                          UserRole.ADMIN,
                        ]}
                      >
                        <ConsultationDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultations/:id/edit"
                    element={
                      <ProtectedRoute
                        allowedRoles={[
                          UserRole.PROFISSIONAL_SAUDE,
                          UserRole.ADMIN,
                        ]}
                      >
                        <ConsultationForm />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/change-password"
                    element={<ChangePasswordPage />}
                  />

                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Route>

                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AuthProvider>
          </ToastProvider>
        </AppThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
