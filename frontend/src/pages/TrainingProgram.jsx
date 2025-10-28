import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const TrainingProgram = () => {
    const [questions, setQuestions] = useState([]);
    const [completedModules, setCompletedModules] = useState(new Set());
    const [expandedModule, setExpandedModule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
        
        // Load completed modules from localStorage
        const saved = localStorage.getItem('completedTrainingModules');
        if (saved) {
            setCompletedModules(new Set(JSON.parse(saved)));
        }
    }, []);

    const toggleModuleCompletion = (index) => {
        const newCompleted = new Set(completedModules);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedModules(newCompleted);
        localStorage.setItem('completedTrainingModules', JSON.stringify([...newCompleted]));
    };

    const progressPercentage = questions.length > 0 ? (completedModules.size / questions.length) * 100 : 0;

    const trainingModules = [
        {
            title: "Understanding Mental Health",
            description: "Learn the fundamentals of mental health, common conditions, and how to provide non-judgmental support.",
            icon: "🧠",
            duration: "15 min",
            topics: ["Mental health basics", "Common conditions", "Reducing stigma", "Signs to watch for"]
        },
        {
            title: "Active Listening Skills", 
            description: "Master the art of active listening to create safe spaces for meaningful conversations.",
            icon: "👂",
            duration: "20 min",
            topics: ["Listening techniques", "Non-verbal communication", "Asking open questions", "Reflecting emotions"]
        },
        {
            title: "Empathy & Compassion",
            description: "Develop empathy skills to connect authentically while maintaining healthy boundaries.",
            icon: "❤️",
            duration: "18 min",
            topics: ["Understanding empathy", "Compassionate responses", "Avoiding judgment", "Self-compassion"]
        },
        {
            title: "Crisis Recognition",
            description: "Learn to identify crisis situations and know when to escalate to professional help.",
            icon: "🚨",
            duration: "25 min",
            topics: ["Warning signs", "Risk assessment", "When to escalate", "Emergency resources"]
        },
        {
            title: "Effective Communication",
            description: "Build communication skills for sensitive topics and difficult conversations.",
            icon: "💬",
            duration: "22 min",
            topics: ["Clear communication", "Difficult conversations", "Cultural sensitivity", "Setting expectations"]
        },
        {
            title: "Self-Care & Boundaries",
            description: "Maintain your own wellbeing while supporting others through proper self-care and boundaries.",
            icon: "🛡️",
            duration: "20 min",
            topics: ["Setting boundaries", "Preventing burnout", "Self-care strategies", "Professional limits"]
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-violet-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary-600">Loading training materials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-violet-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-600 to-violet-700 rounded-full mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                        SoulSpeak Training Program
                    </h1>
                    <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                        Master essential skills for mental health support through our comprehensive training modules. 
                        Build empathy, communication skills, and learn when to provide support or seek professional help.
                    </p>
                </div>

                {/* Progress Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-8 mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900">Your Progress</h2>
                            <p className="text-secondary-600">Complete all modules to unlock companion certification</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-violet-600">{Math.round(progressPercentage)}%</div>
                            <div className="text-sm text-secondary-500">{completedModules.size} of {trainingModules.length} modules</div>
                        </div>
                    </div>
                    
                    <div className="w-full bg-secondary-200 rounded-full h-3 mb-4">
                        <div 
                            className="bg-gradient-to-r from-violet-600 to-violet-700 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    
                    {progressPercentage === 100 && (
                        <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <div className="font-semibold text-success-900">Training Complete!</div>
                                    <div className="text-success-700 text-sm">You're ready to take the companion assessment.</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Training Modules */}
                <div className="space-y-6 mb-12">
                    {trainingModules.map((module, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="text-3xl">{module.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary-900">{module.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-secondary-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {module.duration}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        {module.topics.length} topics
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-secondary-600 mb-4">{module.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {module.topics.map((topic, topicIndex) => (
                                                <span key={topicIndex} className="px-3 py-1 bg-violet-100 text-violet-700 text-sm rounded-full">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3">
                                        {completedModules.has(index) && (
                                            <div className="flex items-center gap-1 text-success-600 text-sm font-medium">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Completed
                                            </div>
                                        )}
                                        
                                        <button
                                            onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                            className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-lg transition-colors duration-200"
                                        >
                                            {expandedModule === index ? 'Hide Details' : 'View Details'}
                                        </button>
                                        
                                        <button
                                            onClick={() => toggleModuleCompletion(index)}
                                            className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
                                                completedModules.has(index)
                                                    ? 'bg-success-100 text-success-700 hover:bg-success-200'
                                                    : 'bg-violet-600 text-white hover:bg-violet-700'
                                            }`}
                                        >
                                            {completedModules.has(index) ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button>
                                    </div>
                                </div>
                                
                                {expandedModule === index && (
                                    <div className="mt-6 pt-6 border-t border-secondary-200">
                                        <div className="bg-gradient-to-r from-violet-50 to-secondary-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-secondary-900 mb-3">Module Content:</h4>
                                            <div className="space-y-3">
                                                {questions[index] ? (
                                                    <div>
                                                        <p className="text-secondary-700 mb-4">{questions[index].question}</p>
                                                        {questions[index].resource && (
                                                            <div>
                                                                <h5 className="font-medium text-secondary-900 mb-2">Additional Resources:</h5>
                                                                <a 
                                                                    href={questions[index].resource} 
                                                                    target='_blank' 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 font-medium transition-colors duration-200"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                    View External Resource
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-secondary-600">
                                                        This module covers essential knowledge for mental health companions including 
                                                        theoretical concepts, practical applications, and real-world scenarios.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Section */}
                <div className="text-center">
                    <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-8">
                        <h3 className="text-2xl font-bold text-secondary-900 mb-4">Ready for Assessment?</h3>
                        <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
                            Once you've completed all training modules, take the companion assessment to earn your certification 
                            and start helping others in the SoulSpeak community.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/become-a-companion"
                                className={`px-8 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                                    progressPercentage === 100
                                        ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800'
                                        : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                                }`}
                                onClick={(e) => progressPercentage !== 100 && e.preventDefault()}
                            >
                                {progressPercentage === 100 ? 'Take Assessment' : `Complete ${trainingModules.length - completedModules.size} More Modules`}
                            </Link>
                            
                            <button
                                onClick={() => {
                                    setCompletedModules(new Set());
                                    localStorage.removeItem('completedTrainingModules');
                                }}
                                className="px-6 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-xl transition-colors duration-200"
                            >
                                Reset Progress
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingProgram;
