import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateCourseMutation } from '@/features/api/courseApi';

const AddCourses = () => {
  const [courseTitle, setCourseTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [createCourse,{data, isLoading , error, isSuccess}] = useCreateCourseMutation();

  const navigate = useNavigate();
  // const isLoading = false; // Simulating loading state


  const createCourseHandler = async () => {
    try {
        console.log("Payload:", { courseTitle, category, level, description });
        await createCourse({ courseTitle, category, level, description });
        console.log("Course Created:", { courseTitle, category, level, description });
    } catch (err) {
        console.error("Error creating course:", err);
        toast.error(err?.data?.message || "Failed to create course.");
    }
};

// for displaying toasts
React.useEffect(() => {
  if (isSuccess) {
    toast.success(data?.message || 'Course created successfully!');
    navigate('/admin/courses'); // Navigate to the courses page after successful creation
  }
}, [isSuccess, data]); // Fixed dependency array placement

const selectedCategoryHandler = (value) => {
  setCategory(value);
  console.log('Selected Category:', value);
};

const selectedLevelHandler = (value) => {
  setLevel(value);
  console.log('Selected Level:', value);
};

  return (
    <div className="flex flex-col items-start justify-start p-10 max-w-4xl mx-auto relative z-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Add New Course</h1>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details below to add a new course to the platform.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full">
        {/* Course Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Title
          </label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        {/* Course Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Description
          </label>
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Course Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Image
          </label>
          <input
            type="file"
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Level
          </label>
          <Select value={level} onValueChange={selectedLevelHandler}>
            <SelectTrigger className="flex items-center justify-between border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-50">
              <SelectItem value="beginner" className="p-2 hover:bg-gray-100">
                Beginner
              </SelectItem>
              <SelectItem value="intermediate" className="p-2 hover:bg-gray-100">
                Intermediate
              </SelectItem>
              <SelectItem value="advanced" className="p-2 hover:bg-gray-100">
                Advanced
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Course Category
          </label>
          <Select value={category} onValueChange={selectedCategoryHandler}>
            <SelectTrigger className="flex items-center justify-between border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto z-50">
              <SelectItem value="programming" className="p-2 hover:bg-gray-100">
                Programming
              </SelectItem>
              <SelectItem value="design" className="p-2 hover:bg-gray-100">
                Design
              </SelectItem>
              <SelectItem value="marketing" className="p-2 hover:bg-gray-100">
                Marketing
              </SelectItem>
              <SelectItem value="business" className="p-2 hover:bg-gray-100">
                Business
              </SelectItem>
              <SelectItem value="data-science" className="p-2 hover:bg-gray-100">
                Data Science
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={isLoading}
            onClick={createCourseHandler}
            className="bg-blue-500 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-600 transition duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourses;
