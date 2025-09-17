import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student", // Default role is student, admin is exclusive
    },
    // User Profile Information
    profile: {
        bio: {
            type: String,
            default: "",
            maxlength: 500
        },
        areasOfInterest: [{
            type: String,
            trim: true
        }],
        skillLevel: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner"
        },
        learningGoals: [{
            type: String,
            trim: true
        }],
        preferredLearningStyle: {
            type: String,
            enum: ["visual", "auditory", "kinesthetic", "reading"],
            default: "visual"
        },
        isProfileComplete: {
            type: Boolean,
            default: false
        }
    },
    
    // Course Enrollments with Progress Tracking
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        progress: {
            completedLectures: [{
                lecture: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Lecture"
                },
                completedAt: {
                    type: Date,
                    default: Date.now
                }
            }],
            progressPercentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100
            },
            lastAccessedAt: {
                type: Date,
                default: Date.now
            }
        }
    }],
    
    // Legacy courses field (keeping for backward compatibility)
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    
    photoURL: {
        type: String,
        default: "",
        trim: true,
    }
    }, {timestamps: true});
    
// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    // Avoid double-hashing
    if (this.password.startsWith("$2b$")) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  

  // Fix in registration


  
  // Method to compare passwords
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
export const User = mongoose.model('User', userSchema);





  
    
