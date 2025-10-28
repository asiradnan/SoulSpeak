import React, { useState, useEffect } from 'react';

import axios from 'axios';
import API_URL from '../config/api';

const CompanionText = () => {
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Use questions from database
                if (response.data && response.data.length > 0) {
                    // Format questions for the test
                    const formattedQuestions = response.data.map(q => ({
                        question: q.question,
                        option1: [q.option1],
                        option2: [q.option2],
                        option3: [q.option3],
                        option4: [q.option4],
                        correct: parseInt(q.correct)
                    }));
                    setQuestions(formattedQuestions);
                    console.log(`Loaded ${formattedQuestions.length} questions from database`);
                } else {
                    console.warn('No questions found in database');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        
        fetchQuestions();
    }, []);
    
    // const questions = [
    // {
    //     question: "What is the primary purpose of active listening?",
    //     options: [
    //         "To prepare your response",
    //         "To show you're paying attention",
    //         "To understand deeply and empathetically",
    //         "To pass time"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "Which emotion is considered a primary emotion?",
    //     options: [
    //         "Jealousy",
    //         "Fear",
    //         "Guilt",
    //         "Shame"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the first step in effective communication?",
    //     options: [
    //         "Making assumptions",
    //         "Listening actively",
    //         "Speaking loudly",
    //         "Avoiding eye contact"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does EQ stand for?",
    //     options: [
    //         "Educational Quotient",
    //         "Emotional Quotient",
    //         "Energy Quotient",
    //         "Efficiency Quotient"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is an example of a growth mindset?",
    //     options: [
    //         "I’m not good at this, so I’ll give up.",
    //         "I can improve with effort and practice.",
    //         "Failure means I’m not smart.",
    //         "Only talent matters, not hard work."
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does empathy involve?",
    //     options: [
    //         "Feeling sorry for someone",
    //         "Understanding and sharing someone’s feelings",
    //         "Giving advice to someone",
    //         "Agreeing with someone’s perspective"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the most effective way to handle conflict?",
    //     options: [
    //         "Avoid it completely",
    //         "Use open communication and collaboration",
    //         "Blame others for the issue",
    //         "Ignore the other person"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is a sign of self-awareness?",
    //     options: [
    //         "Blaming others for mistakes",
    //         "Understanding your strengths and weaknesses",
    //         "Refusing feedback",
    //         "Avoiding personal growth"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is NOT a primary emotion?",
    //     options: [
    //         "Joy",
    //         "Sadness",
    //         "Pride",
    //         "Anger"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is a key characteristic of active listening?",
    //     options: [
    //         "Interrupting the speaker",
    //         "Making eye contact and nodding",
    //         "Thinking about your next comment",
    //         "Focusing only on facts"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the best way to give constructive feedback?",
    //     options: [
    //         "Focus on the person, not the behavior",
    //         "Use specific and actionable comments",
    //         "Be vague to avoid hurting feelings",
    //         "Focus only on negative aspects"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these describes resilience?",
    //     options: [
    //         "Avoiding challenges",
    //         "Giving up easily",
    //         "Bouncing back from setbacks",
    //         "Focusing on negatives"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is the purpose of mindfulness?",
    //     options: [
    //         "Multitasking efficiently",
    //         "Staying present and aware",
    //         "Ignoring your emotions",
    //         "Planning for the future"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is a strategy for managing stress?",
    //     options: [
    //         "Procrastination",
    //         "Deep breathing and relaxation",
    //         "Blaming others",
    //         "Avoiding all responsibilities"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does the term 'emotional regulation' mean?",
    //     options: [
    //         "Ignoring emotions",
    //         "Understanding and managing your emotions effectively",
    //         "Expressing all emotions openly",
    //         "Suppressing feelings entirely"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is an example of assertive communication?",
    //     options: [
    //         "Yelling to get your point across",
    //         "Avoiding conflict at all costs",
    //         "Clearly stating your needs while respecting others",
    //         "Ignoring others’ perspectives"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is the key benefit of self-reflection?",
    //     options: [
    //         "Boosting self-awareness",
    //         "Reinforcing biases",
    //         "Avoiding responsibility",
    //         "Criticizing yourself constantly"
    //     ],
    //     correct: 0
    // },
    // {
    //     question: "What does body language convey in communication?",
    //     options: [
    //         "Only your verbal message",
    //         "Your feelings and attitudes",
    //         "Nothing significant",
    //         "Your exact words"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is a critical element of emotional intelligence?",
    //     options: [
    //         "Ignoring emotions",
    //         "Understanding and managing emotions",
    //         "Avoiding interactions",
    //         "Reacting impulsively"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these promotes teamwork?",
    //     options: [
    //         "Competition within the team",
    //         "Clear communication and collaboration",
    //         "Avoiding conflict",
    //         "Focusing only on individual goals"
    //     ],
    //     correct: 1
    // }
    // ];


    const handleAnswer = (questionIndex, optionIndex) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: optionIndex
        });
    };

    const makeUserCompanion = async (percentage) => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post(`${API_URL}/companion`, {percentage}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Error registering as companion:', error);
        }
    };
    const handleSubmit = () => {
        setIsLoading(true);
        let finalScore = 0;

        Object.keys(userAnswers).forEach(questionIndex => {
            if (userAnswers[questionIndex] === questions[questionIndex].correct) {
                finalScore += 1;
            }
        });

        setScore(finalScore);
        const percentage = (finalScore / questions.length) * 100;
        if (percentage >= 80) { // Increased threshold for comprehensive assessment
            console.log(`Percentage: ${percentage}%`);
            makeUserCompanion(percentage);
        }
        setShowResult(true);
        setIsLoading(false);
    };

    const renderResultContent = () => {
        const percentage = ((score / questions.length) * 100).toFixed(1);

        if (percentage >= 80) {
            return (
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div>
                        <h3 className="text-3xl font-bold text-secondary-900 mb-3">
                            Congratulations! 🎉
                        </h3>
                        <div className="inline-flex items-center px-4 py-2 bg-success-100 text-success-700 rounded-full font-semibold mb-4">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Certified Companion
                        </div>
                        <p className="text-lg text-secondary-600 leading-relaxed max-w-md mx-auto">
                            You've demonstrated excellent understanding and empathy skills. 
                            You're now ready to support others as a SoulSpeak companion!
                        </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-violet-50 to-success-50 rounded-xl p-6 border border-success-200">
                        <h4 className="font-semibold text-secondary-900 mb-2">What happens next?</h4>
                        <ul className="text-sm text-secondary-600 space-y-1 text-left max-w-sm mx-auto">
                            <li className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Your companion status has been activated
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                You can now help others in the community
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Access to companion resources and support
                            </li>
                        </ul>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                
                <div>
                    <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                        Keep Growing! 🌱
                    </h3>
                    <p className="text-lg text-secondary-600 leading-relaxed max-w-md mx-auto mb-6">
                        We see your potential! Enhance your skills with our comprehensive training program 
                        and try the assessment again.
                    </p>
                </div>
                
                <div className="bg-gradient-to-r from-accent-50 to-sage-50 rounded-xl p-6 border border-accent-200">
                    <h4 className="font-semibold text-secondary-900 mb-3">Recommended next steps:</h4>
                    <div className="space-y-4">
                        <a
                            href="/training-program"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white font-semibold rounded-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Join Training Program
                        </a>
                        
                        <div className="text-sm text-secondary-500">
                            Minimum score required: 80% • Your score: {percentage}%
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-violet-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {!showResult ? (
                    <>
                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-violet-700 rounded-full mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
                                SoulSpeak Companion Assessment
                            </h1>
                            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                                Demonstrate your understanding of mental health support, empathy, and communication skills 
                                to become a certified SoulSpeak companion.
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="mt-8 max-w-md mx-auto">
                                <div className="flex justify-between text-sm text-secondary-600 mb-2">
                                    <span>Progress</span>
                                    <span>{Object.keys(userAnswers).length} of {questions.length}</span>
                                </div>
                                <div className="w-full bg-secondary-200 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-violet-600 to-violet-700 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div className="space-y-8">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-violet-50 to-violet-100 px-8 py-6 border-b border-secondary-100">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-violet-600 text-white rounded-full font-bold">
                                                {qIndex + 1}
                                            </div>
                                            <h3 className="text-xl font-semibold text-secondary-900">
                                                Question {qIndex + 1} of {questions.length}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8">
                                        <p className="text-lg text-secondary-700 mb-6 leading-relaxed">
                                            {q.question}
                                        </p>
                                        
                                        <div className="space-y-3">
                                            {[q.option1[0], q.option2[0], q.option3[0], q.option4[0]].map((option, oIndex) => (
                                                <label
                                                    key={oIndex}
                                                    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                                                        userAnswers[qIndex] === oIndex
                                                            ? 'border-violet-600 bg-violet-50 text-violet-900'
                                                            : 'border-secondary-200 bg-secondary-50 hover:border-violet-300 hover:bg-violet-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        checked={userAnswers[qIndex] === oIndex}
                                                        onChange={() => handleAnswer(qIndex, oIndex)}
                                                        className="w-5 h-5 text-violet-600 focus:ring-violet-500 focus:ring-2"
                                                    />
                                                    <span className="flex-1 text-secondary-700 font-medium">
                                                        {option}
                                                    </span>
                                                    {userAnswers[qIndex] === oIndex && (
                                                        <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Submit Button */}
                            <div className="text-center pt-8">
                                <button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(userAnswers).length !== questions.length || isLoading}
                                    className={`px-12 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg ${
                                        isLoading || Object.keys(userAnswers).length !== questions.length
                                            ? 'bg-secondary-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 hover:shadow-xl transform hover:-translate-y-1'
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing Assessment...
                                        </div>
                                    ) : (
                                        <>
                                            {Object.keys(userAnswers).length === questions.length ? 'Submit Assessment' : `Answer ${questions.length - Object.keys(userAnswers).length} More Questions`}
                                        </>
                                    )}
                                </button>
                                
                                {Object.keys(userAnswers).length < questions.length && (
                                    <p className="text-secondary-500 mt-3">
                                        Please answer all questions before submitting
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-secondary-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-12 text-center text-white">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Assessment Complete!</h2>
                                <div className="text-xl text-violet-100">
                                    Score: {score} out of {questions.length} ({((score/questions.length) * 100).toFixed(1)}%)
                                </div>
                            </div>
                            
                            <div className="p-8">
                                {renderResultContent()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanionText;