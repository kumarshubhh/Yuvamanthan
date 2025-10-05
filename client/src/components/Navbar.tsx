import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { 
  Home, 
  Plus, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus,
  MapPin,
  Users,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">CrowdSolve</span>
              <div className="text-xs text-gray-500 font-medium">Community Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="nav-link flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Problems</span>
                </Link>
                <Link
                  to="/create-problem"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Problem</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user?.name}</div>
                      <div className="text-gray-500 text-xs">Community Member</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                      <Bell className="w-5 h-5" />
                    </button>
                    <Link
                      to="/profile"
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                      title="Profile"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-ghost flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-slide-down">
            <div className="space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className="nav-link flex items-center space-x-3 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className="nav-link flex items-center space-x-3 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Problems</span>
                    </Link>
                    <Link
                      to="/create-problem"
                      className="btn-primary flex items-center space-x-3 w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Post Problem</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.name}</div>
                        <div className="text-gray-500 text-sm">Community Member</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to="/profile"
                        className="btn-secondary flex items-center space-x-2 flex-1 justify-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="btn-error flex items-center space-x-2 flex-1 justify-center"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="btn-secondary flex items-center space-x-2 w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary flex items-center space-x-2 w-full justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;