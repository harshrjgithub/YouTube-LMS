import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='mt-20 px-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className='relative p-6 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.05] hover:rotate-[0.5deg]'>
        <h2 className='text-2xl font-bold mb-2 drop-shadow-md tracking-wide'>📚 Total Courses</h2>
        <CardHeader className='p-0'>
          <CardTitle className='text-white/90 text-sm font-light'>
            Total number of courses available
          </CardTitle>
        </CardHeader>
        <div className='absolute top-2 right-2 text-sm bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm shadow-sm'>
          120+
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
