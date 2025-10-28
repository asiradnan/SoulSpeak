import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Question from './models/questionModel.js';

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

// Companion Assessment Questions
const companionQuestions = [
    {
        question: "A user tells you they're having suicidal thoughts. What is your most appropriate immediate response?",
        option1: "Listen empathetically and suggest they talk to a professional counselor immediately",
        option2: "Tell them everything will be okay and share your own struggles",
        option3: "Ignore the comment and change the subject to something positive",
        option4: "Give them advice on how to solve their problems",
        correct: "0",
        resource: "National Suicide Prevention Lifeline: 988"
    },
    {
        question: "What is the most important principle of active listening in mental health support?",
        option1: "Preparing your response while the other person talks",
        option2: "Giving advice and solutions to fix their problems",
        option3: "Being fully present and understanding without judgment",
        option4: "Sharing similar experiences from your own life",
        correct: "2",
        resource: "Active Listening Skills for Mental Health Support"
    },
    {
        question: "When someone shares trauma with you, what should you prioritize?",
        option1: "Creating a safe, non-judgmental space for them to be heard",
        option2: "Asking detailed questions about what happened",
        option3: "Immediately suggesting coping strategies",
        option4: "Sharing your own trauma to help them feel less alone",
        correct: "0",
        resource: "Trauma-Informed Care Principles"
    },
    {
        question: "What does empathy mean in the context of mental health support?",
        option1: "Feeling sorry for someone's situation",
        option2: "Understanding and sharing someone's emotional experience",
        option3: "Giving advice to make someone feel better",
        option4: "Agreeing with everything someone says",
        correct: "1",
        resource: "Understanding Empathy vs Sympathy"
    },
    {
        question: "A user seems to be having a panic attack during your conversation. What should you do?",
        option1: "Tell them to calm down and take deep breaths",
        option2: "Guide them through grounding techniques and stay calm yourself",
        option3: "Immediately end the conversation",
        option4: "Share your own experience with panic attacks",
        correct: "1",
        resource: "Panic Attack Support Techniques - 5-4-3-2-1 Grounding Method"
    },
    {
        question: "What are the boundaries of a peer support companion?",
        option1: "You can provide therapy and professional counseling",
        option2: "You should be available 24/7 for anyone who needs help",
        option3: "You provide emotional support but refer serious issues to professionals",
        option4: "You should solve all of someone's problems for them",
        correct: "2",
        resource: "Understanding Peer Support Boundaries"
    },
    {
        question: "How should you respond when someone asks for your personal information?",
        option1: "Share everything to build trust and connection",
        option2: "Politely maintain boundaries while staying supportive",
        option3: "Ignore the question completely",
        option4: "Make up false information to protect yourself",
        correct: "1",
        resource: "Professional Boundaries in Peer Support"
    },
    {
        question: "What is the best way to handle your own emotional reactions during difficult conversations?",
        option1: "Suppress your emotions completely to stay professional",
        option2: "Share all your emotional reactions with the person",
        option3: "Acknowledge your emotions internally and practice self-care",
        option4: "End conversations that make you uncomfortable",
        correct: "2",
        resource: "Self-Care for Mental Health Supporters"
    },
    {
        question: "When should you recommend someone seek professional help?",
        option1: "Only when they directly ask for professional help",
        option2: "When they mention thoughts of self-harm, suicide, or harming others",
        option3: "Never, as companions should handle everything",
        option4: "Only after trying to solve their problems yourself first",
        correct: "1",
        resource: "When to Refer to Professional Help - Crisis Recognition"
    },
    {
        question: "What is the most important aspect of maintaining confidentiality?",
        option1: "Never discussing anything shared with you with anyone else, except in emergencies",
        option2: "Only sharing information with family members",
        option3: "Sharing information with other companions for advice",
        option4: "Confidentiality doesn't apply to peer support",
        correct: "0",
        resource: "Confidentiality and Privacy in Mental Health Support"
    },
    {
        question: "How can you tell if someone is in immediate danger?",
        option1: "They express vague feelings of sadness",
        option2: "They have a specific plan to harm themselves or others",
        option3: "They mention past difficulties",
        option4: "They seem quiet or withdrawn",
        correct: "1",
        resource: "Crisis Assessment and Warning Signs"
    },
    {
        question: "What is the difference between mental health support and therapy?",
        option1: "There is no difference; they are the same thing",
        option2: "Support is peer-based emotional assistance; therapy is professional treatment",
        option3: "Support is more effective than therapy",
        option4: "Only therapists can provide any form of mental health help",
        correct: "1",
        resource: "Understanding Different Types of Mental Health Support"
    },
    {
        question: "What should you do if you feel emotionally overwhelmed by supporting someone?",
        option1: "Continue without break to show dedication",
        option2: "Tell them they're too much to handle",
        option3: "Take a step back, practice self-care, and seek supervision if needed",
        option4: "Immediately stop all support permanently",
        correct: "2",
        resource: "Preventing Compassion Fatigue and Burnout"
    },
    {
        question: "How should you respond to someone expressing anger during a conversation?",
        option1: "Match their energy and become defensive",
        option2: "Immediately end the conversation",
        option3: "Stay calm, validate their feelings, and set boundaries if needed",
        option4: "Tell them they shouldn't feel angry",
        correct: "2",
        resource: "De-escalation Techniques in Peer Support"
    },
    {
        question: "What is cultural competence in mental health support?",
        option1: "Treating everyone exactly the same regardless of background",
        option2: "Understanding and respecting diverse cultural perspectives on mental health",
        option3: "Only supporting people from your own culture",
        option4: "Avoiding discussions about cultural differences",
        correct: "1",
        resource: "Cultural Sensitivity in Mental Health Care"
    }
];

const seedQuestions = async () => {
    try {
        await connectDB();

        // Clear existing questions
        console.log('🗑️  Clearing existing questions...');
        await Question.deleteMany({});

        // Insert new questions
        console.log('📝 Creating companion assessment questions...');
        const createdQuestions = await Question.insertMany(companionQuestions);
        console.log(`✅ Created ${createdQuestions.length} questions`);

        console.log('\n🎉 Question seeding completed successfully!');
        console.log(`\nSummary:
        - Questions created: ${createdQuestions.length}
        - These questions will be used for the companion certification test
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        process.exit(1);
    }
};

// Run the seed function
seedQuestions();
