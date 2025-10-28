import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
    Home,
    SmilePlus,
    Heart,
    Brain,
    Cloud,
    Sun,
    ChevronRight,
    Send,
    Link as LinkIcon,
    Image,
    ChevronDown,
    Users,
    Search,
    Pencil,
    Trash2,
    ThumbsUp,
    MessageCircle,
    Filter,
    BookOpen
} from 'lucide-react';
import API_URL from '../config/api';


interface Post {
    _id: string;
    content: string;
    imageUrl?: string;
    category: string;
    author: {
        _id: string;
        username: string;
        avatar: string;
    };
    createdAt: string;
    upvotes: string[];
    comments: Array<{
        _id: string;
        user: {
            _id: string;
            username: string;
            avatar: string;
        };
        content: string;
        createdAt: string;
    }>;
}


const Forum = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [postCategory, setPostCategory] = useState<string>('General');

    const categories = ['Welcome Center', 'Mindful Moments', 'Wellness Hub', 'Support Circle', 'General'];

    const [editingPost, setEditingPost] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);



    useEffect(() => {
        fetchPosts();
    }, []);
    const handleUpvote = async (postId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/posts/${postId}/upvote`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    const handleComment = async (postId: string, content: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/posts/${postId}/comments`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPosts();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            console.log('Fetched posts:', response.data);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handlePost = async () => {
        if (!postText.trim()) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('content', postText);
            formData.append('category', postCategory);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await axios.post(`${API_URL}/posts`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setPostText('');
            setSelectedImage(null);
            setImagePreview(null);
            setPostCategory('General');
            await fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    
    const handleEditPost = async (postId: string, content: string) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('content', content);
            formData.append('category', postCategory);

            // Handle image updates
            if (editSelectedImage) {
                formData.append('image', editSelectedImage);
            }
            // Explicitly handle image removal
            if (!editImagePreview) {
                formData.append('removeImage', 'true');
            }

            await axios.put(`${API_URL}/posts/${postId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setEditingPost(null);
            setEditContent('');
            setEditImagePreview(null);
            setEditSelectedImage(null);
            if (editFileInputRef.current) {
                editFileInputRef.current.value = '';
            }

            await fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };



    const handleDeletePost = async (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };
    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('Fetching user...');
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                const response = await axios.get(`${API_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(response.data.user);
                console.log(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);


    return (
                <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Home className="w-6 h-6 text-gray-600" />
                            <h1 className="text-xl font-semibold text-gray-900">Forum</h1>
                        </div>
                        
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
                {/* Left Sidebar */}
                {/* Left Sidebar */}
                <div className="w-64 space-y-4">
                    {/* Community Spaces */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Community Spaces</h3>
                        <div className="space-y-2">
                            {[
                                { name: 'Mental Health', icon: Brain },
                                { name: 'Daily Check-ins', icon: Heart },
                                { name: 'Success Stories', icon: SmilePlus },
                                { name: 'General Chat', icon: Home }
                            ].map((space) => (
                                <div key={space.name} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                    <space.icon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">{space.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wellness Resources */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Resources</h3>
                        <div className="space-y-2">
                            {[
                                {
                                    label: 'Daily Reflections',
                                    icon: Brain,
                                    subItems: [
                                        { name: 'Morning Journal', url: 'https://www.youtube.com/watch?v=MXXs9JC_ItQ' },
                                        { name: 'Evening Check-in', url: 'https://www.youtube.com/watch?v=ncy-I0Ag710' }
                                    ]
                                },
                                {
                                    label: 'Guided Practices',
                                    icon: Heart,
                                    subItems: [
                                        { name: 'Meditation Guide', url: 'https://www.youtube.com/watch?v=vj0JDwQLof4' },
                                        { name: 'Breathing Tutorial', url: 'https://www.youtube.com/watch?v=LiUnFJ8P4gM' }
                                    ]
                                }
                            ].map((item) => (
                                <div key={item.label}>
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                        className="w-full p-2 text-left bg-gray-50 rounded flex justify-between items-center hover:bg-gray-100"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">{item.label}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {openDropdown === item.label && (
                                        <div className="mt-1 ml-4 space-y-1">
                                            {item.subItems.map((subItem) => (
                                                <a
                                                    key={subItem.name}
                                                    href={subItem.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                >
                                                    {subItem.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
            </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Post Creation Box */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users size={18} className="text-gray-600" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <textarea
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                        placeholder="What's on your mind?"
                                        rows={3}
                                    />
                                    
                                    {imagePreview && (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-48 rounded-lg"
                                            />
                                            <button
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            
                                            <select
                                                value={postCategory}
                                                onChange={(e) => setPostCategory(e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                            
                                            <button
                                                onClick={triggerFileInput}
                                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
                                            >
                                                <Image size={16} />
                                                <span>Photo</span>
                                            </button>
                                            
                                            {selectedImage && (
                                                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    {selectedImage.name}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={handlePost}
                                            disabled={isLoading || !postText.trim()}
                                            className={`px-6 py-2 rounded-lg font-medium ${
                                                isLoading || !postText.trim()
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {isLoading ? 'Posting...' : 'Post'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {posts
                            .filter(post => selectedCategory === 'all' || post.category === selectedCategory)
                            .map((post) => (
                                <div key={post._id} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                                {post.author.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{post.author.username}</h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {String(post.author._id) === String(currentUser?._id) && (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => {
                                                        setEditingPost(post._id);
                                                        setEditContent(post.content);
                                                        setEditImagePreview(post.imageUrl ? `${API_URL}${post.imageUrl}` : null);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {editingPost === post._id ? (
                                        <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                                rows={3}
                                                placeholder="Edit your post..."
                                            />
                                            
                                            {/* Current image preview */}
                                            {(post.imageUrl || editImagePreview) && (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={editImagePreview || `${API_URL}${post.imageUrl}`}
                                                        alt="Preview"
                                                        className="max-h-48 rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setEditImagePreview(null);
                                                            setEditSelectedImage(null);
                                                            if (editFileInputRef.current) {
                                                                editFileInputRef.current.value = '';
                                                            }
                                                            const updatedPost = posts.find(p => p._id === editingPost);
                                                            if (updatedPost) {
                                                                updatedPost.imageUrl = '';
                                                            }
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Image upload controls */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    ref={editFileInputRef}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setEditSelectedImage(file);
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setEditImagePreview(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => editFileInputRef.current?.click()}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    <Image size={16} />
                                                    {post.imageUrl || editImagePreview ? "Replace Image" : "Add Image"}
                                                </button>
                                            </div>
                                            
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => {
                                                        setEditingPost(null);
                                                        setEditImagePreview(null);
                                                        setEditSelectedImage(null);
                                                    }}
                                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleEditPost(post._id, editContent)}
                                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-gray-800">{post.content}</p>
                                            {post.imageUrl && (
                                                <img
                                                    src={`${API_URL}${post.imageUrl}`}
                                                    alt="Post attachment"
                                                    className="rounded-lg w-full"
                                                />
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleUpvote(post._id)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                    post.upvotes.includes(currentUser?._id)
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <ThumbsUp size={16} />
                                                <span>{post.upvotes.length}</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                                                className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                    activeCommentPost === post._id
                                                        ? 'text-green-600 bg-green-50'
                                                        : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <MessageCircle size={16} />
                                                <span>{post.comments.length}</span>
                                            </button>
                                        </div>
                                        
                                        {activeCommentPost === post._id && (
                                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                                <div className="flex gap-3 mb-4">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                                                        {currentUser?.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Write a comment..."
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && commentText.trim()) {
                                                                    handleComment(post._id, commentText);
                                                                    setCommentText('');
                                                                    setActiveCommentPost(null);
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex justify-end mt-2">
                                                            <button
                                                                onClick={() => {
                                                                    handleComment(post._id, commentText);
                                                                    setCommentText('');
                                                                    setActiveCommentPost(null);
                                                                }}
                                                                disabled={!commentText.trim()}
                                                                className={`px-4 py-2 rounded-lg text-sm ${
                                                                    commentText.trim()
                                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                }`}
                                                            >
                                                                Comment
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Display existing comments */}
                                                {post.comments.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="text-sm text-gray-600 border-b border-gray-200 pb-2">
                                                            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                                                        </div>
                                                        {post.comments.map((comment, index) => (
                                                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">
                                                                            {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-900 text-sm">{comment.user?.username || 'Anonymous'}</span>
                                                                            <span className="text-xs text-gray-500 ml-2">
                                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {String(comment.user) === String(currentUser?._id) && (
                                                                        <button
                                                                            onClick={() => handleDeleteComment(post._id, comment._id)}
                                                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="mt-2 text-gray-800 text-sm">{comment.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-64 space-y-4">
                    {/* Filter by Category */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`w-full text-left px-3 py-2 rounded text-sm ${
                                    selectedCategory === 'all'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                All Posts
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                                        selectedCategory === category
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Community Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Community</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Posts</span>
                                <span>{posts.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Comments</span>
                                <span>{posts.reduce((acc, post) => acc + post.comments.length, 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
