import mongoose from 'mongoose';
import axios from 'axios';
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

// Helper: Extract YouTube video ID from URL
function extractYouTubeVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper: Validate YouTube video ID
async function validateYouTubeVideo(videoId, apiKey) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data.items.length > 0;
  } catch (error) {
    console.error('YouTube API validation error:', error);
    return false;
  }
}

// Helper: Fetch videos from YouTube playlist
async function fetchPlaylistVideos(playlistId, apiKey) {
  let videos = [];
  let nextPageToken = '';
  let sequence = 1;

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    const res = await axios.get(url);
    res.data.items.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      videos.push({
        lectureTitle: item.snippet.title,
        lectureDescription: item.snippet.description || '',
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        youtubeVideoId: videoId,
        sequence: sequence++,
      });
    });
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  return videos;
}

// ✅ Create a Course
export const CreateCourse = async (req, res) => {
  try {
    const { courseTitle, description, level, category, playlistId, isPublished = true } = req.body;

    if (!courseTitle || !description || !level || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (playlistId && !/^[A-Za-z0-9_-]{5,}$/.test(playlistId)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }

    const course = await Course.create({
      courseTitle,
      category,
      courseLable: level,
      courseDescription: description,
      playlistId,
      creator: req.user?._id || null, // Set creator from authenticated user
      isPublished: Boolean(isPublished), // Use the provided status or default to true
    });

    // If playlistId is provided, fetch videos and create lectures
    if (playlistId) {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "YouTube API key not configured" });
      }
      const videos = await fetchPlaylistVideos(playlistId, apiKey);
      for (const video of videos) {
        const lecture = await Lecture.create(video);
        course.lectures.push(lecture._id);
      }
      await course.save();
    }

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Courses with Search and Filtering
export const GetAllCourses = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      level, 
      sortBy = 'newest',
      page = 1,
      limit = 12,
      includeUnpublished = 'false'
    } = req.query;

    // Build search query
    let query = {};

    // Text search across title and description
    if (search) {
      query.$or = [
        { courseTitle: { $regex: search, $options: 'i' } },
        { courseDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'all') {
      query.courseLable = level;
    }

    // Published status filter
    // For admin requests, include unpublished courses if requested
    // For public requests, only show published courses
    if (includeUnpublished === 'true' && req.user?.role === 'admin') {
      // Admin can see all courses (published and unpublished)
      console.log('Admin request: Including unpublished courses');
    } else {
      // Public access: only published courses
      query.isPublished = true;
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'title':
        sortOptions = { courseTitle: 1 };
        break;
      case 'popular':
        sortOptions = { 'enrolledStudents.length': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const courses = await Course.find(query)
      .populate("creator", "name email")
      .populate("lectures", "lectureTitle videoUrl sequence")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    // Get available categories and levels for filters
    const categories = await Course.distinct('category', { isPublished: true });
    const levels = await Course.distinct('courseLable', { isPublished: true });

    return res.status(200).json({ 
      message: "Courses fetched successfully", 
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        categories: categories.filter(Boolean),
        levels: levels.filter(Boolean)
      }
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Course by ID
export const GetCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("lectures", "lectureTitle videoUrl sequence");
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
    const { courseTitle, description, category, level, playlistId, isPublished } = req.body;

    const updateData = {
      courseTitle,
      courseDescription: description,
      category,
      courseLable: level,
      playlistId,
    };

    // Only update isPublished if explicitly provided
    if (typeof isPublished === 'boolean') {
      updateData.isPublished = isPublished;
    }

    const updated = await Course.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log(`✅ Course updated: ${updated.courseTitle} (Published: ${updated.isPublished})`);
    res.status(200).json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Create Lecture
export const CreateLecture = async (req, res) => {
  try {
    const { lectureTitle, lectureDescription, videoUrl, sequence } = req.body;
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    if (!lectureTitle || !videoUrl) {
      return res.status(400).json({ message: "Lecture title and video URL are required" });
    }

    // Extract and validate YouTube video ID
    const youtubeVideoId = extractYouTubeVideoId(videoUrl);
    if (!youtubeVideoId) {
      return res.status(400).json({ message: "Invalid YouTube URL. Please provide a valid YouTube video URL or video ID." });
    }

    // Validate video exists (optional - requires YouTube API key)
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const isValidVideo = await validateYouTubeVideo(youtubeVideoId, apiKey);
      if (!isValidVideo) {
        return res.status(400).json({ message: "YouTube video not found or unavailable." });
      }
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Determine sequence if not provided
    let lectureSequence = sequence;
    if (!lectureSequence) {
      const existingLectures = await Lecture.find({ _id: { $in: course.lectures } });
      lectureSequence = existingLectures.length + 1;
    }

    // Create a new lecture
    const lecture = await Lecture.create({ 
      lectureTitle, 
      lectureDescription: lectureDescription || '',
      videoUrl, 
      youtubeVideoId,
      sequence: lectureSequence 
    });

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

    const course = await Course.findById(courseId).populate({
      path: 'lectures',
      options: { sort: { sequence: 1 } } // Sort lectures by sequence
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ 
      lectures: course.lectures,
      course: {
        _id: course._id,
        courseTitle: course.courseTitle,
        courseDescription: course.courseDescription,
        category: course.category,
        courseLable: course.courseLable
      }
    });
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete Course
export const DeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if user has permission to delete this course
    // For now, any admin/instructor can delete any course
    // In future, you might want to check if req.user._id === course.creator
    
    console.log(`Admin ${req.user.name} (${req.user.email}) is deleting course: ${course.courseTitle}`);

    // Delete all associated lectures first
    let deletedLecturesCount = 0;
    if (course.lectures && course.lectures.length > 0) {
      const deleteResult = await Lecture.deleteMany({ _id: { $in: course.lectures } });
      deletedLecturesCount = deleteResult.deletedCount;
      console.log(`Deleted ${deletedLecturesCount} lectures associated with course ${course.courseTitle}`);
    }

    // Delete the course
    await Course.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true,
      message: 'Course and associated lectures deleted successfully',
      deletedCourse: {
        _id: course._id,
        courseTitle: course.courseTitle,
        deletedLecturesCount
      }
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Get Analytics Data
export const GetAnalytics = async (req, res) => {
  try {
    // Get total courses count
    const totalCourses = await Course.countDocuments();

    // Get total lectures count
    const totalLectures = await Lecture.countDocuments();

    // Get courses with enrollment counts
    const coursesWithEnrollments = await Course.aggregate([
      {
        $project: {
          courseTitle: 1,
          category: 1,
          courseLable: 1,
          enrolledStudents: 1,
          lectures: 1,
          createdAt: 1,
          enrollmentCount: { $size: { $ifNull: ['$enrolledStudents', []] } },
          lectureCount: { $size: { $ifNull: ['$lectures', []] } }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      }
    ]);

    // Get most popular courses (top 5 by enrollment)
    const popularCourses = coursesWithEnrollments.slice(0, 5);

    // Get total enrolled students (unique count)
    const totalEnrollments = coursesWithEnrollments.reduce(
      (sum, course) => sum + course.enrollmentCount, 0
    );

    // Get courses by category
    const coursesByCategory = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recent courses (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCourses = await Course.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate average lectures per course
    const avgLecturesPerCourse = totalCourses > 0 ? 
      Math.round((totalLectures / totalCourses) * 10) / 10 : 0;

    res.status(200).json({
      message: 'Analytics data retrieved successfully',
      analytics: {
        overview: {
          totalCourses,
          totalLectures,
          totalEnrollments,
          recentCourses,
          avgLecturesPerCourse
        },
        popularCourses,
        coursesByCategory,
        coursesWithStats: coursesWithEnrollments
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

// ✅ Import Playlist Lectures
export const ImportPlaylistLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { playlistId, replaceExisting = false } = req.body;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid course ID format' 
      });
    }

    if (!playlistId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Playlist ID is required' 
      });
    }

    // Validate playlist ID format
    if (!/^[A-Za-z0-9_-]{5,}$/.test(playlistId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid playlist ID format' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'YouTube API key not configured' 
      });
    }

    console.log(`Importing playlist ${playlistId} for course ${course.courseTitle}`);

    // If replaceExisting is true, delete existing lectures
    if (replaceExisting && course.lectures.length > 0) {
      await Lecture.deleteMany({ _id: { $in: course.lectures } });
      course.lectures = [];
      console.log('Existing lectures deleted for replacement');
    }

    // Fetch videos from YouTube playlist
    const videos = await fetchPlaylistVideos(playlistId, apiKey);
    
    if (videos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No videos found in playlist or playlist is private/unavailable' 
      });
    }

    // Create lectures from playlist videos
    const createdLectures = [];
    const errors = [];
    let startingSequence = course.lectures.length + 1;

    for (let i = 0; i < videos.length; i++) {
      try {
        const video = videos[i];
        
        // Check if lecture with same video ID already exists in this course
        const existingLecture = await Lecture.findOne({ 
          youtubeVideoId: video.youtubeVideoId,
          _id: { $in: course.lectures }
        });

        if (existingLecture && !replaceExisting) {
          console.log(`Skipping duplicate video: ${video.lectureTitle}`);
          continue;
        }

        const lecture = await Lecture.create({
          lectureTitle: video.lectureTitle,
          lectureDescription: video.lectureDescription,
          videoUrl: video.videoUrl,
          youtubeVideoId: video.youtubeVideoId,
          sequence: replaceExisting ? video.sequence : startingSequence + i,
        });

        createdLectures.push(lecture);
        course.lectures.push(lecture._id);
        
      } catch (error) {
        console.error(`Error creating lecture for video ${i + 1}:`, error);
        errors.push({
          videoIndex: i + 1,
          title: videos[i]?.lectureTitle || 'Unknown',
          error: error.message
        });
      }
    }

    // Update course with playlist ID
    course.playlistId = playlistId;
    await course.save();

    const response = {
      success: true,
      message: `Successfully imported ${createdLectures.length} lectures from playlist`,
      data: {
        courseId: course._id,
        courseTitle: course.courseTitle,
        playlistId,
        importedCount: createdLectures.length,
        totalVideosInPlaylist: videos.length,
        skippedCount: videos.length - createdLectures.length - errors.length,
        errorCount: errors.length,
        lectures: createdLectures.map(lecture => ({
          _id: lecture._id,
          lectureTitle: lecture.lectureTitle,
          youtubeVideoId: lecture.youtubeVideoId,
          sequence: lecture.sequence
        }))
      }
    };

    if (errors.length > 0) {
      response.errors = errors;
      response.message += ` (${errors.length} errors occurred)`;
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('Error importing playlist:', error);
    
    // Handle specific YouTube API errors
    if (error.response?.status === 403) {
      return res.status(403).json({ 
        success: false, 
        message: 'YouTube API quota exceeded or access denied' 
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        success: false, 
        message: 'Playlist not found or is private' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to import playlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Toggle Course Published Status
export const ToggleCoursePublished = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Toggle or set published status
    const newPublishedStatus = typeof isPublished === 'boolean' ? isPublished : !course.isPublished;
    
    course.isPublished = newPublishedStatus;
    await course.save();

    console.log(`✅ Course ${course.courseTitle} ${newPublishedStatus ? 'published' : 'unpublished'} by ${req.user.email}`);

    res.status(200).json({ 
      success: true,
      message: `Course ${newPublishedStatus ? 'published' : 'unpublished'} successfully`,
      course: {
        _id: course._id,
        courseTitle: course.courseTitle,
        isPublished: course.isPublished
      }
    });
  } catch (error) {
    console.error('Error toggling course published status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update course status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};