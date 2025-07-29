import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/v1' }), // ✅ Update if base URL differs
  tagTypes: ['Courses', 'Lectures'],

  endpoints: (builder) => ({
    // ✅ Create a new course
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/courses',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Courses'],
    }),

    // ✅ Get all courses
    getAllCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),

    // ✅ Get course by ID
    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ['Courses'],
    }),

    // ✅ Update course
    updateCourse: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Courses'],
    }),

    // ✅ Create lecture
    createLecture: builder.mutation({
      query: ({ courseId, lectureTitle }) => ({
        url: `/courses/${courseId}/lectures`,
        method: 'POST',
        body: { lectureTitle },
      }),
      invalidatesTags: ['Lectures'],
    }),

    // ✅ NEW: Get lectures of a specific course
    getLectures: builder.query({
      query: (courseId) => `/courses/${courseId}/lectures`,
      providesTags: ['Lectures'],
    }),
  }),
});

// Export hooks
export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useCreateLectureMutation,
  useGetLecturesQuery, 
} = courseApi;
