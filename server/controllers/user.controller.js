
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import { Progress } from '../models/progress.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/geneateToken.js';
import mongoose from 'mongoose';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prevent registration with admin email
    if (normalizedEmail === 'adminlms@gmail.com') {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is reserved for system administration' 
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Create new user as student (password will be hashed by the pre-save hook)
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'student' // Explicitly set role as student
    });

    console.log(`✅ New student registered: ${newUser.email}`);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};





export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user and include password for comparison
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Log successful login
        console.log(`✅ User logged in: ${user.email} (${user.role})`);

        // Generate token with user role information
        return generateToken(res, user, "Login successful");
        
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate({
                path: 'enrolledCourses.course',
                select: 'courseTitle courseDescription category courseLable lectures',
                populate: {
                    path: 'lectures',
                    select: 'lectureTitle sequence'
                }
            });
            
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Filter out any enrollments with null/invalid course references
        if (user.enrolledCourses) {
            user.enrolledCourses = user.enrolledCourses.filter(enrollment => {
                if (!enrollment.course) {
                    console.warn(`Removing invalid enrollment for user ${user.email}: course reference is null`);
                    return false;
                }
                return true;
            });
        }
        
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const { 
            name, 
            bio, 
            areasOfInterest, 
            skillLevel, 
            learningGoals, 
            preferredLearningStyle,
            photoURL 
        } = req.body;

        const updateData = {
            name,
            photoURL,
            'profile.bio': bio,
            'profile.areasOfInterest': areasOfInterest,
            'profile.skillLevel': skillLevel,
            'profile.learningGoals': learningGoals,
            'profile.preferredLearningStyle': preferredLearningStyle,
            'profile.isProfileComplete': true
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(`✅ Profile updated for user: ${user.email}`);
        return res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully",
            user 
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// ✅ Enroll in Course
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid course ID" 
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // Check if user is already enrolled
        const user = await User.findById(userId);
        const isAlreadyEnrolled = user.enrolledCourses.some(
            enrollment => enrollment.course.toString() === courseId
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ 
                success: false, 
                message: "Already enrolled in this course" 
            });
        }

        // Add enrollment
        user.enrolledCourses.push({
            course: courseId,
            enrolledAt: new Date(),
            progress: {
                completedLectures: [],
                progressPercentage: 0,
                lastAccessedAt: new Date()
            }
        });

        // Also add to course's enrolled students
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

        await user.save();

        console.log(`✅ User ${user.email} enrolled in course: ${course.courseTitle}`);
        
        return res.status(200).json({ 
            success: true, 
            message: "Successfully enrolled in course",
            enrollment: {
                courseId,
                courseTitle: course.courseTitle,
                enrolledAt: new Date()
            }
        });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// ✅ Get User's Enrolled Courses
export const getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'enrolledCourses.course',
                select: 'courseTitle courseDescription category courseLable lectures createdAt',
                populate: {
                    path: 'lectures',
                    select: 'lectureTitle sequence'
                }
            });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Calculate progress for each enrolled course
        const enrolledCoursesWithProgress = await Promise.all(
            user.enrolledCourses.map(async (enrollment) => {
                const courseProgress = await Progress.getCourseProgress(
                    req.user._id, 
                    enrollment.course._id
                );
                
                return {
                    ...enrollment.toObject(),
                    progress: {
                        ...enrollment.progress,
                        ...courseProgress
                    }
                };
            })
        );

        return res.status(200).json({ 
            success: true, 
            enrolledCourses: enrolledCoursesWithProgress
        });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// ✅ Mark Lecture as Completed
export const markLectureCompleted = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.user._id;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid course or lecture ID" 
            });
        }

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        const enrollment = user.enrolledCourses.find(
            e => e.course.toString() === courseId
        );

        if (!enrollment) {
            return res.status(400).json({ 
                success: false, 
                message: "Not enrolled in this course" 
            });
        }

        // Create or update progress record
        let progress = await Progress.findOne({
            user: userId,
            course: courseId,
            lecture: lectureId
        });

        if (!progress) {
            progress = new Progress({
                user: userId,
                course: courseId,
                lecture: lectureId,
                isCompleted: true,
                completedAt: new Date(),
                lastAccessedAt: new Date()
            });
        } else {
            progress.isCompleted = true;
            progress.completedAt = new Date();
            progress.lastAccessedAt = new Date();
        }

        await progress.save();

        // Update user's enrollment progress
        const completedLectureIndex = enrollment.progress.completedLectures.findIndex(
            cl => cl.lecture.toString() === lectureId
        );

        if (completedLectureIndex === -1) {
            enrollment.progress.completedLectures.push({
                lecture: lectureId,
                completedAt: new Date()
            });
        }

        // Calculate updated progress percentage
        const courseProgress = await Progress.getCourseProgress(userId, courseId);
        enrollment.progress.progressPercentage = courseProgress.progressPercentage;
        enrollment.progress.lastAccessedAt = new Date();

        await user.save();

        console.log(`✅ Lecture marked as completed: ${lectureId} for user: ${user.email}`);

        return res.status(200).json({ 
            success: true, 
            message: "Lecture marked as completed",
            progress: courseProgress
        });
    } catch (error) {
        console.error("Error marking lecture as completed:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

// ✅ Get Course Progress
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const progress = await Progress.getCourseProgress(userId, courseId);
        const completedLectures = await Progress.find({
            user: userId,
            course: courseId,
            isCompleted: true
        }).populate('lecture', 'lectureTitle sequence');

        return res.status(200).json({ 
            success: true, 
            progress: {
                ...progress,
                completedLectures: completedLectures.map(p => ({
                    lectureId: p.lecture._id,
                    lectureTitle: p.lecture.lectureTitle,
                    sequence: p.lecture.sequence,
                    completedAt: p.completedAt
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};


