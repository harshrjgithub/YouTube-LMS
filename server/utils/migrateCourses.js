import { Course } from '../models/course.model.js';

/**
 * Migration script to publish all existing courses
 * This ensures existing courses become visible on the frontend
 */
export const publishExistingCourses = async () => {
  try {
    console.log('🔄 Starting course migration...');
    
    // Find all courses that are not published
    const unpublishedCourses = await Course.find({ isPublished: { $ne: true } });
    
    if (unpublishedCourses.length === 0) {
      console.log('✅ All courses are already published');
      return;
    }
    
    console.log(`📚 Found ${unpublishedCourses.length} unpublished courses`);
    
    // Update all unpublished courses to be published
    const result = await Course.updateMany(
      { isPublished: { $ne: true } },
      { $set: { isPublished: true } }
    );
    
    console.log(`✅ Successfully published ${result.modifiedCount} courses`);
    
    // Log the published courses
    unpublishedCourses.forEach(course => {
      console.log(`  📖 Published: ${course.courseTitle}`);
    });
    
  } catch (error) {
    console.error('❌ Error during course migration:', error);
    throw error;
  }
};