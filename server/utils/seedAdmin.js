import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

/**
 * Seeds the database with the exclusive admin user
 * This ensures the admin account always exists with correct credentials
 */
export const seedAdminUser = async () => {
  try {
    const adminEmail = 'adminlms@gmail.com';
    const adminPassword = 'admin123';
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      // Create the admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = await User.create({
        name: 'LMS Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
    } else {
      // Update existing admin user to ensure correct password and role
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await User.findByIdAndUpdate(existingAdmin._id, {
        password: hashedPassword,
        role: 'admin',
        name: 'LMS Administrator'
      });
      
      console.log('✅ Admin user updated successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};