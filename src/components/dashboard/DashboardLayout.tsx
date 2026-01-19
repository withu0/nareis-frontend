import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft,
  Bell,
  Search,
  User,
  Briefcase,
  Video,
  MapPin,
  BarChart3,
  FileText,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Analytics', href: '/my-analytics', icon: BarChart3, badge: 'New' },
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'Resources', href: '/resources', icon: BookOpen },
  { title: 'Forums', href: '/forums', icon: MessageSquare },
  { title: 'Videos', href: '/videos', icon: Video },
  { title: 'Member Directory', href: '/member-directory', icon: Users },
  { title: 'Job Board', href: '/jobs', icon: Briefcase },
  { title: 'Certification', href: '/certification', icon: Award },
  { title: 'Advocacy', href: '/advocacy', icon: Target },
  { title: 'Market Reports', href: '/market-reports', icon: FileText },
  { title: 'Find Chapter', href: '/find-local-chapter', icon: MapPin },
  { title: 'Referral Program', href: '/referral-program', icon: TrendingUp },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-emerald-50/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <div className="flex items-center gap-2">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1764193608253_c8f282d9.png" 
              alt="NAREIS" 
              className="h-8"
            />
          </div>

          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 bg-white border-r shadow-sm z-40',
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-500 to-emerald-500">
          {sidebarOpen && (
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1764193608253_c8f282d9.png" 
              alt="NAREIS" 
              className="h-10 w-auto"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                  active 
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', active ? 'text-white' : 'text-gray-500 group-hover:text-teal-600')} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium text-sm truncate">{item.title}</span>
                    {item.badge && (
                      <Badge className={cn(
                        'ml-auto text-xs',
                        active ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
                      )}>
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-3 space-y-1">
          <button
            onClick={() => navigate('/profile')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100',
              isActive('/profile') && 'bg-teal-50 text-teal-700'
            )}
          >
            <User className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Profile</span>}
          </button>
          
          <button
            onClick={() => navigate('/billing')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100',
              isActive('/billing') && 'bg-teal-50 text-teal-700'
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
          </button>

          {sidebarOpen && user && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-3 px-3">
                {user.profilePictureUrl ? (
                  <img 
                    src={user.profilePictureUrl} 
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-500 to-emerald-500">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6849691d0ad29e5fa5584183_1764193608253_c8f282d9.png" 
                alt="NAREIS" 
                className="h-10 w-auto"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      active 
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-gray-500')} />
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.badge && (
                      <Badge className={cn(
                        'ml-auto text-xs',
                        active ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
                      )}>
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile User Section */}
            <div className="border-t p-3 space-y-1">
              <button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span className="font-medium text-sm">Profile</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/billing');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium text-sm">Settings</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={cn(
          'lg:transition-all lg:duration-300',
          'pt-16 lg:pt-0', // Add padding top for mobile header
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
