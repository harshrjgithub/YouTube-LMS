import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/pages/admin/Sidebar'

const AdminLayout = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Navbar for Admin */}
        <Navbar isAdmin={true} />
        
        <div className="flex pt-16"> {/* Account for fixed navbar */}
          <Sidebar />
          
          {/* Main Content Area with consistent padding */}
          <div className="flex-1 min-h-screen">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AdminLayout;