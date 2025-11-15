import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import ProfilePicture from "../models/profilePicture.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Double-check directory exists before writing
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
        }
        cb(null, true);
    }
});

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

export const updateProfile = async (req, res) => {
    console.log("Received request to update profile");
    try {
        const { name, username, email, password, newPassword, referral,
            mentalCondition,
            ageGroup,
            country,
            goals,
            preferences } = req.body;
        const userId = req.user.id; // Get user ID from the token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const emailtaken = await User.findOne({ email })
        if (emailtaken && emailtaken._id != userId) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Handle password change - only if newPassword is provided and not empty
        if (newPassword && newPassword.trim() !== "") {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid current password." });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Only change verified status if email has changed
        const emailChanged = user.email !== email;
        const updateData = {
            name,
            username,
            email,
            referral,
            mentalCondition,
            ageGroup,
            country,
            goals,
            preferences
        };

        // If email changed, set verified to false; otherwise keep existing verified status
        if (emailChanged) {
            updateData.verified = false;
        }
        // If email didn't change, don't modify verified status at all

        const user_updated = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Save the password change if it was made
        if (newPassword && newPassword.trim() !== "") {
            user_updated.password = user.password;
            await user_updated.save();
        }

        console.log("User updated:", user_updated);
        res.status(200).json({ user: user_updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        console.log('Upload profile picture request received for user:', req.user?.id);
        
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.error('No authenticated user found');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    console.error('Multer upload error:', err.message);
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        reject(new Error('File too large. Maximum size is 5MB.'));
                    } else if (err.message.includes('Only image files')) {
                        reject(new Error(err.message));
                    } else {
                        reject(new Error('File upload failed'));
                    }
                    return;
                }
                console.log('File upload successful:', req.file);
                resolve(req.file);
            });
        });

        if (!uploadResult) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'No image file provided' });
        }

        const imageUrl = `/uploads/${uploadResult.filename}`;
        console.log('Generated image URL:', imageUrl);
        
        // Update user's profile picture in database
        const profilePic = await ProfilePicture.findOneAndUpdate(
            { user: req.user.id },
            { imageUrl: imageUrl },
            { upsert: true, new: true }
        );

        console.log('Profile picture database record updated:', profilePic);

        res.status(200).json({ 
            message: 'Profile picture updated successfully',
            imageUrl: imageUrl 
        });

    } catch (error) {
        console.error('Profile picture upload error:', error);
        
        // Send specific error messages based on error type
        if (error.message.includes('File too large')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes('Only image files')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes('Authentication')) {
            return res.status(401).json({ message: error.message });
        } else {
            return res.status(500).json({ 
                message: 'Error uploading profile picture',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

export const getProfilePicture = async (req, res) => {
    try {
        const profilePic = await ProfilePicture.findOne({ user: req.user.id });
        
        if (!profilePic) {
            console.log('No profile picture found for user:', req.user.id);
            return res.status(200).json({ imageUrl: null });
        }

        res.status(200).json({ imageUrl: profilePic.imageUrl });
        
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Error fetching profile picture' });
    }
};
