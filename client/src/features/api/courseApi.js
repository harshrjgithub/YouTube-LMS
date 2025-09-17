import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({ baseUrl: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/v1', credentials: 'include' }),
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

    // ✅ Get all courses with search and filtering
    getAllCourses: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        
        const queryString = searchParams.toString();
        return `/courses${queryString ? `?${queryString}` : ''}`;
      },
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
      query: ({ courseId, lectureTitle, lectureDescription, videoUrl, sequence }) => ({
        url: `/courses/${courseId}/lectures`,
        method: 'POST',
        body: { lectureTitle, lectureDescription, videoUrl, sequence },
      }),
      invalidatesTags: ['Lectures', 'Courses'],
    }),

    // ✅ Get lectures of a specific course
    getLectures: builder.query({
      query: (courseId) => `/courses/${courseId}/lectures`,
      providesTags: ['Lectures'],
    }),

    // ✅ Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),

    // ✅ Get analytics data
    getAnalytics: builder.query({
      query: () => '/courses/analytics/dashboard',
      providesTags: ['Courses'],
    }),

    // ✅ Import playlist lectures
    importPlaylistLectures: builder.mutation({
      query: ({ courseId, playlistId, replaceExisting = false }) => ({
        url: `/courses/${courseId}/lectures/import-playlist`,
        method: 'POST',
        body: { playlistId, replaceExisting },
      }),
      invalidatesTags: ['Lectures', 'Courses'],
    }),

    // ✅ Toggle course published status
    toggleCoursePublished: builder.mutation({
      query: ({ id, isPublished }) => ({
        url: `/courses/${id}/toggle-published`,
        method: 'PATCH',
        body: { isPublished },
      }),
      invalidatesTags: ['Courses'],
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
  useDeleteCourseMutation,
  useGetAnalyticsQuery,
  useImportPlaylistLecturesMutation,
  useToggleCoursePublishedMutation,
} = courseApi;
