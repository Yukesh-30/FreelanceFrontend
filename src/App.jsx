import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Ancient404 from './ui/ancient404';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FreelancerLayout from './components/layout/FreelancerLayout';
import ClientLayout from './components/layout/ClientLayout';
import ClientDashboard from './pages/client/Dashboard';
import CreateJob from './pages/client/CreateJob';
import MyJobs from './pages/client/MyJobs';
import ClientProfile from './pages/client/ClientProfile';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import FreelancerProfile from './pages/freelancer/Profile';
import CreateGig from './pages/freelancer/CreateGig';
import GigDetails from './pages/freelancer/GigDetails';

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
            path="/client/*"
            element={
              <PrivateRoute allowedRoles={['CLIENT']}>
                <ClientLayout>
                  <Routes>
                    <Route path="dashboard" element={<ClientDashboard />} />
                    <Route path="jobs/create" element={<CreateJob />} />
                    <Route path="jobs" element={<MyJobs />} />
                    <Route path="profile" element={<ClientProfile />} />
                  </Routes>
                </ClientLayout>
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
                    <Route path="gigs/create" element={<CreateGig />} />
                    <Route path="gigs/:id" element={<GigDetails />} />
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
