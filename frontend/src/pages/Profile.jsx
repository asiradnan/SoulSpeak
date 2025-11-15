import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api";
import { 
    constructImageUrl, 
    validateImageFile, 
    createImagePreview, 
    DEFAULT_PROFILE_IMAGE 
} from "../utils/imageUtils";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [imageRetryCount, setImageRetryCount] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        newPassword: "",
        referral: "",
        mentalCondition: "",
        ageGroup: "",
        country: "",
        goals: "",
        preferences: ""
    });

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setError(null);
        
        if (!file) {
            setProfilePicture(null);
            setImagePreview(null);
            return;
        }

        // Validate the file
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setError(validation.error);
            setProfilePicture(null);
            setImagePreview(null);
            return;
        }

        setProfilePicture(file);

        try {
            const preview = await createImagePreview(file);
            setImagePreview(preview);
        } catch (err) {
            setError("Failed to create image preview");
            setProfilePicture(null);
            setImagePreview(null);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (!profilePicture) return;
        
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('image', profilePicture);
        
        setIsUploading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/upload-profile-picture`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            
            if (response.data.imageUrl) {
                const newImageUrl = constructImageUrl(response.data.imageUrl);
                setProfileImageUrl(newImageUrl);
                setProfile({ ...profile, imageUrl: response.data.imageUrl });
                setSuccess("Profile picture updated successfully!");
                setImagePreview(null);
                setProfilePicture(null);
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Upload error:', err);
            
            // Handle specific error messages from backend
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError("Please log in again to upload your profile picture.");
            } else if (err.response?.status === 400) {
                setError("Invalid file. Please select a valid image file under 5MB.");
            } else {
                setError("Failed to upload profile picture. Please try again.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleVerifyEmail = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(`${API_URL}/verify-email`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setError(null);
            setSuccess("Verification email sent! Please check your inbox.");
        } catch (err) {
            setError("Failed to send verification email. Please try again.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to view this page.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = response.data.user;
                setProfile(user);
                setFormData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    referral: user.referral,
                    mentalCondition: user.mentalCondition,
                    ageGroup: user.ageGroup,
                    country: user.country,
                    goals: user.goals,
                    preferences: user.preferences,
                    password: "",
                    newPassword: "",
                });
                setError(null);
                
                try {
                    const response2 = await axios.get(`${API_URL}/profile-picture`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response2.data.imageUrl) {
                        setProfileImageUrl(constructImageUrl(response2.data.imageUrl));
                    }
                } catch (imgErr) {
                    console.log('No profile picture found or error fetching it');
                    // Set to null if no picture is found, will show default placeholder
                    setProfileImageUrl(null);
                }
            } catch (err) {
                setError("Failed to load profile. Please log in again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        
        setError(null);
        setSuccess(null);
        
        try {
            // First update profile data
            const response = await axios.put(`${API_URL}/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Then handle profile picture if one was selected
            if (profilePicture) {
                try {
                    await handleProfilePictureUpload();
                } catch (uploadErr) {
                    console.error('Failed to upload profile picture:', uploadErr);
                    setError("Profile updated, but failed to upload new picture. Please try again.");
                    // Scroll to top to show error
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return; // Don't set success if image upload failed
                }
            }
            
            // Update local state with the new profile data
            const updatedProfile = response.data.user;
            setProfile(updatedProfile);
            setIsEditing(false);
            setSuccess("Profile updated successfully!");
            
            // Reset form password fields
            setFormData({
                ...formData,
                name: updatedProfile.name,
                username: updatedProfile.username,
                email: updatedProfile.email,
                password: "",
                newPassword: "",
            });
            
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Invalid data. Please check your inputs.");
            } else {
                setError("Failed to update profile. Please try again.");
            }
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Your Profile</h1>
                    <p className="text-secondary-600">Manage your account information and preferences</p>
                </div>

                {error && (
                    <div className="mb-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg flex items-start gap-3 max-w-2xl mx-auto">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-start gap-3 max-w-2xl mx-auto">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden max-w-2xl mx-auto">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center text-white relative">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 mx-auto mb-4 relative">
                                <img
                                    src={imagePreview || profileImageUrl || DEFAULT_PROFILE_IMAGE}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                                    onLoad={() => {
                                        setImageLoadError(false);
                                        setImageRetryCount(0);
                                    }}
                                    onError={(e) => {
                                        console.log('Image failed to load:', e.target.src);
                                        setImageLoadError(true);
                                        
                                        // Try to retry loading the original image once
                                        if (imageRetryCount < 1 && profileImageUrl && e.target.src !== DEFAULT_PROFILE_IMAGE) {
                                            setImageRetryCount(prev => prev + 1);
                                            setTimeout(() => {
                                                e.target.src = profileImageUrl;
                                            }, 1000);
                                        } else {
                                            e.target.src = DEFAULT_PROFILE_IMAGE;
                                        }
                                    }}
                                />
                                
                                {/* Fallback for when no image is available */}
                                {!imagePreview && !profileImageUrl && (
                                    <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center shadow-lg">
                                        <div className="text-primary-600 text-2xl font-bold">
                                            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Loading error indicator with retry */}
                                {imageLoadError && profileImageUrl && (
                                    <button
                                        onClick={() => {
                                            setImageLoadError(false);
                                            setImageRetryCount(0);
                                            // Force image reload by adding timestamp
                                            const img = document.querySelector('img[alt="Profile"]');
                                            if (img) {
                                                const originalSrc = profileImageUrl;
                                                img.src = `${originalSrc}?refresh=${Date.now()}`;
                                            }
                                        }}
                                        className="absolute top-1 right-1 bg-warning-500 hover:bg-warning-600 text-white rounded-full p-1 transition-colors duration-200"
                                        title="Retry loading image"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                                
                                {isEditing && (
                                    <label className="absolute bottom-2 right-2 bg-primary-800 hover:bg-primary-900 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg z-10">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </label>
                                )}
                                
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            
                            {imagePreview && !isUploading && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    <button
                                        onClick={handleProfilePictureUpload}
                                        className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 text-sm"
                                    >
                                        Upload Photo
                                    </button>
                                    <button
                                        onClick={() => {
                                            setImagePreview(null);
                                            setProfilePicture(null);
                                        }}
                                        className="px-3 py-2 bg-error-600 hover:bg-error-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            
                            {isUploading && (
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-primary-700 font-semibold rounded-lg shadow-lg text-sm">
                                    Uploading...
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{profile?.name}</h3>
                        <p className="text-primary-100">@{profile?.username}</p>
                    </div>

                    {!isEditing ? (
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <p className="text-secondary-900">{profile?.email}</p>
                                            {profile?.verified ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Verified
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={handleVerifyEmail}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded-full hover:bg-warning-200 transition-colors duration-200"
                                                >
                                                    Verify Email
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Age Group</label>
                                        <p className="text-secondary-900">{profile?.ageGroup || 'Not specified'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Country</label>
                                        <p className="text-secondary-900">{profile?.country || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">How You Found Us</label>
                                        <p className="text-secondary-900">{profile?.referral || 'Not specified'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Mental Health Focus</label>
                                        <p className="text-secondary-900">{profile?.mentalCondition || 'Not specified'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Companion Status</label>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            profile?.isCompanion 
                                                ? 'bg-violet-100 text-violet-700' 
                                                : 'bg-secondary-100 text-secondary-700'
                                        }`}>
                                            {profile?.isCompanion ? 'Certified Companion' : 'Member'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Goals</label>
                                    <div className="bg-secondary-50 rounded-lg p-4">
                                        <p className="text-secondary-700">{profile?.goals || 'No goals specified yet.'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">Preferences</label>
                                    <div className="bg-secondary-50 rounded-lg p-4">
                                        <p className="text-secondary-700">{profile?.preferences || 'No preferences specified yet.'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Choose a username"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                placeholder="Enter your country"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Personal Details</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">How did you find us?</label>
                                            <select
                                                name="referral"
                                                value={formData.referral}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">Select an option</option>
                                                <option value="Social Media">Social Media</option>
                                                <option value="Friend/Family Recommendation">Friend/Family Recommendation</option>
                                                <option value="Healthcare Provider">Healthcare Provider</option>
                                                <option value="Online Search">Online Search</option>
                                                <option value="Advertisement">Advertisement</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Age Group</label>
                                            <select
                                                name="ageGroup"
                                                value={formData.ageGroup}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">Select age group</option>
                                                <option value="Under 18">Under 18</option>
                                                <option value="18-24">18-24</option>
                                                <option value="25-34">25-34</option>
                                                <option value="35-44">35-44</option>
                                                <option value="45-54">45-54</option>
                                                <option value="55+">55+</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Mental Health Focus</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-2">Primary Focus Area</label>
                                        <select
                                            name="mentalCondition"
                                            value={formData.mentalCondition}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="">Select your primary focus</option>
                                            <option value="Anxiety">Anxiety</option>
                                            <option value="Depression">Depression</option>
                                            <option value="PTSD">PTSD</option>
                                            <option value="Bipolar Disorder">Bipolar Disorder</option>
                                            <option value="OCD">OCD</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Goals & Preferences</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Your Goals</label>
                                            <textarea
                                                name="goals"
                                                value={formData.goals}
                                                onChange={handleChange}
                                                placeholder="What are you hoping to achieve?"
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Communication Preferences</label>
                                            <textarea
                                                name="preferences"
                                                value={formData.preferences}
                                                onChange={handleChange}
                                                placeholder="How would you prefer to communicate and interact?"
                                                rows={3}
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-vertical"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Security</h4>
                                    <p className="text-sm text-secondary-600 mb-4">To change your password or email, you need to enter your current password for security verification.</p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter current password"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-secondary-700 mb-2">New Password (Optional)</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                className="w-full px-4 py-3 border-2 border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    {(formData.newPassword || formData.email !== profile?.email) && (
                                        <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded-lg text-sm text-info-700">
                                            ℹ️ Current password is required to save changes to your security settings.
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setImagePreview(null);
                                            setProfilePicture(null);
                                            setError(null);
                                            setSuccess(null);
                                        }}
                                        className="flex-1 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold rounded-lg transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
