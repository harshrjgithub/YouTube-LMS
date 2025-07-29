import express from 'express';
import {
  CreateCourse,
  GetAllCourses,
  UpdateCourse,
  GetCourseById,
  CreateLecture,
  GetAllLecturesOfCourse, // ✅ New controller
} from '../controllers/course.controller.js';

const router = express.Router();

// Create & Get All Courses
router.route('/').post(CreateCourse).get(GetAllCourses);

// Get & Update Single Course
router.route('/:id').put(UpdateCourse).get(GetCourseById);

// ✅ Create Lecture
router.route('/:courseId/lectures').post(CreateLecture);

// ✅ Get All Lectures of a Course (NEW CONTROLLER)
router.route('/:courseId/lectures').get(GetAllLecturesOfCourse);

export default router;
