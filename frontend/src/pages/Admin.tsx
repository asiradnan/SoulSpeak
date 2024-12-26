import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
    _id: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct: string;
    resource: string;
}

interface Report {
    _id: string;
    userEmail: string;
    timestamp: Date;
    type: 'review' | 'profile-report' | 'chat-report';
    details: string;
    status: 'pending' | 'resolved' | 'rejected';
}


interface User {
    _id: string;
    username: string;
    email: string;
    isCompanion: boolean;
}

interface SuspensionStatus {
    email: string;
    isSuspended: boolean;
}


const Admin = () => {
    const [searchEmail, setSearchEmail] = useState('');
    const [suspensionStatus, setSuspensionStatus] = useState<SuspensionStatus | null>(null);

    const [activeTab, setActiveTab] = useState('questions');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct: '',
        resource: ''
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [reports, setReports] = useState<Report[]>([]);

    const fetchReports = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/reports', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data);
    };

    useEffect(() => {
        if (activeTab === 'questions') {
            fetchQuestions();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'reports') {
            fetchReports();
        }
    }, [activeTab]);

    const handleUpdateStatus = async (reportId: string, newStatus: 'resolved' | 'rejected') => {
        const token = localStorage.getItem("token");
        await axios.patch(
            `http://localhost:5000/admin/reports/${reportId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchReports();
    };

    const fetchQuestions = async () => {
        const response = await axios.get('http://localhost:5000/admin/questions');
        setQuestions(response.data);
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (editingId) {
            await axios.put(`http://localhost:5000/admin/questions/${editingId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } else {
            await axios.post('http://localhost:5000/admin/questions', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        setFormData({
            question: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correct: '',
            resource: ''
        });
        setEditingId(null);
        fetchQuestions();
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/admin/questions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchQuestions();
    };

    const handleEdit = (question: Question) => {
        setFormData({
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            correct: question.correct,
            resource: question.resource
        });
        setEditingId(question._id);
    };
    const checkSuspensionStatus = async () => {
        console.log('Checking suspension status for:', searchEmail);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`http://localhost:5000/admin/suspension/${searchEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            setSuspensionStatus(response.data);
        } catch (error) {
            console.error('Error fetching suspension status:', error);
        }
    };

    const handleSuspendUser = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(`http://localhost:5000/admin/suspend`, {
                email: searchEmail,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            checkSuspensionStatus();
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Panel</h2>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('questions')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'questions'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            Questions Management
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'users'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'reports'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            Reports Management
                        </button>
                        <button
                            onClick={() => setActiveTab('suspension')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'suspension'
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            User Suspension
                        </button>
                    </nav>
                </div>
            </div>

            <div className="flex-1 p-8">
                {activeTab === 'questions' && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Questions Management</h1>
                        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                            <input
                                type="text"
                                name="question"
                                placeholder="Question"
                                value={formData.question}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="option1"
                                placeholder="Option 1"
                                value={formData.option1}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="option2"
                                placeholder="Option 2"
                                value={formData.option2}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="option3"
                                placeholder="Option 3"
                                value={formData.option3}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="option4"
                                placeholder="Option 4"
                                value={formData.option4}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="correct"
                                placeholder="Correct Answer"
                                value={formData.correct}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="resource"
                                placeholder="Resource Link"
                                value={formData.resource}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {editingId ? 'Update Question' : 'Add Question'}
                            </button>
                        </form>
                        <div className="space-y-4">
                            {questions.map((question) => (
                                <div key={question._id} className="border p-4 rounded bg-white">
                                    <h3 className="font-bold">{question.question}</h3>
                                    <div className="ml-4">
                                        <p>1. {question.option1}</p>
                                        <p>2. {question.option2}</p>
                                        <p>3. {question.option3}</p>
                                        <p>4. {question.option4}</p>
                                        <p>Answer: {question.correct}</p>
                                        <p>Resource: {question.resource}</p>
                                    </div>
                                    <div className="mt-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(question)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(question._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {activeTab === 'users' && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">User Management</h1>
                        <div className="bg-white shadow rounded-lg">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => {
                                        console.log(user.isCompanion)
                                        return (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.isCompanion ? "Companion" : "User"}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {activeTab === 'reports' && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Reports Management</h1>
                        <div className="bg-white shadow rounded-lg">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{report.userEmail}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                                            <td className="px-6 py-4">{report.details}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(report.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleUpdateStatus(report._id, 'resolved')}
                                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(report._id, 'rejected')}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                {activeTab === 'suspension' && (
                    <>
                        <h1 className="text-2xl font-bold mb-4">User Suspension Management</h1>
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex gap-4 mb-6">
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    placeholder="Enter user email"
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    onClick={checkSuspensionStatus}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Check Status
                                </button>
                            </div>

                            {suspensionStatus && (
                                <div className="mt-4">
                                    <div className="mb-4">
                                        <p className="font-semibold">Status for {suspensionStatus.email}:</p>
                                        <p className={`mt-2 ${suspensionStatus.isSuspended ? 'text-red-600' : 'text-green-600'}`}>
                                            {suspensionStatus.isSuspended ? 'Suspended' : 'Active'}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleSuspendUser}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Suspend User
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}


            </div>
        </div>
    );
};

export default Admin;
