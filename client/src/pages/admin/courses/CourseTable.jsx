import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllCoursesQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

const CourseTable = () => {
  const { data, isLoading, error } = useGetAllCoursesQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      console.log("Fetched courses:", data);
      console.log(data)
    }
  }, [data]);

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
    <div className="p-6 pt-24 max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-4 py-2 rounded-md"
        onClick={() => navigate('create')}
      >
        + Create New Course
      </Button>
    </div>

      <div className="rounded-lg overflow-x-auto border border-gray-200 shadow-sm">
        <Table>
          <TableCaption className="text-sm text-gray-500 mt-2">
            A list of all your courses.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[220px] text-gray-700">Title</TableHead>
              <TableHead className="text-gray-700">Level</TableHead>
              <TableHead className="text-gray-700">Category</TableHead>
              <TableHead className="text-right text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.courses?.map((course) => (
              <TableRow
                key={course._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <TableCell className="font-medium">{course.courseTitle}</TableCell>
                <TableCell>{course.courseLable}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-100 text-blue-600 border-blue-300"
                    onClick={() => {
                      navigate(`${course._id}`);
                      toast.success("Ready to edit 🚀");
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
