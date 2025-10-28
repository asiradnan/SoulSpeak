import API_URL from '../config/api';

/**
 * Constructs a proper image URL from the API URL and image path
 * @param {string} imagePath - The image path from the server (e.g., '/uploads/image.jpg')
 * @returns {string} - The complete image URL
 */
export const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If imagePath is already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Remove trailing slash from API_URL and leading slash from imagePath if present
    const baseUrl = API_URL.replace(/\/$/, '');
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${baseUrl}${path}`;
};

/**
 * Validates image file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }
    
    if (!allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' 
        };
    }
    
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: 'File too large. Please upload an image smaller than 5MB.' 
        };
    }
    
    return { isValid: true, error: null };
};

/**
 * Creates a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - Promise that resolves to the preview URL
 */
export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Default placeholder image URL
 */
export const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150/4F46E5/FFFFFF?text=Profile";