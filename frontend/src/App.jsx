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


const Home = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        setQuote(response.data.slip.advice);
        const data = response.data;
        console.log('Fetched quote:', data);

      } catch (error) {
        console.log('Error fetching quote:', error);
        setQuote({
          content: 'Welcome to a peaceful space for meaningful connections',
          author: 'SoulSpeak'
        });
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-primary-700 mb-6 text-balance">
            Welcome to SoulSpeak
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed text-balance">
            A peaceful sanctuary for authentic connections and meaningful conversations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 border border-primary-100">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Connect & Chat</h3>
            <p className="text-neutral-600 leading-relaxed">
              Engage in supportive conversations with companions who understand
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 border border-accent-100">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-accent-800 mb-3">Join the Forum</h3>
            <p className="text-neutral-600 leading-relaxed">
              Share experiences and insights in our supportive community space
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-100">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-800 mb-3">Grow Together</h3>
            <p className="text-neutral-600 leading-relaxed">
              Access resources and training to become a compassionate companion
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-10 rounded-4xl shadow-medium border border-primary-200/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">Daily Wisdom</h3>
                <p className="text-lg text-neutral-700 italic leading-relaxed">
                  {quote ? `"${quote}"` : 'Loading inspiration...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 backdrop-blur-lg border-b border-primary-700/20 shadow-medium sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-white text-2xl font-display font-bold hover:text-primary-100 transition-all duration-300 flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
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
                <Link to="/login" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Login
                </Link>
                <Link to="/signup" className="bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-white/20">
                  Sign Up
                </Link>

              </>
            ) : (
              <>
                {user && !user.isCompanion && (
                <Link to="/become-a-companion" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Become A Companion
                </Link>
                )}
                <Link to="/chat" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Chat
                </Link>
                <Link to="/forum" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Forum
                </Link>
                <Link to="/report" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Report
                </Link>
                <Link to="/profile" className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </nav>


      <div className="bg-gradient-to-br from-primary-50 via-neutral-50 to-sage-50 min-h-screen">
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
