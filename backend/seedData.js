import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Post from './models/Post.js';
import Report from './models/Report.js';
import User from './models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGO_URI not found in environment variables');
        }
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Dummy posts data
const dummyPosts = [
    {
        content: "Today I had a breakthrough in therapy. I realized that my anxiety stems from wanting to control everything. Learning to let go has been transformative. Anyone else struggle with this?",
        category: "Mindful Moments",
    },
    {
        content: "Just wanted to share that I've been sober for 6 months today! 🎉 This community has been incredibly supportive. Thank you all for being here.",
        category: "Wellness Hub",
    },
    {
        content: "Does anyone have tips for managing panic attacks? I've tried breathing exercises but sometimes they don't work. Looking for other techniques that have helped you.",
        category: "Support Circle",
    },
    {
        content: "Started journaling every morning and it's been amazing for my mental health. I write down 3 things I'm grateful for and it sets a positive tone for the day. Highly recommend! 📝",
        category: "Mindful Moments",
    },
    {
        content: "New here! Just wanted to say hi and thank you for creating such a welcoming space. Looking forward to connecting with all of you.",
        category: "Welcome Center",
    },
    {
        content: "Bad day today. Depression is hitting hard. Just needed to tell someone. If you're going through something similar, you're not alone. We'll get through this together. 💙",
        category: "Support Circle",
    },
    {
        content: "I've been practicing meditation for 30 days straight now. The difference in my stress levels is incredible. Started with just 5 minutes and now I'm up to 20. Baby steps work!",
        category: "Wellness Hub",
    },
    {
        content: "Anyone else find it hard to ask for help? I'm working on it but it feels like showing weakness sometimes. How do you overcome this feeling?",
        category: "General",
    },
    {
        content: "Just finished a really good book on cognitive behavioral therapy. 'Feeling Good' by David Burns. Game changer! Happy to discuss if anyone else has read it.",
        category: "Wellness Hub",
    },
    {
        content: "Reminder: Your mental health is just as important as your physical health. It's okay to take a mental health day. It's okay to set boundaries. You matter. ❤️",
        category: "Mindful Moments",
    },
    {
        content: "Started seeing a new therapist and I'm nervous about opening up again. Any advice on building that trust?",
        category: "Support Circle",
    },
    {
        content: "Celebrated a small win today - I went grocery shopping without anxiety! These little victories matter. What's your recent small win?",
        category: "General",
    },
    {
        content: "The weather is beautiful today. Took a walk in the park and felt so much better. Nature really does heal. 🌳☀️",
        category: "Mindful Moments",
    },
    {
        content: "Has anyone tried group therapy? I'm considering it but feeling a bit intimidated. What was your experience like?",
        category: "Support Circle",
    },
    {
        content: "Making a playlist of calming music for when I'm feeling overwhelmed. Drop your favorite relaxing songs below! 🎵",
        category: "Wellness Hub",
    }
];

// Dummy reports data
const dummyReports = [
    {
        userEmail: "user1@example.com",
        type: "review",
        details: "The platform has been incredibly helpful for my mental health journey. The companion feature is amazing! However, I'd love to see more resources on PTSD specifically.",
        status: "pending"
    },
    {
        userEmail: "user2@example.com",
        type: "profile-report",
        details: "Profile: 507f1f77bcf86cd799439011\nThis user has been sending inappropriate messages and making others uncomfortable in the forum.",
        status: "pending"
    },
    {
        userEmail: "user3@example.com",
        type: "chat-report",
        details: "Chat ID: 507f191e810c19729de860ea\nExperienced harassment in this chat. User was being very aggressive and dismissive of my mental health struggles.",
        status: "resolved"
    },
    {
        userEmail: "user4@example.com",
        type: "review",
        details: "Love the training program for companions! Very comprehensive and well-structured. Suggestion: add more scenarios about crisis situations.",
        status: "pending"
    },
    {
        userEmail: "user5@example.com",
        type: "profile-report",
        details: "Profile: 507f1f77bcf86cd799439012\nSuspicious behavior - user is promoting external services and asking for payment for 'therapy sessions'.",
        status: "pending"
    },
    {
        userEmail: "user6@example.com",
        type: "review",
        details: "The forum categories are helpful but could we add one specifically for anxiety disorders? It's such a common issue and would benefit from dedicated space.",
        status: "resolved"
    },
    {
        userEmail: "user7@example.com",
        type: "chat-report",
        details: "Chat ID: 507f191e810c19729de860eb\nUser shared triggering content without warning. Need better content moderation.",
        status: "rejected"
    },
    {
        userEmail: "user8@example.com",
        type: "review",
        details: "The mobile experience could be improved. Some buttons are hard to tap and the chat interface feels cramped on smaller screens.",
        status: "pending"
    },
    {
        userEmail: "companion1@example.com",
        type: "review",
        details: "As a companion, I think we need more resources for self-care and preventing burnout. The work is rewarding but emotionally draining.",
        status: "pending"
    },
    {
        userEmail: "user9@example.com",
        type: "profile-report",
        details: "Profile: 507f1f77bcf86cd799439013\nThis account appears to be a bot - posting generic responses to every thread.",
        status: "resolved"
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Get a random user to assign as author (or create a dummy user if none exist)
        let users = await User.find().limit(5);
        
        if (users.length === 0) {
            console.log('⚠️  No users found in database. Please create some users first!');
            process.exit(1);
        }

        console.log(`Found ${users.length} users in database`);

        // Clear existing dummy data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing posts and reports...');
        await Post.deleteMany({});
        await Report.deleteMany({});

        // Insert posts with random authors
        console.log('📝 Creating dummy posts...');
        const postsToInsert = dummyPosts.map(post => ({
            ...post,
            author: users[Math.floor(Math.random() * users.length)]._id,
            upvotes: [],
            comments: []
        }));

        const createdPosts = await Post.insertMany(postsToInsert);
        console.log(`✅ Created ${createdPosts.length} posts`);

        // Add some random comments to posts
        console.log('💬 Adding comments to posts...');
        const comments = [
            "Thank you for sharing this. It really helps to know I'm not alone.",
            "This is so inspiring! Keep up the great work!",
            "I can relate to this so much. Sending you positive vibes!",
            "Have you tried talking to a therapist about this?",
            "I'm going through something similar. Would love to connect.",
            "This is exactly what I needed to hear today. Thank you!",
            "Stay strong! You've got this! 💪",
            "Really appreciate you opening up about this."
        ];

        for (let post of createdPosts) {
            // Add 0-3 random comments to each post
            const numComments = Math.floor(Math.random() * 4);
            for (let i = 0; i < numComments; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                
                post.comments.push({
                    user: randomUser._id,
                    content: randomComment,
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
                });
            }

            // Add random upvotes (0-4 upvotes per post)
            const numUpvotes = Math.floor(Math.random() * 5);
            const upvoters = new Set();
            while (upvoters.size < numUpvotes && upvoters.size < users.length) {
                upvoters.add(users[Math.floor(Math.random() * users.length)]._id);
            }
            post.upvotes = Array.from(upvoters);

            await post.save();
        }
        console.log('✅ Added comments and upvotes to posts');

        // Insert reports
        console.log('📋 Creating dummy reports...');
        const createdReports = await Report.insertMany(dummyReports);
        console.log(`✅ Created ${createdReports.length} reports`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log(`\nSummary:
        - Posts created: ${createdPosts.length}
        - Reports created: ${createdReports.length}
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
