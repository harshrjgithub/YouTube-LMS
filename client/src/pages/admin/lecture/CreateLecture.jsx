import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateLectureMutation, useGetCourseByIdQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';
import Lecture from './Lecture';

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState('');
  const navigate = useNavigate();
  const { courseId } = useParams();
  console.log('Course ID:', courseId); // Debugging line to check courseId

  const [createLecture, { isLoading }] = useCreateLectureMutation();
  const {
    data: course,
    isLoading: lectureLoading,
    error: lectureError,
    refetch,
  } = useGetCourseByIdQuery(courseId);
  const data2 = useGetCourseByIdQuery(courseId).data.course.lectures;
  console.log('Course Data:', data2); // Debugging line to check course data
  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error('Lecture title is required!');
      return;
    }

    try {
      await createLecture({ courseId, lectureTitle }).unwrap();
      toast.success('Lecture created successfully!');
      setLectureTitle('');
      refetch();
    } catch (err) {
      console.error('Error creating lecture:', err);
      toast.error(err?.data?.message || 'Failed to create lecture.');
    }
  };

  const backToCourseHandler = () => {
    navigate('/admin/courses');
  };

  const handleEdit = (lecture) => {
    console.log('Edit lecture:', lecture);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🎥 Create a New Lecture</h1>
      <p className="text-gray-600 mb-6">Add an engaging lecture to your course content.</p>

      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Lecture Title
        </Label>
        <Input
          type="text"
          placeholder="Enter lecture title"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={backToCourseHandler}
          className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition duration-300"
        >
          ⬅️ Back to Course
        </Button>

        <Button
          onClick={createLectureHandler}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Creating...
            </>
          ) : (
            'Create Lecture'
          )}
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Lectures</h2>

        {data2?.length > 0 ? (
  <div className="space-y-4">
    {data2.map((lecture) => (
      <Lecture key={lecture._id} lecture={lecture} />
    ))}
  </div>
) : (
  <p className="text-gray-500">No lectures added yet.</p>
)}


      </div>
    </div>
  );
};

export default CreateLecture;
