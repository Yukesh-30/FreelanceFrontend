import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Ancient404 from './ui/ancient404';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FreelancerLayout from './components/layout/FreelancerLayout';
import ClientDashboard from './pages/client/Dashboard';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import FreelancerProfile from './pages/freelancer/Profile'; // we will create this next

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </PrivateRoute>
            }
          />

          {/* Freelancer Routes */}
          <Route
            path="/freelancer/*"
            element={
              <PrivateRoute allowedRoles={['FREELANCER']}>
                <FreelancerLayout>
                  <Routes>
                    <Route path="dashboard" element={<FreelancerDashboard />} />
                    <Route path="profile" element={<FreelancerProfile />} />
                  </Routes>
                </FreelancerLayout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Ancient404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
