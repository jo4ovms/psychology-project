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
import PatientsListPage from "./pages/patients/PatientsListPage";
import PatientFormPage from "./pages/patients/PatientFormPage";
import PatientDetailsPage from "./pages/patients/PatientDetailsPage";
import AppointmentsListPage from "./pages/appointments/AppointmentsListPage";
import AppointmentFormPage from "./pages/appointments/AppointmentFormPage";
import AppointmentDetailsPage from "./pages/appointments/AppointmentDetailsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ChangePasswordPage from "./pages/profile/ChangePasswordPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";

import { UserRole } from "./types/models";
import RegisterPage from "./pages/auth/RegisterPage";
import ConsultationsListPage from "./pages/consultations/ConsultationsListPage";
import ConsultationFormPage from "./pages/consultations/ConsultationFormPage";
import ConsultationDetailsPage from "./pages/consultations/ConsultationDetailsPage";

const AppointmentCalendar = () => <div>Appointment Calendar</div>;
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />

                  <Route path="/patients" element={<PatientsListPage />} />
                  <Route path="/patients/new" element={<PatientFormPage />} />
                  <Route
                    path="/patients/:id"
                    element={<PatientDetailsPage />}
                  />
                  <Route
                    path="/patients/:id/edit"
                    element={<PatientFormPage />}
                  />

                  <Route
                    path="/appointments"
                    element={<AppointmentsListPage />}
                  />
                  <Route
                    path="/appointments/new"
                    element={<AppointmentFormPage />}
                  />
                  <Route
                    path="/appointments/:id"
                    element={<AppointmentDetailsPage />}
                  />
                  <Route
                    path="/appointments/:id/edit"
                    element={<AppointmentFormPage />}
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
                        <ConsultationsListPage />
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
                        <ConsultationFormPage />
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
                        <ConsultationDetailsPage />
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
                        <ConsultationFormPage />
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
