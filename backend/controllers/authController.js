import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Resend } from 'resend';

export async function signup(request, response) {
    try {
        const body = await request.body;
        const {
            referral,
            mentalCondition,
            name,
            username,
            email,
            password,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        } = body;
        const requiredFields = {
            referral,
            mentalCondition,
            name,
            username,
            email,
            password,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return response.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check for duplicate email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return response.status(400).json({
                message: "Email already in use."
            });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return response.status(400).json({
                message: "Username already in use. Please choose a different username."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            referral,
            mentalCondition,
            name,
            username,
            email,
            password: hashedPassword,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        });
        await newUser.save();

        return response.status(201).json({
            message: "User registered successfully.",
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error during signup:", error);
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const message = field === 'email' 
                ? "Email already in use."
                : field === 'username'
                ? "Username already in use. Please choose a different username."
                : `${field} already in use.`;
            return response.status(400).json({ message });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return response.status(400).json({
                message: messages.join(', ')
            });
        }
        
        return response.status(500).json({
            message: "Internal server error."
        });
    }
}

export async function login(request, response) {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({ message: "Invalid email or password." });
        }
        if (user.suspended) {
            return response.status(403).json({ message: "Your account has been suspended." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid email or password." });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "48h" }
        );

        return response.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return response.status(500).json({ message: "Internal server error." });
    }
}

export async function verifyEmail(req, res) {
    try {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Use backend URL for verification endpoint
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const url = `${backendUrl}/confirm-email?token=${token}`;

        const resend = new Resend(process.env.RESEND_API_KEY);
        const user = await User.findById(req.user.id);
        console.log("About to send email with Resend")
        
        const { data, error } = await resend.emails.send({
            from: 'SoulSpeak <onboarding@resend.dev>',
            to: user.email,
            subject: 'Verify Your Email - SoulSpeak',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Welcome to SoulSpeak!</h2>
                    <p>Hi ${user.name || user.username},</p>
                    <p>Thank you for signing up. Please verify your email address to get started.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email</a>
                    </div>
                    <p style="color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #4F46E5; word-break: break-all;">${url}</p>
                    <p style="color: #666;">This link will expire in 24 hours.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">Best regards,<br>SoulSpeak Team</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ message: 'Error sending verification email' });
        }

        console.log('Email sent successfully:', data.id);
        res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending verification email' });
    }
}

export async function confirmEmail(req, res) {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await User.findByIdAndUpdate(decoded.id, { verified: true });
        
        // Use frontend URL for redirect
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/profile`);
    } catch (error) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=invalid-token`);
    }
}

export async function sendPasswordResetEmail(req, res) {
    try {
        const { email } = req.body;
        console.log('Reset password request for email:', email);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        console.log('User found:', user.username);

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Use environment variable for frontend URL, fallback to localhost
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        console.log('Initializing Resend...');
        const resend = new Resend(process.env.RESEND_API_KEY);

        console.log('Sending email to:', user.email);
        const { data, error } = await resend.emails.send({
            from: 'SoulSpeak <onboarding@resend.dev>',
            to: user.email,
            subject: 'Reset Your SoulSpeak Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Password Reset Request</h2>
                    <p>Hi ${user.name || user.username},</p>
                    <p>We received a request to reset your password for your SoulSpeak account.</p>
                    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #4F46E5; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #666;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">Best regards,<br>SoulSpeak Team</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({ 
                message: 'Error sending password reset email',
                error: error.message 
            });
        }

        console.log('Email sent successfully:', data.id);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Password reset email error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response
        });
        res.status(500).json({ 
            message: 'Error sending password reset email',
            error: error.message 
        });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.body;
        const { password } = req.body;
        console.log(token, password)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
}
