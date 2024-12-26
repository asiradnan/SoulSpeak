import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import { AlertCircle, Send, Loader } from 'lucide-react';

interface Message {
    _id: string;
    content: string;
    sender: string;
    timestamp: string;
}

interface User {
    _id: string;
    username: string;
    isOnline?: boolean;
    isCompanion: boolean; // Add this field
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
    const socket = useRef<any>();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const [showCompanions, setShowCompanions] = useState(false);
    const [companions, setCompanions] = useState<User[]>([]);

    const fetchCompanions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/companions");
            setCompanions(response.data);
        } catch (error) {
            setError('Failed to fetch companions');
        }
    };
    const startCompanionChat = async (companionId: string) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/chat/create", { participantId: companionId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log(response.data);
            setChats(prev => [...prev, response.data]);
            setShowCompanions(false);
        } catch (error) {
            setError('Failed to start chat with companion');
        }
    };

    useEffect(() => {
        initializeChat();
        return () => {
            socket.current?.disconnect();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        scrollToBottom();

    }, [currentChat?.messages]);

    const currentChatRef = useRef<Chat | null>(null);

useEffect(() => {
    currentChatRef.current = currentChat; // Keep the ref updated
}, [currentChat]);

    useEffect(() => {
        if (currentChat?._id && socket.current) {
            console.log('Joining chat room:', currentChat._id);
            socket.current.emit('join', currentChat._id);
        }
    }, [currentChat]);
    
    const initializeChat = async () => {
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
        socket.current = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        socket.current.on('newMessage', ({ chatId, message }) => {
            console.log('Calling updateChatWithNewMessage');
            updateChatWithNewMessage(chatId, message);
        });
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:5000/profile", {
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
            const response = await axios.get<Chat[]>("http://localhost:5000/chat/", {
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
                "http://localhost:5000/chat/send",
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
            socket.current.emit('stopTyping', currentChat._id);
        } catch (error) {
            setError('Failed to send message. Please try again.');
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="flex items-center space-x-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Chat list */}
            <div className="w-1/3 border-r bg-white overflow-y-auto">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Chats</h2>
                    {currentUser && !currentUser.isCompanion && (
                        <button
                            onClick={() => {
                                setShowCompanions(true);
                                fetchCompanions();
                            }}
                            className="mt-2 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Find Companions
                        </button>
                    )}
                </div>
                {/* Show companions list or chats */}
                {showCompanions ? (
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Available Companions</h3>
                            <button
                                onClick={() => setShowCompanions(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Back to Chats
                            </button>
                        </div>
                        {companions.map(companion => (
                            <div
                                key={companion._id}
                                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => startCompanionChat(companion._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{companion.username}</p>
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
                                onClick={() => {
                                    console.log(chat._id)
                                    setCurrentChat(chat)
                                }}
                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${currentChat?._id === chat._id ? 'bg-gray-50' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{otherParticipant?.username}</span>
                                    {chat.lastMessage && (
                                        <span className="text-xs text-gray-500">
                                            {format(new Date(chat.lastMessage.timestamp || Date.now()), 'HH:mm')}
                                        </span>
                                    )}
                                </div>
                                {chat.lastMessage && (
                                    <p className="text-sm text-gray-500 truncate">
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
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {currentChat.participants.find(
                                    p => p._id !== currentUser?._id
                                )?.username}
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {currentChat.messages.map(msg => (
                                <div
                                    key={msg._id}
                                    className={`my-2 max-w-[70%] ${msg.sender === currentUser?._id
                                        ? 'ml-auto'
                                        : ''
                                        }`}
                                >
                                    <div
                                        className={`p-3 rounded-lg ${msg.sender === currentUser?._id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <div
                                        className={`text-xs text-gray-500 mt-1 ${msg.sender === currentUser?._id
                                            ? 'text-right'
                                            : ''
                                            }`}
                                    >
                                        {format(new Date(msg.timestamp || Date.now()), 'HH:mm')}

                                    </div>
                                </div>
                            ))}
                            {typingStatus && typingStatus.chatId === currentChat._id && (
                                <div className="text-sm text-gray-500 italic">
                                    {typingStatus.username} is typing...
                                </div>
                            )}
                            <div ref={messageEndRef} />
                        </div>
                        <form onSubmit={sendMessage} className="p-4 border-t">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={handleMessageInput}
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type a message..."
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;