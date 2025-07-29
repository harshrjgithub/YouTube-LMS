import mongoose from 'mongoose';
// import { CourseStatus } from '../constants/course.constants.js';    


const newCourseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    courseDescription: { // This matches the backend field
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    courseLable: { 
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'], // lowercase
      },

    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Course = mongoose.model('Course', newCourseSchema);