// Import necessary libraries and components
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEnrollInCourseMutation, useGetUserProfileQuery } from "@/features/api/authApi";
import { toast } from "sonner";
import React, { useState, useMemo } from "react";

const CoursesList = ({ course }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [enrollInCourse, { isLoading: isEnrolling }] = useEnrollInCourseMutation();
  const { data: profileData, refetch: refetchProfile } = useGetUserProfileQuery();

  // Early return if course data is invalid
  if (!course || !course._id) {
    console.warn('CoursesList: Invalid course data received', course);
    return null;
  }
  
  // Check if user is already enrolled
  const isEnrolled = React.useMemo(() => {
    if (!profileData?.user?.enrolledCourses || !course?._id) {
      return false;
    }

    return profileData.user.enrolledCourses.some(enrollment => {
      // Handle null/undefined enrollment or course
      if (!enrollment || !enrollment.course) {
        console.warn('CoursesList: Found enrollment with null course reference', enrollment);
        return false;
      }
      
      // Handle both populated and non-populated course references
      const courseId = typeof enrollment.course === 'object' 
        ? enrollment.course._id 
        : enrollment.course;
      
      if (!courseId) {
        console.warn('CoursesList: Found enrollment with invalid course ID', enrollment);
        return false;
      }
      
      return courseId === course._id;
    });
  }, [profileData?.user?.enrolledCourses, course?._id]);
  
  // Generate a placeholder image based on course category
  const getPlaceholderImage = (category) => {
    const colors = {
      'programming': 'from-blue-400 to-blue-600',
      'design': 'from-purple-400 to-purple-600',
      'business': 'from-green-400 to-green-600',
      'marketing': 'from-orange-400 to-orange-600',
      'default': 'from-gray-400 to-gray-600'
    };
    
    const colorClass = colors[category?.toLowerCase()] || colors.default;
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
        <BookOpen className="w-16 h-16 text-white opacity-80" />
      </div>
    );
  };

  const handleEnrollClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    if (!course?._id) {
      toast.error('Invalid course data');
      return;
    }

    if (isEnrolled) {
      // If already enrolled, navigate to course
      navigate(`/course/${course._id}`);
      return;
    }

    try {
      await enrollInCourse(course._id).unwrap();
      toast.success(`Successfully enrolled in ${course.courseTitle}!`);
      refetchProfile(); // Refresh user profile to update enrollment status
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error?.data?.message || 'Failed to enroll in course');
    }
  };

  const handleViewCourse = () => {
    navigate(`/course/${course._id}`);
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-[350px] bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 overflow-hidden">
        {/* Course Image */}
        <div className="relative w-full h-44">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.courseTitle}
              className="w-full h-full object-cover rounded-t-2xl"
            />
          ) : (
            getPlaceholderImage(course.category)
          )}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {course.courseLable || "Beginner"}
          </div>
          {course.lectures && course.lectures.length > 0 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <BookOpen className="w-3 h-3 mr-1" />
              {course.lectures.length}
            </div>
          )}
        </div>

        {/* Course Details */}
        <CardContent className="p-5 text-gray-800">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{course.courseTitle}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {course.courseDescription || 'No description available'}
          </p>

          {/* Course Stats */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {course.category}
            </span>
            {course.enrolledStudents && (
              <span className="text-xs text-gray-500 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {course.enrolledStudents.length} enrolled
              </span>
            )}
          </div>

          {/* Instructor Info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={course.creator?.photoURL || `https://ui-avatars.com/api/?name=${course.creator?.name || 'Instructor'}&background=6366f1&color=fff`} 
                alt={course.creator?.name || 'Instructor'} 
              />
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {course.creator?.name || 'Anonymous Instructor'}
              </p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isEnrolled ? (
              <div className="space-y-2">
                <Button
                  onClick={handleViewCourse}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <p className="text-xs text-center text-green-600 font-medium">
                  ✓ Enrolled
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Enroll Now
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleViewCourse}
                  variant="outline"
                  className="w-full text-sm"
                >
                  View Details
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesList;
