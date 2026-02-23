import React, { useState } from 'react';
import { Menu, X, LogOut, User as UserIcon, ChevronDown, Settings, LayoutDashboard, Shield } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/notifications/NotificationBell';
import { getFileUrl } from '@/lib/api';

const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadNotifications] = useState(3); // Mock unread count
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();


  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setMobileResourcesOpen(false);
  };

  const resourcePages = ['/advocacy', '/member-directory', '/resources', '/market-reports', '/news', '/jobs', '/forums', '/videos', '/referral-program', '/chapter-leaderboard', '/certification'];



  const isResourcesActive = resourcePages.includes(location.pathname);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button 
            onClick={() => navigateToPage('/')}
            className="flex items-center group"
          >
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1764193608253_c8f282d9.png" 
              alt="The National Association of Real Estate Investors & Service Partners" 
              className="h-16 w-auto"
            />



          </button>



          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink onClick={() => navigateToPage('/')} active={location.pathname === '/'}>Home</NavLink>
            <NavLink onClick={() => navigateToPage('/about')} active={location.pathname === '/about'}>About Us</NavLink>
            
            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isResourcesActive 
                    ? 'text-blue-900 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                Resources <ChevronDown className="w-4 h-4" />
              </button>
              
              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  <DropdownLink onClick={() => navigateToPage('/certification')}>E.P.I.C.™ Certification Program</DropdownLink>
                  <div className="border-t border-gray-100 my-1"></div>
                  <DropdownLink onClick={() => navigateToPage('/advocacy')}>Advocacy</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/member-directory')}>Member Directory</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/resources')}>Resource Library</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/news')}>Latest News & Insights</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/market-reports')}>Market Reports</DropdownLink>

                  <DropdownLink onClick={() => navigateToPage('/jobs')}>Job Board</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/forums')}>Discussion Forums</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/videos')}>Video Library</DropdownLink>

                  <div className="border-t border-gray-100 my-1"></div>
                  <DropdownLink onClick={() => navigateToPage('/referral-program')}>Referral Program</DropdownLink>
                  <DropdownLink onClick={() => navigateToPage('/chapter-leaderboard')}>Chapter Leaderboard</DropdownLink>

                </div>
              )}
            </div>




            <NavLink onClick={() => navigateToPage('/events')} active={location.pathname === '/events'}>Events</NavLink>
            <NavLink onClick={() => navigateToPage('/contact')} active={location.pathname === '/contact'}>Contact</NavLink>

          </div>



          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* <NotificationBell unreadCount={unreadNotifications} />

                <button 
                  onClick={() => navigateToPage('/messages')} 
                  className="text-gray-700 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  Messages
                </button> */}

                {/* User Profile Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    {/* User Avatar */}
                    {user.profilePictureUrl ? (
                      <img 
                        src={getFileUrl(user.profilePictureUrl)} 
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* User Name */}
                    <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 pt-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => navigateToPage('/dashboard')}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      
                      {isAdmin && (
                        <button
                          onClick={() => navigateToPage('/admin')}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Admin button - discreet access to admin panel */}
                <button 
                  onClick={() => navigateToPage('/admin')} 
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  title="Admin Panel"
                >
                  <Settings className="w-4 h-4" />
                </button>


                <button 
                  onClick={() => navigateToPage('/login')} 
                  className="text-gray-700 hover:text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigateToPage('/signup')} 
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Join Now
                </button>
                <button 
                  onClick={() => navigateToPage('/advertiser/signup')} 
                  className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-medium border border-blue-600"
                >
                  Advertise With Us
                </button>


              </>
            )}
          </div>

          {/* Mobile Menu Button - Touch-friendly 44x44px minimum */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 p-3 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <MobileNavLink onClick={() => navigateToPage('/')}>Home</MobileNavLink>
            <MobileNavLink onClick={() => navigateToPage('/about')}>About Us</MobileNavLink>
            
            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="flex items-center justify-between w-full text-left py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg font-medium transition-colors"
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileResourcesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <MobileNavLink onClick={() => navigateToPage('/certification')}>E.P.I.C.™ Certification Program</MobileNavLink>


                  <div className="border-t border-gray-200 my-2"></div>
                  <MobileNavLink onClick={() => navigateToPage('/advocacy')}>Advocacy</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/member-directory')}>Member Directory</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/resources')}>Resource Library</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/news')}>Latest News & Insights</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/market-reports')}>Market Reports</MobileNavLink>

                  <MobileNavLink onClick={() => navigateToPage('/jobs')}>Job Board</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/forums')}>Discussion Forums</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/videos')}>Video Library</MobileNavLink>

                  <div className="border-t border-gray-200 my-2"></div>
                  <MobileNavLink onClick={() => navigateToPage('/referral-program')}>Referral Program</MobileNavLink>
                  <MobileNavLink onClick={() => navigateToPage('/chapter-leaderboard')}>Chapter Leaderboard</MobileNavLink>

                </div>
              )}

            </div>


            <MobileNavLink onClick={() => navigateToPage('/events')}>Events</MobileNavLink>
            <MobileNavLink onClick={() => navigateToPage('/contact')}>Contact</MobileNavLink>


            {user ? (
              <>
                {/* User Profile Section in Mobile */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {/* User Avatar */}
                    {user.profilePictureUrl ? (
                      <img 
                        src={getFileUrl(user.profilePictureUrl)} 
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                <MobileNavLink onClick={() => navigateToPage('/messages')}>Messages</MobileNavLink>
                <MobileNavLink onClick={() => navigateToPage('/dashboard')}>
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </div>
                </MobileNavLink>
                
                {isAdmin && (
                  <MobileNavLink onClick={() => navigateToPage('/admin')}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </div>
                  </MobileNavLink>
                )}

                <MobileNavLink onClick={() => navigateToPage('/profile')}>Profile</MobileNavLink>

                <button 
                  onClick={handleSignOut} 
                  className="flex items-center gap-2 w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigateToPage('/signup')} 
                className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 shadow-md mt-2"
              >
                Join Now
              </button>

            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink: React.FC<{ onClick: () => void; active?: boolean; children: React.ReactNode }> = ({ onClick, active, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'text-blue-900 bg-blue-50' 
        : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
    }`}
  >
    {children}
  </button>
);

const DropdownLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
  >
    {children}
  </button>
);

const MobileNavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full text-left py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg font-medium transition-colors"
  >
    {children}
  </button>
);

export { Navigation };
export default Navigation;
