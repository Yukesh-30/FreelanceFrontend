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
import JobApplications from './pages/client/JobApplications';
import ClientProfile from './pages/client/ClientProfile';
import SearchFreelancers from './pages/client/SearchFreelancers';
import ClientGigDetails from './pages/client/ClientGigDetails';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import FreelancerProfile from './pages/freelancer/Profile';
import CreateGig from './pages/freelancer/CreateGig';
import GigDetails from './pages/freelancer/GigDetails';
import SearchProject from './pages/freelancer/SearchProject';
import JobDetails from './pages/freelancer/JobDetails';
import AppliedJobs from './pages/freelancer/AppliedJobs';
import CurrentProjects from './pages/freelancer/CurrentProjects';
import GigOrders from './pages/freelancer/GigOrders';
import ClientCurrentProjects from './pages/client/ClientCurrentProjects';
import ProjectDetails from './pages/shared/ProjectDetails';
import ChatPage from './pages/shared/ChatPage';

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
                    <Route path="jobs/:id/applications" element={<JobApplications />} />
                    <Route path="profile" element={<ClientProfile />} />
                    <Route path="search-freelancers" element={<SearchFreelancers />} />
                    <Route path="gigs/:id" element={<ClientGigDetails />} />
                    <Route path="current-projects" element={<ClientCurrentProjects />} />
                    <Route path="projects/:id" element={<ProjectDetails />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="chat/:contractId" element={<ChatPage />} />
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
                    <Route path="search-project" element={<SearchProject />} />
                    <Route path="jobs/:id" element={<JobDetails />} />
                    <Route path="applications" element={<AppliedJobs />} />
                    <Route path="current-projects" element={<CurrentProjects />} />
                    <Route path="orders" element={<GigOrders />} />
                    <Route path="projects/:id" element={<ProjectDetails />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="chat/:contractId" element={<ChatPage />} />
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
