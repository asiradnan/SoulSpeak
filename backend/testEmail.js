import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testEmail() {
    try {
        console.log('Testing email configuration...');
        console.log('Email:', process.env.EMAIL);
        console.log('Email Password length:', process.env.EMAIL_PASS?.length);
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log('Verifying transporter...');
        await transporter.verify();
        console.log('✅ Email configuration is valid!');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Send to self for testing
            subject: 'Test Email from SoulSpeak',
            html: `
                <h2>Test Email</h2>
                <p>This is a test email from SoulSpeak backend.</p>
                <p>If you receive this, your email configuration is working correctly!</p>
                <p>Time: ${new Date().toISOString()}</p>
            `,
        });

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox:', process.env.EMAIL);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error('Error:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.response) console.error('Response:', error.response);
        process.exit(1);
    }
}

testEmail();
