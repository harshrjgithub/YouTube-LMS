import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/pages/admin/Sidebar'


const AdminLayout = () => {
    return (
      <div>
        {/* Navbar for Admin */}
        <Navbar isAdmin={true} />
        <div className="flex">
          <Sidebar />
          <div className="flex-grow p-4">
            <Outlet /> {/* This will render the child routes */}
          </div>
        </div>
      </div>
    );
  };

export default AdminLayout;