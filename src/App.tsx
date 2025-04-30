import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogCategory from './pages/BlogCategory';
import BlogEditor from './pages/BlogEditor';
import BlogManagement from './pages/BlogManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OnboardingFlow from './pages/OnboardingFlow';

function App() {
  return (
    <ErrorBoundary>
      <SEO />
      <AuthProvider>
        <AdminProvider>
          <DatabaseProvider>
            <NotificationProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/docs" element={<Documentation />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/blog/category/:slug" element={<BlogCategory />} />
                    <Route
                      path="/blog/manage"
                      element={
                        <ProtectedRoute>
                          <BlogManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/blog/new"
                      element={
                        <ProtectedRoute>
                          <BlogEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/blog/edit/:slug"
                      element={
                        <ProtectedRoute>
                          <BlogEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/onboarding/*"
                      element={
                        <ProtectedRoute>
                          <OnboardingFlow />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <Toaster />
              </Router>
            </NotificationProvider>
          </DatabaseProvider>
        </AdminProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <a
                href="/"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Go back home
              </a>
              <a
                href="/contact"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Contact support
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;