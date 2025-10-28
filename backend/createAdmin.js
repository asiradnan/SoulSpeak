import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const createAdminUser = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGO_URI not found in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Username:', existingAdmin.username);
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10); // Change this password!

        const adminUser = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            referral: 'System',
            mentalCondition: 'N/A',
            ageGroup: '25-34',
            country: 'System',
            goals: 'Platform Management',
            preferences: 'Admin',
            verified: true,
            isCompanion: false,
            isSuspended: false
        });

        await adminUser.save();
        
        console.log('\n✅ Admin user created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Email: admin@gmail.com');
        console.log('   Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');
        console.log('\n🔗 Access admin panel at: /admin');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
