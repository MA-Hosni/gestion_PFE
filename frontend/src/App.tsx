import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LayoutPage from "./pages/main/LayoutPage"
import ProjectsPage from "./pages/main/Projects/ProjectsPage"
import LoginPage from "./pages/sign-in/LoginPage"
import SignUpPage from "./pages/sign-up/SignUpPage"
import ForgetPasswordPage from "./pages/sign-in/ForgetPasswordPage"
import ResetPasswordPage from "./pages/sign-in/ResetPasswordPage"
import VerifyEmailPage from "./pages/sign-up/VerifyEmailPage"
import ErrorPage from "./pages/ErrorPage"
import ProjectDetailsPage from "./pages/main/Projects/ProjectDetailsPage"
import RequireAuth from "./components/auth/RequireAuth"
import RequireGuest from "./components/auth/RequireGuest"
import { AuthProvider } from "./context/auth-context"

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />

          {/* Main Application Layout */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<LayoutPage />}>
              <Route path="projects">
                <Route index element={<ProjectsPage />} />
                <Route
                  path=":projectId"
                  element={<ProjectDetailsPage />}
                />
              </Route>
            </Route>
          </Route>

          {/* Authentication Routes */}
          <Route element={<RequireGuest />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />
            <Route path="/api/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/api/auth/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* Error Route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
