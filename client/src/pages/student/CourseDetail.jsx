import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseByIdQuery, useGetLecturesQuery } from '@/features/api/courseApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, Play, Users } from 'lucide-react';
import LecturePlayer from './LecturePlayer';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState(null);
  
  const { data: courseData, isLoading: courseLoading, error: courseError } = useGetCourseByIdQuery(courseId);
  const { data: lecturesData, isLoading: lecturesLoading, error: lecturesError } = useGetLecturesQuery(courseId);
  
  const course = courseData?.course;
  const lectures = lecturesData?.lectures || [];

  // Auto-select first lecture when lectures load
  React.useEffect(() => {
    if (lectures.length > 0 && !selectedLecture) {
      setSelectedLecture(lectures[0]);
    }
  }, [lectures, selectedLecture]);

  if (courseLoading || lecturesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F9] via-[#E5D1FA] to-[#FCE2FF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (courseError || lecturesError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F9] via-[#E5D1FA] to-[#FCE2FF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {courseError?.status === 404 ? 'Course not found or not published' : 'Error loading course'}
          </p>
          <Button onClick={() => navigate('/courses')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  // Check if course is published (for student access)
  if (!course.isPublished && !window.location.pathname.includes('/admin/')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF0F9] via-[#E5D1FA] to-[#FCE2FF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-orange-500 text-lg mb-4">This course is not yet published</p>
          <Button onClick={() => navigate('/courses')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F9] via-[#E5D1FA] to-[#FCE2FF]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/courses')} 
                variant="ghost" 
                size="sm"
                className="hover:bg-white/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{course.courseTitle}</h1>
                <p className="text-sm text-gray-600">{course.category} • {course.courseLable}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {lectures.length} lectures
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {course.enrolledStudents?.length || 0} enrolled
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            {selectedLecture ? (
              <LecturePlayer lecture={selectedLecture} courseId={courseId} />
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 text-center border border-white/30">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to {course.courseTitle}</h3>
                <p className="text-gray-600 mb-4">{course.courseDescription}</p>
                {lectures.length > 0 ? (
                  <p className="text-gray-500">Select a lecture from the playlist to start learning</p>
                ) : (
                  <p className="text-gray-500">No lectures available yet</p>
                )}
              </div>
            )}
          </div>

          {/* Lectures Playlist */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden">
              <div className="p-6 border-b border-white/30">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Content
                </h2>
                <p className="text-sm text-gray-600 mt-1">{lectures.length} lectures</p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {lectures.length > 0 ? (
                  <div className="space-y-1">
                    {lectures.map((lecture, index) => (
                      <div
                        key={lecture._id}
                        onClick={() => setSelectedLecture(lecture)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-white/50 border-b border-white/20 last:border-b-0 ${
                          selectedLecture?._id === lecture._id ? 'bg-purple-100/50 border-l-4 border-l-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                              selectedLecture?._id === lecture._id 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {selectedLecture?._id === lecture._id ? (
                                <Play className="w-3 h-3" />
                              ) : (
                                index + 1
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm line-clamp-2">
                              {lecture.lectureTitle}
                            </h4>
                            {lecture.lectureDescription && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {lecture.lectureDescription}
                              </p>
                            )}
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Video</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No lectures available</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later for course content</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;