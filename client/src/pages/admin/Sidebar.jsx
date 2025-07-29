import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen pt-24 bg-gradient-to-b from-[#fefefe] via-[#f2f2f2] to-[#e6e6e6] p-6 border-r border-gray-300 shadow-xl sticky top-0 z-20">
      <div>
        {/* Sidebar Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-purple-700 tracking-wide">Admin Panel 🚀</h1>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-purple-100 ${
              isActive('/admin/dashboard') ? 'bg-purple-200 text-purple-800 font-semibold' : 'text-gray-700'
            }`}
          >
            <ChartNoAxesColumn className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/courses"
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-purple-100 ${
              isActive('/admin/courses') ? 'bg-purple-200 text-purple-800 font-semibold' : 'text-gray-700'
            }`}
          >
            <SquareLibrary className="h-5 w-5" />
            <span>Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
