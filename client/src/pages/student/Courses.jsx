import React from 'react';
import CoursesList from './CoursesList.jsx';

const courses = [
  {
    id: 1,
    title: 'React for Beginners',
    description: 'Learn the basics of React and build your first web application.',
    imageUrl: 'https://via.placeholder.com/150',
    instructorName: 'Alice Johnson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master JavaScript with advanced concepts and techniques.',
    imageUrl: 'https://via.placeholder.com/150',
    instructorName: 'Bob Smith',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    title: 'Full-Stack Development',
    description: 'Become a full-stack developer by learning both frontend and backend.',
    imageUrl: 'https://via.placeholder.com/150',
    instructorName: 'Charlie Brown',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    id: 4,
    title: 'Data Structures and Algorithms',
    description: 'Learn DSA to crack coding interviews and improve problem-solving skills.',
    imageUrl: 'https://via.placeholder.com/150',
    instructorName: 'Diana Prince',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    description: 'Understand the fundamentals of UI/UX design and create stunning interfaces.',
    imageUrl: 'https://via.placeholder.com/150',
    instructorName: 'Eve Adams',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
];

const Courses = () => {
  const isLoading = false;

  return (
    <div className="bg-gradient-to-br from-[#FFF0F9] via-[#E5D1FA] to-[#FCE2FF] py-24 px-6 text-center min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">✨ Our Courses</h1>
        <p className="text-gray-600 mb-10">Choose from handpicked gems to elevate your skillset</p>

        {isLoading ? (
          <Courseskeleton />
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CoursesList key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Courses;

const Courseskeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array(6).fill(0).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white/60 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg"
        >
          {/* Image Placeholder */}
          <div className="bg-gray-300 h-40 w-full rounded-xl mb-4"></div>

          {/* Text Placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>

          {/* Button Placeholder */}
          <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};
