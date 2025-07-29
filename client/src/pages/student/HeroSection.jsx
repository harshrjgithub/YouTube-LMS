import React from 'react';

const HeroSection = () => {
  return (
    <div className='relative bg-gradient-to-br from-[#FDEBFF] via-[#D8B4F8] to-[#FBE4FF] py-24 px-6 text-center'>
      <div className='max-w-3xl mx-auto bg-white/60 backdrop-blur-lg rounded-xl p-10 shadow-xl'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight'>
          Unlock Your Potential with <span className='text-purple-600'>Curated Courses</span>
        </h1>
        <p className='text-gray-700 text-lg mb-8'>
          Discover skills for the future, curated just for you.
        </p>

        <form action="" className='flex justify-center'>
          <input
            type='text'
            placeholder='Search for courses...'
            className='p-3 w-2/3 max-w-md rounded-l-full border border-gray-300 focus:outline-none'
          />
          <button className='bg-purple-600 text-white px-6 rounded-r-full hover:bg-purple-700 transition-all'>
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
