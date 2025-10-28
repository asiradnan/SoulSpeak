// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Socket.IO URL (same as API URL)
export const SOCKET_URL = API_URL;

export default API_URL;
