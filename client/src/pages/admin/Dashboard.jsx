import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGetAnalyticsQuery } from '@/features/api/courseApi'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  PlayCircle, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery()
  const navigate = useNavigate()
  
  const analytics = analyticsData?.analytics

  if (isLoading) {
    return (
      <div className="mt-20 px-4">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-20 px-4 text-center">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your LMS platform</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/admin/courses/create')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/courses')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Manage Courses
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="relative p-6 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold mt-1">{analytics?.overview?.totalCourses || 0}</p>
            </div>
            <BookOpen className="w-8 h-8 text-white/80" />
          </div>
          <div className="mt-4 text-xs text-white/70">
            📈 {analytics?.overview?.recentCourses || 0} added this month
          </div>
        </Card>

        <Card className="relative p-6 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm font-medium">Total Lectures</p>
              <p className="text-3xl font-bold mt-1">{analytics?.overview?.totalLectures || 0}</p>
            </div>
            <PlayCircle className="w-8 h-8 text-white/80" />
          </div>
          <div className="mt-4 text-xs text-white/70">
            📊 Avg {analytics?.overview?.avgLecturesPerCourse || 0} per course
          </div>
        </Card>

        <Card className="relative p-6 bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 text-white shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm font-medium">Total Enrollments</p>
              <p className="text-3xl font-bold mt-1">{analytics?.overview?.totalEnrollments || 0}</p>
            </div>
            <Users className="w-8 h-8 text-white/80" />
          </div>
          <div className="mt-4 text-xs text-white/70">
            👥 Across all courses
          </div>
        </Card>

        <Card className="relative p-6 bg-gradient-to-br from-orange-600 via-red-500 to-pink-400 text-white shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm font-medium">Categories</p>
              <p className="text-3xl font-bold mt-1">{analytics?.coursesByCategory?.length || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-white/80" />
          </div>
          <div className="mt-4 text-xs text-white/70">
            🎯 Course categories
          </div>
        </Card>
      </div>

      {/* Popular Courses & Categories */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Popular Courses */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Most Popular Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analytics?.popularCourses?.length > 0 ? (
              <div className="space-y-3">
                {analytics.popularCourses.map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-[200px]">
                          {course.courseTitle}
                        </p>
                        <p className="text-xs text-gray-500">{course.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        {course.enrollmentCount} enrolled
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.lectureCount} lectures
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No courses available</p>
            )}
          </CardContent>
        </Card>

        {/* Categories Distribution */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Courses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analytics?.coursesByCategory?.length > 0 ? (
              <div className="space-y-3">
                {analytics.coursesByCategory.map((category, index) => (
                  <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <span className="font-medium text-gray-800 capitalize">
                        {category._id || 'Uncategorized'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {category.count} courses
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No categories available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/courses/create')}
            >
              <Plus className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Create Course</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/admin/courses')}
            >
              <BookOpen className="w-6 h-6 text-green-600" />
              <span className="text-sm">Manage Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.open('/', '_blank')}
            >
              <Eye className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Preview Site</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Refresh Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
