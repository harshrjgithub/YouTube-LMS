import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import mongoose from 'mongoose';

/**
 * Cleanup utility to remove invalid enrollment references
 * This fixes issues where users have enrollments pointing to deleted courses
 */
export const cleanupInvalidEnrollments = async () => {
  try {
    console.log('🧹 Starting enrollment cleanup...');
    
    // Get all users with enrollments
    const users = await User.find({ 
      'enrolledCourses.0': { $exists: true } 
    });
    
    if (users.length === 0) {
      console.log('✅ No users with enrollments found');
      return;
    }
    
    console.log(`👥 Found ${users.length} users with enrollments`);
    
    let totalCleaned = 0;
    
    for (const user of users) {
      const originalCount = user.enrolledCourses.length;
      const validEnrollments = [];
      
      for (const enrollment of user.enrolledCourses) {
        // Check if course reference exists
        if (!enrollment.course) {
          console.log(`  ❌ User ${user.email}: Null course reference`);
          continue;
        }
        
        // Validate course ID format
        if (!mongoose.Types.ObjectId.isValid(enrollment.course)) {
          console.log(`  ❌ User ${user.email}: Invalid course ID format`);
          continue;
        }
        
        // Check if course still exists in database
        const courseExists = await Course.findById(enrollment.course);
        if (!courseExists) {
          console.log(`  ❌ User ${user.email}: Course ${enrollment.course} no longer exists`);
          continue;
        }
        
        // Keep valid enrollment
        validEnrollments.push(enrollment);
      }
      
      // Update user if any enrollments were removed
      if (validEnrollments.length !== originalCount) {
        user.enrolledCourses = validEnrollments;
        await user.save();
        
        const cleanedCount = originalCount - validEnrollments.length;
        totalCleaned += cleanedCount;
        
        console.log(`  🧹 User ${user.email}: Cleaned ${cleanedCount} invalid enrollments (${validEnrollments.length}/${originalCount} remaining)`);
      }
    }
    
    if (totalCleaned > 0) {
      console.log(`✅ Cleanup completed: Removed ${totalCleaned} invalid enrollments`);
    } else {
      console.log('✅ No invalid enrollments found');
    }
    
  } catch (error) {
    console.error('❌ Error during enrollment cleanup:', error);
    throw error;
  }
};