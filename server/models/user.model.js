import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        default: "student",
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
        photoURL: {
            type: String,
            default: "",
        }
    }, {timestamps: true});
    
// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    console.log("🔹 Pre-save hook triggered");
  
    if (!this.isModified("password")) {
      console.log("🔹 Password not modified, skipping hash");
      return next();
    }
  
    // ✅ Check if the password is already hashed
    if (this.password.startsWith("$2b$")) {
      console.log("🔹 Password is already hashed, skipping re-hash");
      return next();
    }
  
    console.log("🔹 Hashing password:", this.password);
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    console.log("🔹 Hashed password before save:", this.password);
    next();
  });
  
  

  // Fix in registration


  
  // Method to compare passwords
  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
export const User = mongoose.model('User', userSchema);





  
    
