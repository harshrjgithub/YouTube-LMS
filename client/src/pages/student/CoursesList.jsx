// Import necessary libraries and components
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const CoursesList = ({ course }) => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-[350px] bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 overflow-hidden">
        {/* Course Image */}
        <div className="relative w-full h-44">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute top-2 left-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {course.level || "Beginner"}
          </div>
        </div>

        {/* Course Details */}
        <CardContent className="p-5 text-gray-800">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>

          {/* Instructor Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={course.instructorAvatar} alt={course.instructorName} />
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-800">{course.instructorName}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>

          {/* Enroll Button */}
          <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-300">
            🚀 Enroll Now
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesList;
