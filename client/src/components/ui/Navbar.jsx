import React from 'react';
import { School, LogOut, User, BookOpen, Settings, Search } from 'lucide-react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLogoutMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const Navbar = ({ isAdmin = false }) => {
  const { user, isAuthenticated, logout: authLogout, isAdmin: checkIsAdmin } = useAuth();
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      authLogout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      authLogout();
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 z-50">
      {/* Logo & Title */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleNavigation(isAuthenticated ? (checkIsAdmin() ? '/admin/dashboard' : '/courses') : '/')}
      >
        <School size={26} className="text-purple-600" />
        <h1 className="text-xl font-bold text-gray-800">
          {isAdmin ? 'LMS Admin' : 'LMS'}
        </h1>
      </div>

      {/* Navigation Links */}
      {isAuthenticated && !isAdmin && (
        <div className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/courses')}
            className="text-gray-700 hover:text-purple-600"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/my-courses')}
            className="text-gray-700 hover:text-purple-600"
          >
            My Courses
          </Button>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <Avatar className="w-8 h-8 bg-purple-100 border border-purple-200 rounded-full">
                  <AvatarImage src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=8b5cf6&color=fff`} alt={user.name} />
                  <AvatarFallback className="text-purple-600 text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent className="w-56 bg-white shadow-xl rounded-xl border border-gray-200 z-50 p-2 mr-4">
                <DropdownMenuLabel className="text-gray-700 font-semibold px-2 py-1">
                  {user.name}
                  <div className="text-xs text-gray-500 font-normal">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-gray-200" />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center"
                    onClick={() => handleNavigation('/profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  
                  {checkIsAdmin() ? (
                    <DropdownMenuItem
                      className="p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleNavigation('/admin/dashboard')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleNavigation('/my-courses')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        My Courses
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="p-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleNavigation('/courses')}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Browse Courses
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-2 bg-gray-200" />

                <DropdownMenuItem
                  className="p-2 rounded-md hover:bg-red-100 text-sm text-red-600 cursor-pointer flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('/login')}
              className="text-gray-700 hover:text-purple-600"
            >
              Login
            </Button>
            <Button 
              onClick={() => handleNavigation('/login')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
