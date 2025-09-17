import express from 'express';
import {
  CreateCourse,
  GetAllCourses,
  UpdateCourse,
  GetCourseById,
  DeleteCourse,
  CreateLecture,
  GetAllLecturesOfCourse,
  GetAnalytics,
  ImportPlaylistLectures,
  ToggleCoursePublished, // ✅ New toggle published controller
} from '../controllers/course.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// Create & Get All Courses
router.route('/')
  .post(isAuthenticated, isAdmin, CreateCourse)
  .get(GetAllCourses);

// Get, Update & Delete Single Course
router.route('/:id')
  .put(isAuthenticated, isAdmin, UpdateCourse)
  .get(GetCourseById)
  .delete(isAuthenticated, isAdmin, DeleteCourse);

// ✅ Create Lecture
router.route('/:courseId/lectures')
  .post(isAuthenticated, isAdmin, CreateLecture)
  .get(GetAllLecturesOfCourse);

// ✅ Import Playlist Lectures
router.route('/:courseId/lectures/import-playlist')
  .post(isAuthenticated, isAdmin, ImportPlaylistLectures);

// ✅ Analytics endpoint
router.route('/analytics/dashboard').get(isAuthenticated, isAdmin, GetAnalytics);

// ✅ Toggle course published status
router.route('/:id/toggle-published').patch(isAuthenticated, isAdmin, ToggleCoursePublished);

export default router;
