import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllCoursesQuery, useDeleteCourseMutation, useToggleCoursePublishedMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';
import { 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Search, 
  Filter,
  Plus,
  Eye,
  Calendar,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Globe,
  EyeOff
} from 'lucide-react';

const CourseTable = () => {
  // For admin, we want to see ALL courses, not just published ones
  const { data, isLoading, error, refetch } = useGetAllCoursesQuery({ includeUnpublished: 'true' });
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [togglePublished, { isLoading: isToggling }] = useToggleCoursePublishedMutation();
  const navigate = useNavigate();
  
  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Get unique categories and levels for filters
  const { categories, levels } = useMemo(() => {
    if (!data?.courses) return { categories: [], levels: [] };
    
    const cats = [...new Set(data.courses.map(course => course.category).filter(Boolean))];
    const lvls = [...new Set(data.courses.map(course => course.courseLable).filter(Boolean))];
    
    return { categories: cats, levels: lvls };
  }, [data?.courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    if (!data?.courses) return [];
    
    let filtered = data.courses.filter(course => {
      const matchesSearch = course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesLevel = levelFilter === 'all' || course.courseLable === levelFilter;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.courseTitle.localeCompare(b.courseTitle);
        case 'enrollments':
          return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
        case 'lectures':
          return (b.lectures?.length || 0) - (a.lectures?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data?.courses, searchTerm, categoryFilter, levelFilter, sortBy]);

  const handleDeleteCourse = async (courseId, courseTitle) => {
    try {
      const result = await deleteCourse(courseId).unwrap();
      
      if (result.success) {
        toast.success(`Course "${courseTitle}" deleted successfully`);
        if (result.deletedCourse?.deletedLecturesCount > 0) {
          toast.info(`Also deleted ${result.deletedCourse.deletedLecturesCount} associated lectures`);
        }
      } else {
        toast.error(result.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      
      // Handle specific error cases
      if (err.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else if (err.status === 403) {
        toast.error('Access denied. You need admin privileges to delete courses.');
      } else if (err.status === 404) {
        toast.error('Course not found. It may have already been deleted.');
      } else {
        toast.error(err?.data?.message || 'Failed to delete course. Please try again.');
      }
    }
  };

  const handleTogglePublished = async (courseId, courseTitle, currentStatus) => {
    try {
      const result = await togglePublished({ 
        id: courseId, 
        isPublished: !currentStatus 
      }).unwrap();
      
      if (result.success) {
        const newStatus = !currentStatus;
        toast.success(`Course "${courseTitle}" ${newStatus ? 'published' : 'unpublished'} successfully`);
        refetch(); // Refresh the course list
      } else {
        toast.error(result.message || 'Failed to update course status');
      }
    } catch (err) {
      console.error('Error toggling course status:', err);
      toast.error(err?.data?.message || 'Failed to update course status');
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen text-xl font-semibold text-gray-500'>
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen text-red-500 text-lg'>
        Error fetching courses. Try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Course Management</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedCourses.length} of {data?.courses?.length || 0} courses
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            onClick={() => navigate('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Level Filter */}
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map(level => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="enrollments">Most Enrolled</SelectItem>
              <SelectItem value="lectures">Most Lectures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[300px] text-gray-700 font-semibold">Course Details</TableHead>
                <TableHead className="text-gray-700 font-semibold">Category</TableHead>
                <TableHead className="text-gray-700 font-semibold">Level</TableHead>
                <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                <TableHead className="text-gray-700 font-semibold">Stats</TableHead>
                <TableHead className="text-gray-700 font-semibold">Created</TableHead>
                <TableHead className="w-[250px] text-right text-gray-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCourses.length > 0 ? (
                filteredAndSortedCourses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {course.courseTitle}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {course.courseDescription || 'No description available'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {course.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {course.courseLable}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {course.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Globe className="w-3 h-3 mr-1" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Draft
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {course.lectures?.length || 0} lectures
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {course.enrolledStudents?.length || 0} enrolled
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-blue-100 text-blue-600"
                          onClick={() => navigate(`${course._id}`)}
                          title="Edit Course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-100 text-green-600"
                          onClick={() => navigate(`${course._id}/lectures`)}
                          title="Manage Lectures"
                        >
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${course.isPublished 
                            ? 'hover:bg-purple-100 text-purple-600' 
                            : 'hover:bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => course.isPublished && window.open(`/course/${course._id}`, '_blank')}
                          title={course.isPublished ? "Preview Course" : "Course not published"}
                          disabled={!course.isPublished}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${course.isPublished 
                            ? 'hover:bg-orange-100 text-orange-600' 
                            : 'hover:bg-green-100 text-green-600'
                          }`}
                          onClick={() => handleTogglePublished(course._id, course.courseTitle, course.isPublished)}
                          title={course.isPublished ? "Unpublish Course" : "Publish Course"}
                          disabled={isToggling}
                        >
                          {course.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Globe className="h-4 w-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-100 text-red-600"
                              title="Delete Course"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Course</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{course.courseTitle}"? 
                                This action cannot be undone and will also delete all associated lectures.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course._id, course.courseTitle)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isDeleting}
                              >
                                {isDeleting ? 'Deleting...' : 'Delete Course'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="w-12 h-12 text-gray-300" />
                      <div>
                        <p className="text-gray-500 font-medium">No courses found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Create your first course to get started'
                          }
                        </p>
                      </div>
                      {!searchTerm && categoryFilter === 'all' && levelFilter === 'all' && (
                        <Button 
                          onClick={() => navigate('create')}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Course
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      {filteredAndSortedCourses.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredAndSortedCourses.length} course{filteredAndSortedCourses.length !== 1 ? 's' : ''}
          {(searchTerm || categoryFilter !== 'all' || levelFilter !== 'all') && 
            ` (filtered from ${data?.courses?.length || 0} total)`
          }
        </div>
      )}
    </div>
  );
};

export default CourseTable;
