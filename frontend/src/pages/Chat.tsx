import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, Send, Loader } from 'lucide-react';
import { SOCKET_URL } from '../config/api';
import API_URL from '../config/api';

interface Message {
    _id: string;
    content: string;
    sender: string | User;
    timestamp: string;
}

interface User {
    _id: string;
    username: string;
    isOnline?: boolean;
    isCompanion: boolean;
}

interface Chat {
    _id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
}

interface TypingStatus {
    chatId: string;
    userId: string;
    username: string;
}

const Chat: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typingStatus, setTypingStatus] = useState<TypingStatus | null>(null);
    const [showCompanions, setShowCompanions] = useState(false);
    const [companions, setCompanions] = useState<User[]>([]);
    const socket = useRef<any>();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const currentChatRef = useRef<Chat | null>(null);

    const fetchCompanions = async () => {
        try {
            const response = await axios.get(`${API_URL}/companions`);
            setCompanions(response.data);
        } catch (error) {
            setError('Failed to fetch companions');
        }
    };
    const startCompanionChat = async (companionId: string) => {
        try {
            const response = await axios.post(
                `${API_URL}/chat/create`,
                { participantId: companionId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            // Set current chat immediately
            setCurrentChat(response.data);
            
            // Add to chats list if not already present
            setChats(prevChats => {
                const chatExists = prevChats.some(chat => chat._id === response.data._id);
                if (chatExists) {
                    return prevChats;
                }
                return [...prevChats, response.data];
            });
            
            setShowCompanions(false);
        } catch (error) {
            setError('Failed to start chat with companion');
        }
    };
    

    useEffect(() => {
        initializeChat();
        return () => {
            // Clear typing indicator when component unmounts
            if (currentChat && socket.current) {
                socket.current.emit('stopTyping', { chatId: currentChat._id });
            }
            socket.current?.disconnect();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();

    }, [currentChat?.messages]);


useEffect(() => {
    currentChatRef.current = currentChat; // Keep the ref updated
}, [currentChat]);

useEffect(() => {
    if (currentChat?._id && socket.current) {
        console.log('Joining chat room:', currentChat._id);
        socket.current.emit('join', currentChat._id);
        
        // Clear typing indicator and message when switching chats
        setMessage('');
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }
}, [currentChat]);    const initializeChat = async () => {
        try {
            setIsLoading(true);
            await fetchCurrentUser();
            await fetchChats();
            initializeSocket();
        } catch (err) {
            setError('Failed to initialize chat. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const initializeSocket = () => {
        socket.current = io(SOCKET_URL, {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        socket.current.on('connect', () => {
            console.log('Socket connected successfully');
            setError(null);
        });

        socket.current.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error);
            setError('Failed to connect to chat server. Please check your connection.');
        });

        socket.current.on('error', (error: Error) => {
            console.error('Socket error:', error);
            setError('An error occurred with the chat connection.');
        });

        socket.current.on('newChat', (chat: Chat) => {
            console.log('New chat received:', chat);
            setChats(prevChats => {
                // Check if chat already exists
                const exists = prevChats.some(existingChat => 
                    existingChat._id === chat._id
                );
                
                if (!exists) {
                    return [...prevChats, chat];
                }
                
                // Update existing chat if it exists
                return prevChats.map(existingChat => 
                    existingChat._id === chat._id ? chat : existingChat
                );
            });
        });

        socket.current.on('newMessage', ({ chatId, message }: { chatId: string; message: Message }) => {
            console.log('New message received:', { chatId, message });
            updateChatWithNewMessage(chatId, message);
        });

        socket.current.on('typing', ({ chatId, username, userId }: { chatId: string; username: string; userId: string }) => {
            if (userId !== currentUser?._id) {
                setTypingStatus({ chatId, userId, username });
            }
        });

        socket.current.on('stopTyping', ({ chatId }: { chatId: string }) => {
            setTypingStatus(prev => 
                prev && prev.chatId === chatId ? null : prev
            );
        });

        socket.current.on('userOnline', ({ userId }: { userId: string }) => {
            // Update user online status in chats
            setChats(prevChats =>
                prevChats.map(chat => ({
                    ...chat,
                    participants: chat.participants.map(p =>
                        p._id === userId ? { ...p, isOnline: true } : p
                    )
                }))
            );
        });

        socket.current.on('userOffline', ({ userId }: { userId: string }) => {
            // Update user offline status in chats
            setChats(prevChats =>
                prevChats.map(chat => ({
                    ...chat,
                    participants: chat.participants.map(p =>
                        p._id === userId ? { ...p, isOnline: false } : p
                    )
                }))
            );
        });
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCurrentUser(response.data.user);
            console.log(response.data.user);
        } catch (error) {
            throw new Error('Failed to fetch user data');
        }
    };

    const fetchChats = async () => {
        try {
            const response = await axios.get<Chat[]>(`${API_URL}/chat/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setChats(response.data);
            console.log(response.data);
        } catch (error) {
            throw new Error('Failed to fetch chats');
        }
    };

    const updateChatWithNewMessage = (chatId: string, message: Message) => {
        const activeChat = currentChatRef.current;

    console.log('Message update triggered');
    console.log('Active chat state:', activeChat);
    console.log('Incoming chatId:', chatId);
    console.log('Incoming message:', message);

        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? { ...chat, messages: [...chat.messages, message], lastMessage: message }
                    : chat
            )
        );

        if (activeChat?._id === chatId) {
            console.log('Received new message:', message);
            setCurrentChat(prev => ({
                ...prev!,
                messages: [...prev!.messages, message],
                lastMessage: message
            }));
        }
    };

    const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (currentChat) {
            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Emit typing status
            socket.current.emit('typing', {
                chatId: currentChat._id,
                userId: currentUser?._id,
                username: currentUser?.username
            });

            // Set new timeout to stop typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.current.emit('stopTyping', currentChat._id);
            }, 2000);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !currentChat || !currentUser) return;

        try {
            const response = await axios.post(
                `${API_URL}/chat/send`,
                {
                    chatId: currentChat._id,
                    content: message
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            console.log(response.data);
            setMessage('');
            // Clear typing indicator when message is sent
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            socket.current.emit('stopTyping', { chatId: currentChat._id });
        } catch (error) {
            setError('Failed to send message. Please try again.');
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex items-center space-x-2 text-red-600 bg-white px-6 py-4 rounded-lg shadow-sm border border-red-200">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Chat list */}
            <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Messages</h2>
                    {currentUser && !currentUser.isCompanion && (
                        <button
                            onClick={() => {
                                setShowCompanions(true);
                                fetchCompanions();
                            }}
                            className="mt-3 w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Find Companions
                        </button>
                    )}
                </div>
                {showCompanions ? (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Available Companions</h3>
                            <button
                                onClick={() => setShowCompanions(false)}
                                className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Back to Chats
                            </button>
                        </div>
                        {companions.map(companion => (
                            <div
                                key={companion._id}
                                className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => startCompanionChat(companion._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{companion.username}</p>
                                        <p className="text-sm text-gray-500">Companion</p>
                                    </div>
                                    {companion.isOnline && (
                                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    chats.map(chat => {
                        const otherParticipant = chat.participants.find(
                            p => p._id !== currentUser?._id
                        );
                        return (
                            <div
                                key={chat._id}
                                onClick={() => setCurrentChat(chat)}
                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 transition-colors ${
                                    currentChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">
                                        {otherParticipant?.username}
                                    </span>
                                    {chat.lastMessage && (
                                        <span className="text-xs text-gray-500">
                                            {format(new Date(chat.lastMessage.timestamp || Date.now()), 'HH:mm')}
                                        </span>
                                    )}
                                </div>
                                {chat.lastMessage && (
                                    <p className="text-sm text-gray-600 truncate mt-1">
                                        {chat.lastMessage.content}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
    
            {/* Chat messages */}
            <div className="w-2/3 flex flex-col bg-white">
                {currentChat ? (
                    <>
                        <div className="p-6 border-b border-gray-200 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {currentChat.participants.find(
                                        p => p._id !== currentUser?._id
                                    )?.username}
                                </h3>
                                <span className='text-xs text-gray-400'>Chat ID: {currentChat._id}</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {currentChat.messages.map(msg => {
                                const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                                const isCurrentUser = senderId === currentUser?._id;
                                return (
                                <div
                                    key={msg._id}
                                    className={`my-2 max-w-[70%] ${isCurrentUser ? 'ml-auto' : ''}`}
                                >
                                    <div
                                        className={`p-3 rounded-lg ${
                                            isCurrentUser
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <div
                                        className={`text-xs text-gray-500 mt-1 ${
                                            isCurrentUser ? 'text-right' : ''
                                        }`}
                                    >
                                        {format(new Date(msg.timestamp || Date.now()), 'HH:mm')}
                                    </div>
                                </div>
                            );
                            })}
                            {typingStatus && typingStatus.chatId === currentChat._id && (
                                <div className="text-sm text-gray-500 italic">
                                    {typingStatus.username} is typing...
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>
                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={handleMessageInput}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default Chat;