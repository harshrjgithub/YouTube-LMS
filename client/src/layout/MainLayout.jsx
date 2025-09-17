import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import BaseLayout from '@/components/layout/BaseLayout'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Navbar />
      <div className="pt-16"> {/* Account for fixed navbar */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout