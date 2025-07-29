
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/geneateToken.js';  // Fixed typo

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password BEFORE saving (Mongoose also hashes it if using pre('save'))
    const hashedPassword = await bcrypt.hash(password, 10);  // ✅ Correct way

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,  // ✅ Store hashed password correctly
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};





export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
    }

    console.log("User found in DB:", user);
    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match result:", isMatch ? "✅ Matched" : "❌ Not Matched");

    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
    });
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


