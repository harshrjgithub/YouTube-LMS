import mongoose from 'mongoose';

/**
 * Progress Model for tracking user progress through courses and lectures
 * This provides detailed analytics and progress tracking capabilities
 */
const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    timeSpent: {
        type: Number, // in minutes
        default: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    // Additional tracking data
    watchTime: {
        type: Number, // in seconds
        default: 0
    },
    attempts: {
        type: Number,
        default: 1
    }
}, { 
    timestamps: true,
    // Ensure unique progress per user-course-lecture combination
    indexes: [
        { user: 1, course: 1, lecture: 1 },
        { user: 1, course: 1 },
        { user: 1 }
    ]
});

// Compound index for efficient queries
progressSchema.index({ user: 1, course: 1, lecture: 1 }, { unique: true });

// Method to mark lecture as completed
progressSchema.methods.markCompleted = function() {
    this.isCompleted = true;
    this.completedAt = new Date();
    return this.save();
};

// Static method to get course progress for a user
progressSchema.statics.getCourseProgress = async function(userId, courseId) {
    const totalLectures = await mongoose.model('Course')
        .findById(courseId)
        .populate('lectures')
        .then(course => course?.lectures?.length || 0);
    
    const completedLectures = await this.countDocuments({
        user: userId,
        course: courseId,
        isCompleted: true
    });
    
    const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    
    return {
        totalLectures,
        completedLectures,
        progressPercentage
    };
};

export const Progress = mongoose.model('Progress', progressSchema);