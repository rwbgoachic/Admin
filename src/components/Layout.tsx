import { type PropsWithChildren } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { TouchFriendlyButton } from './shared/TouchFriendlyButton';
import { Chatbot } from './admin/Chatbot';
import { LanguageSwitcher } from './admin/LanguageSwitcher';
import { useAuthStore } from '../lib/store';

export function Layout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  Paysurity Admin
                </span>
              </Link>

              <div className="hidden sm:flex sm:space-x-4 sm:ml-6">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/') 
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/admin')
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  System Monitor
                </Link>
                <Link
                  to="/admin/test"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/admin/test')
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Test Area
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <TouchFriendlyButton
                variant="secondary"
                onClick={handleSignOut}
                className="inline-flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </TouchFriendlyButton>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}