import React from 'react';

const Lecture = ({ lecture }) => {
  return (
    <div className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800 text-base">
        {lecture.lectureTitle}
      </h3>
      <p className="text-sm text-gray-500">ID: {lecture._id}</p>
    </div>
  );
};

export default Lecture;
