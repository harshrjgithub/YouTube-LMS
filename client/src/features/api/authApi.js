import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/v1/users', 
    credentials: 'include' 
  }),
  tagTypes: ['User'],

  endpoints: (builder) => ({
    // ✅ Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // ✅ Register user
    register: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // ✅ Logout user
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // ✅ Get user profile
    getUserProfile: builder.query({
      query: () => '/profile',
      providesTags: ['User'],
    }),

    // ✅ Update user profile
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    // ✅ Enroll in course
    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: `/enroll/${courseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // ✅ Get enrolled courses
    getEnrolledCourses: builder.query({
      query: () => '/enrolled-courses',
      providesTags: ['User'],
    }),

    // ✅ Mark lecture as completed
    markLectureCompleted: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/progress/${courseId}/${lectureId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // ✅ Get course progress
    getCourseProgress: builder.query({
      query: (courseId) => `/progress/${courseId}`,
      providesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useEnrollInCourseMutation,
  useGetEnrolledCoursesQuery,
  useMarkLectureCompletedMutation,
  useGetCourseProgressQuery,
} = authApi;