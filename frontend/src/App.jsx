import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CompanionText from './pages/CompanionText'
import TrainingProgram from './pages/TrainingProgram'
import Admin from './pages/Admin'
import Forum from './pages/Forum'
import Report from './pages/Report'
import Chat from './pages/Chat'
import ResetPassword from './pages/ResetPassword'

import axios from 'axios'
import API_URL from './config/api'

// Set document title
document.title = 'SoulSpeak - Mental Health Support Community';


const Home = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        setQuote(response.data.slip.advice);
      } catch (error) {
        console.log('Error fetching quote:', error);
        setQuote('Welcome to a peaceful space for meaningful connections');
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-20 w-72 h-72 bg-sage-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-4xl">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200">
                Mental Health Support Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-8 leading-tight">
              Your journey to
              <span className="block text-primary-600">better mental health</span>
              starts here
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-600 mb-12 leading-relaxed max-w-2xl">
              Connect with trained companions, share experiences in a supportive community, and access resources for your wellness journey.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Get Started
              </Link>
              <Link to="/forum" className="px-8 py-4 bg-white hover:bg-secondary-50 text-secondary-700 font-semibold rounded-lg transition-all duration-200 border-2 border-secondary-200 hover:border-secondary-300">
                Explore Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-secondary-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-secondary-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">Safe</div>
              <div className="text-secondary-600">Confidential Space</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">Free</div>
              <div className="text-secondary-600">Core Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            How SoulSpeak helps you
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Professional support and community connection in one place
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl border border-secondary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg h-full">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">One-on-One Chat</h3>
              <p className="text-secondary-600 leading-relaxed">
                Connect with trained companions for private, confidential conversations whenever you need support.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl border border-secondary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg h-full">
              <div className="w-12 h-12 bg-sage-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Community Forum</h3>
              <p className="text-secondary-600 leading-relaxed">
                Share experiences, find answers, and support others in a moderated, judgment-free environment.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl border border-secondary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg h-full">
              <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Become a Companion</h3>
              <p className="text-secondary-600 leading-relaxed">
                Get certified through our training program and help others on their mental health journey.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl border border-secondary-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg h-full">
              <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Safe & Private</h3>
              <p className="text-secondary-600 leading-relaxed">
                Your conversations are encrypted and confidential. Report any concerns to our moderation team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Quote Section */}
      <section className="bg-secondary-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6">
            <svg className="w-12 h-12 text-primary-400 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <p className="text-2xl md:text-3xl font-light leading-relaxed mb-6">
            {quote || 'Loading inspiration...'}
          </p>
          <div className="text-sm text-secondary-400 font-medium tracking-wide uppercase">
            Daily Wisdom
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl overflow-hidden">
          <div className="px-8 py-16 md:p-20 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join thousands who have found support, connection, and growth through SoulSpeak.
            </p>
            <Link to="/signup" className="inline-block px-10 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login';
  }

  return (
    <Router>
      <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-secondary-900 text-2xl font-bold hover:text-primary-600 transition-colors duration-200 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                SoulSpeak
              </Link>
            </div>
            <div className="flex items-center gap-6">

            {!user ? (
              <>
                <Link to="/login" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                  Sign Up
                </Link>

              </>
            ) : (
              <>
                {user && !user.isCompanion && (
                <>
                  <Link to="/training-program" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    Training Program
                  </Link>
                  <Link to="/become-a-companion" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    Become A Companion
                  </Link>
                </>
                )}
                <Link to="/chat" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                  Chat
                </Link>
                <Link to="/forum" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                  Forum
                </Link>
                <Link to="/report" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                  Report
                </Link>
                <Link to="/profile" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </nav>


      <div className="bg-gradient-to-br from-secondary-50/50 via-white to-primary-50/30 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/become-a-companion" element={<CompanionText />} />
          <Route path="/training-program" element={<TrainingProgram />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/report" element={<Report />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
