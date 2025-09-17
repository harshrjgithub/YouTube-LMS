import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetEnrolledCoursesQuery } from '@/features/api/authApi';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const MyCourses = () => {
  const navigate = useNavigate();
  const { data: enrolledData, isLoading, error, refetch } = useGetEnrolledCoursesQuery();

  const enrolledCourses = enrolledData?.enrolledCourses || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getProgressText = (percentage) => {
    if (percentage === 0) return 'Not started';
    if (percentage === 100) return 'Completed';
    return 'In progress';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">Error loading your courses</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            Track your progress and continue learning
          </p>
        </div>

        {/* Stats Overview */}
        {enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {enrolledCourses.length}
                    </p>
                    <p className="text-sm text-gray-600">Enrolled Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {enrolledCourses.filter(course => course.progress.progressPercentage === 100).length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        enrolledCourses.reduce((acc, course) => acc + course.progress.progressPercentage, 0) / 
                        enrolledCourses.length
                      ) || 0}%
                    </p>
                    <p className="text-sm text-gray-600">Average Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Courses Grid */}
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((enrollment) => {
              const course = enrollment.course;
              const progress = enrollment.progress;
              
              return (
                <Card key={course._id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {course.courseTitle}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {course.category}
                          </span>
                          <span className="capitalize">{course.courseLable}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm text-gray-600">
                          {progress.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.progressPercentage)}`}
                          style={{ width: `${progress.progressPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getProgressText(progress.progressPercentage)}
                      </p>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        <span>{progress.totalLectures || course.lectures?.length || 0} lectures</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>{progress.completedLectures || 0} completed</span>
                      </div>
                    </div>

                    {/* Enrollment Date */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
                    </div>

                    {/* Last Accessed */}
                    {progress.lastAccessedAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Last accessed {formatDate(progress.lastAccessedAt)}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {progress.progressPercentage === 0 ? 'Start Learning' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start your learning journey by exploring and enrolling in courses that interest you.
            </p>
            <Button
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;