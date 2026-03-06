import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../service/axiosInstance';
import { API_PATH } from '../../service/api';
import { connectSocket, disconnectSocket } from '../../service/socket';

const ChatPage = () => {
    const { contractId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State from navigation (optional enrichment)
    const passedContract = location.state?.contract;
    const passedOtherParty = location.state?.otherPartyName;

    // Core chat state
    const [conversations, setConversations] = useState([]);
    const [activeContractId, setActiveContractId] = useState(contractId || null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);

    // Contracts lookup for titles & names
    const [contractsMap, setContractsMap] = useState({});
    const [userNamesMap, setUserNamesMap] = useState({});

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const inputRef = useRef(null);

    const isClient = user?.role === 'CLIENT';
    const basePath = isClient ? '/client' : '/freelancer';

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Fetch all conversations + user's contracts for names
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch conversations
                const convRes = await axiosInstance.get(API_PATH.CHAT.GET_CONVERSATIONS, {
                    params: { user_id: user.id }
                });

                // Fetch contracts for title mapping
                const contractsEndpoint = isClient
                    ? API_PATH.CONTRACT.GET_MY_CONTRACTS_CLIENT(user.id)
                    : API_PATH.CONTRACT.GET_MY_CONTRACTS(user.id);
                const contractsRes = await axiosInstance.get(contractsEndpoint);

                const cMap = {};
                (contractsRes.data?.contracts || []).forEach(c => {
                    cMap[c.id] = c;
                });
                setContractsMap(cMap);

                // For freelancers, resolve client names via GET_USER
                const namesMap = {};
                if (!isClient) {
                    const clientIds = [...new Set((contractsRes.data?.contracts || []).map(c => c.client_id).filter(Boolean))];
                    const nameResults = await Promise.allSettled(
                        clientIds.map(id => axiosInstance.get(API_PATH.USERS.GET_USER(id)))
                    );
                    nameResults.forEach((result, i) => {
                        if (result.status === 'fulfilled') {
                            const info = result.value.data?.infomations || result.value.data;
                            namesMap[clientIds[i]] = info?.full_name || info?.email?.split('@')[0] || 'Client';
                        }
                    });
                }
                setUserNamesMap(namesMap);

                const rawConvs = convRes.data?.conversations || [];

                // Deduplicate conversations by participants so we only show one chat per user pair
                // (Older DB records might have multiple convos from before the single chat room change)
                const uniqueConvsMap = new Map();
                rawConvs.forEach(conv => {
                    if (conv.participants && conv.participants.length >= 2) {
                        // Create a unique key by sorting participants
                        const key = [...conv.participants].sort().join(',');
                        if (!uniqueConvsMap.has(key)) {
                            uniqueConvsMap.set(key, conv);
                        }
                    } else {
                        // Fallback if participants array is missing or invalid
                        uniqueConvsMap.set(conv._id.toString(), conv);
                    }
                });

                setConversations(Array.from(uniqueConvsMap.values()));
            } catch (err) {
                console.error('Failed to load chat data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchData();
    }, [user?.id, isClient]);

    // Connect socket & join room when activeContractId changes
    useEffect(() => {
        if (!activeContractId || !user?.id) return;

        const socket = connectSocket();
        socketRef.current = socket;

        socket.emit('join_contract_room', {
            contract_id: activeContractId,
            user_id: user.id
        });

        socket.on('joined_room', ({ conversation_id }) => {
            setConversationId(conversation_id);
        });

        socket.on('receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('error', (err) => {
            console.error('Socket error:', err.message);
        });

        return () => {
            socket.off('joined_room');
            socket.off('receive_message');
            socket.off('error');
        };
    }, [activeContractId, user?.id]);

    // Fetch message history when activeContractId changes
    useEffect(() => {
        if (!activeContractId || !user?.id) return;

        const fetchMessages = async () => {
            try {
                const res = await axiosInstance.get(API_PATH.CHAT.GET_MESSAGES(activeContractId), {
                    params: { user_id: user.id }
                });
                setMessages(res.data?.messages || []);
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };

        fetchMessages();
    }, [activeContractId, user?.id]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => disconnectSocket();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId || !activeContractId || sendingMessage) return;

        setSendingMessage(true);
        const socket = socketRef.current;
        if (socket) {
            socket.emit('send_message', {
                contract_id: activeContractId,
                sender_id: user.id,
                text: newMessage.trim(),
                conversation_id: conversationId
            });
        }
        setNewMessage('');
        setSendingMessage(false);
        inputRef.current?.focus();
    };

    const handleSelectConversation = (conv) => {
        setActiveContractId(conv.contract_id);
        setMessages([]);
        setConversationId(null);
    };

    const getContractTitle = (contractId) => {
        const c = contractsMap[contractId];
        if (c) return c.job_title || c.gig_title || 'Untitled Project';
        return 'Chat';
    };

    const getOtherPartyName = (contractId) => {
        const c = contractsMap[contractId];
        if (!c) return 'User';
        if (isClient) {
            // Client contracts have freelancer_name from the API
            return c.freelancer_name || 'Freelancer';
        } else {
            // Freelancer: look up client name from userNamesMap
            return userNamesMap[c.client_id] || 'Client';
        }
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Conversation Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Sidebar Header */}
                <div className="h-16 border-b border-gray-100 flex items-center px-5">
                    <h2 className="text-lg font-serif font-bold text-gray-900">Messages</h2>
                    <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {conversations.length}
                    </span>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No conversations yet</p>
                            <p className="text-xs text-gray-400 mt-1">Start chatting from your active projects</p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const isActive = conv.contract_id === activeContractId;
                            return (
                                <button
                                    key={conv._id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`w-full text-left px-5 py-4 border-b border-gray-50 transition-colors ${isActive
                                        ? 'bg-gray-50 border-l-2 border-l-black'
                                        : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase shadow-sm ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {getOtherPartyName(conv.contract_id).charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-semibold truncate ${isActive ? 'text-black' : 'text-gray-800'}`}>
                                                {getOtherPartyName(conv.contract_id)}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                All Projects
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {activeContractId ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                                <span className="text-sm font-bold text-indigo-600 uppercase">
                                    {(passedOtherParty || getOtherPartyName(activeContractId)).charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    {passedOtherParty || getOtherPartyName(activeContractId)}
                                </h3>
                                <p className="text-xs text-gray-500">All Projects</p>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">No messages yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Send a message to start the conversation</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMine = msg.sender_id === user.id;
                                    const showTimestamp = idx === 0 ||
                                        messages[idx - 1].sender_id !== msg.sender_id ||
                                        (new Date(msg.createdAt) - new Date(messages[idx - 1].createdAt)) > 300000;

                                    return (
                                        <div key={msg._id || idx}>
                                            {showTimestamp && (
                                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1 mt-3`}>
                                                    <span className="text-[10px] text-gray-400 font-medium px-1">
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${isMine
                                                        ? 'bg-black text-white rounded-2xl rounded-br-md'
                                                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm'
                                                        }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white px-6 py-4">
                            <div className="flex items-center gap-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors placeholder-gray-400"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sendingMessage}
                                    className="h-11 w-11 flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* No conversation selected */
                    <div className="flex flex-col items-center justify-center h-full text-center px-8">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Select a conversation</h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Choose a conversation from the sidebar or start a new chat from your active projects.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
