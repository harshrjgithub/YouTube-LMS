import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUpdateCourseMutation, useGetCourseByIdQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseByIdQuery(courseId);
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const [formData, setFormData] = useState({
    courseTitle: '',
    description: '',
    category: '',
    level: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        courseTitle: data.courseTitle,
        description: data.courseDescription,
        category: data.category,
        level: data.courseLable, // Already in lowercase from backend
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse({ id: courseId, ...formData }).unwrap();
      toast.success('Course updated successfully!');
      navigate('/admin/courses');
    } catch (err) {
      toast.error('Failed to update course');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
        <span className="ml-2">Loading course...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Edit Course</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Course Title</label>
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="e.g. Intro to Web Dev"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Write a short summary about the course..."
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Programming, Design"
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 rounded-xl transition-all duration-300"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Saving...
            </span>
          ) : (
            'Save Changes 🚀'
          )}
        </button>

        <div className="mt-6 text-center">
          <Button
            type="button"
            onClick={() => navigate(`/admin/courses/${courseId}/lectures`)}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300"
          >
            🎥 Go to Lectures
          </Button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/admin/courses')}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-gray-600 border border-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Back to Courses
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
