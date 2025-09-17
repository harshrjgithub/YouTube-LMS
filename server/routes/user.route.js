
import express from 'express';
import { 
    register, 
    login, 
    logout, 
    getUserProfile, 
    updateUserProfile,
    enrollInCourse,
    getEnrolledCourses,
    markLectureCompleted,
    getCourseProgress
} from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Profile routes
router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, updateUserProfile);

// Course enrollment routes
router.post('/enroll/:courseId', isAuthenticated, enrollInCourse);
router.get('/enrolled-courses', isAuthenticated, getEnrolledCourses);

// Progress tracking routes
router.post('/progress/:courseId/:lectureId/complete', isAuthenticated, markLectureCompleted);
router.get('/progress/:courseId', isAuthenticated, getCourseProgress);

export default router;


