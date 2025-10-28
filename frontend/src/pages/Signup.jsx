import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    referral: '',
    mentalCondition: '',
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    gender: '',
    country: '',
    goals: '',
    preferences: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const referralOptions = [
    'Social Media',
    'Friend/Family Recommendation',
    'Healthcare Provider',
    'Online Search',
    'Advertisement',
    'Other'
  ];

  const mentalConditionOptions = [
    'Anxiety',
    'Depression',
    'PTSD',
    'Bipolar Disorder',
    'OCD',
    'Prefer not to say',
    'Other'
  ];

  const ageGroupOptions = [
    'Under 18',
    '18-24',
    '25-34',
    '35-44',
    '45-54',
    '55+',
  ];

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const goalOptions = [
    'Improve mental health',
    'Manage stress',
    'Build resilience',
    'Enhance relationships',
    'Boost productivity',
    'Other',
  ];

  const preferenceOptions = [
    'Text-based communication',
    'Video calls',
    'In-person sessions',
    'No preference'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    const requiredFields = {
      1: 'referral',
      2: 'mentalCondition',
      3: 'ageGroup',
      4: 'gender',
      5: 'country',
      6: 'goals',
      7: 'preferences',
    };

    if (requiredFields[currentStep] && !formData[requiredFields[currentStep]]) {
      setError('Please select an option');
      return;
    }

    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, formData);
      if (response.status === 201) {
        setSuccess('Welcome to SoulSpeak! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const renderOptionButtons = (options, field, title, description) => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">{title}</h3>
        {description && <p className="text-secondary-600 text-sm">{description}</p>}
      </div>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleOptionSelect(field, option)}
            className={`w-full p-4 text-left rounded-lg transition-all duration-200 border-2 font-medium ${
              formData[field] === option
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-white border-secondary-200 text-secondary-700 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {formData[field] === option && (
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderOptionButtons(referralOptions, 'referral', 'How did you find us?', 'Help us understand how you discovered SoulSpeak');
      case 2:
        return renderOptionButtons(mentalConditionOptions, 'mentalCondition', 'What brings you here?', 'This helps us personalize your experience');
      case 3:
        return renderOptionButtons(ageGroupOptions, 'ageGroup', 'What is your age group?', 'We tailor support based on life stages');
      case 4:
        return renderOptionButtons(genderOptions, 'gender', 'How do you identify?', 'This information is kept confidential');
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Where are you from?</h3>
              <p className="text-secondary-600 text-sm">This helps us connect you with relevant resources</p>
            </div>
            <input
              type="text"
              name="country"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        );
      case 6:
        return renderOptionButtons(goalOptions, 'goals', 'What are your goals?', 'Select what matters most to you');
      case 7:
        return renderOptionButtons(preferenceOptions, 'preferences', 'Communication preference?', 'How would you like to connect?');
      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Create your account</h3>
              <p className="text-secondary-600 text-sm">Almost there! Just a few more details</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {[
                { name: 'name', placeholder: 'Full Name', label: 'Full Name', type: 'text' },
                { name: 'username', placeholder: 'Choose a username', label: 'Username', type: 'text' },
                { name: 'email', placeholder: 'you@example.com', label: 'Email Address', type: 'email' },
                { name: 'password', placeholder: 'Create a password', label: 'Password', type: 'password' },
                { name: 'confirmPassword', placeholder: 'Confirm password', label: 'Confirm Password', type: 'password' }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg mt-6 shadow-md">
                Create Account
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">Join SoulSpeak</h2>
          <p className="text-secondary-600">Step {currentStep} of 8</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 p-8">
          {renderStep()}
          {error && <div className="mt-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="mt-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
          {currentStep < 8 && (
            <div className="mt-8 flex gap-3">
              {currentStep > 1 && (
                <button onClick={prevStep} className="flex-1 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-lg">Back</button>
              )}
              <button onClick={nextStep} className={`py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md ${currentStep === 1 ? 'w-full' : 'flex-1'}`}>Continue</button>
            </div>
          )}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
              <div key={step} className={`h-2 rounded-full transition-all ${currentStep === step ? 'w-8 bg-primary-600' : 'w-2 bg-secondary-300'}`} />
            ))}
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-secondary-600">Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
