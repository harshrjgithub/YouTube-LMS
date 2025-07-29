import mongoose from 'mongoose';
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

// ✅ Create a Course
export const CreateCourse = async (req, res) => {
  try {
    const { courseTitle, description, level, category } = req.body;

    if (!courseTitle || !description || !level || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const course = await Course.create({
      courseTitle,
      category,
      courseLable: level,
      courseDescription: description,
      creator: null, // TODO: Add actual user ID when available
    });

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    console.error("Error creating course:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Courses
export const GetAllCourses = async (req, res) => {
  
  try {
    const courses = await Course.find({})
      .populate("creator", "name email")
      .populate("lectures", "lectureTitle");

    return res.status(200).json({ message: "Courses fetched successfully", courses });
  } catch (err) {
    console.error("Error fetching courses:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Get Course by ID
export const GetCourseById = async (req, res) => {
  console.log("getcourseid")
  console.log(req.params.id)
  try {
    const course = await Course.findById(req.params.id).populate("lectures", "lectureTitle");
    console.log(course)
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error("Error retrieving course:", error);
    res.status(500).json({ message: "Error retrieving course" });
  }
};

// ✅ Update Course
export const UpdateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseTitle, description, category, level } = req.body;

    const updated = await Course.findByIdAndUpdate(
      id,
      {
        courseTitle,
        courseDescription: description,
        category,
        courseLable: level,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Create Lecture
export const CreateLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!lectureTitle) {
      return res.status(400).json({ message: "Lecture title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new lecture
    const lecture = await Lecture.create({ lectureTitle });

    // Add the lecture to the course
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({ message: "Lecture created successfully", lecture });
  } catch (err) {
    console.error("Error creating lecture:", err);
    res.status(500).json({ message: "Failed to create lecture" });
  }
};

// ✅ Get All Lectures of a Course
export const GetAllLecturesOfCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId).populate('lectures');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ lectures: course.lectures });
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Server error' });
  }
};