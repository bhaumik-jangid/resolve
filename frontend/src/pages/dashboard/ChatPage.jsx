import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Ticket } from 'lucide-react';
import { api } from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { socket } from "../../services/socket";
import { useTickets } from '../../context/TicketsContext';

export const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const { getTicketById, updateTicketStatus, upsertTickets } = useTickets();


    const [searchParams] = useSearchParams();
    const ticketId = searchParams.get('ticketId');
    const ticket = getTicketById(ticketId);

    const isResolved = ticket?.status === 'resolved';
    const isClosed = ticket?.status === 'closed';


    const isCustomer = user?.role === 'CUSTOMER';
    const isAgent = user?.role === 'AGENT';
    const isAdmin = user?.role === 'ADMIN';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!ticketId) {
        return (
            <EmptyState
                icon={AlertCircle}
                title="No ticket selected"
                description="Please open a ticket to start chatting."
            />
        );
    }


    useEffect(() => {

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await api.messages.list(ticketId);
                setMessages(res);
            } catch (err) {
                console.error("Chat Load Fail", err);
            } finally {
                setLoading(false);
                setTimeout(scrollToBottom, 100);
            }
        };
        fetchMessages();

        if (!ticketId) return;
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join_ticket", ticketId);

        const handleNewMessage = (message) => {
            setMessages((prev) => [...prev, message]);
            setTimeout(scrollToBottom, 50);
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [ticketId]);

    useEffect(() => {
        const handleStatusUpdate = ({ ticketId, status }) => {
            updateTicketStatus(ticketId, status);
        };

        socket.on("ticket_status_updated", handleStatusUpdate);

        return () => {
            socket.off("ticket_status_updated", handleStatusUpdate);
        };
    }, [updateTicketStatus]);


    useEffect(() => {
        const fetchTickets = async () => {
            if (!user) return;

            try {
                const res = await api.tickets.list();
                const normalized = res.map(normalizeTicket);
                upsertTickets(normalized);
            } catch (err) {
                console.error("Failed to load tickets", err);
            }
        };

        fetchTickets();
    }, []);

    const normalizeTicket = (t) => ({
        id: t._id,
        subject: t.subject,
        requester: t.customerId?.name || "Unknown",
        agent: t.agentId?.name || null,
        status: t.status.toLowerCase(),
        priority: t.priority.toLowerCase(),
        updated: new Date(t.updatedAt).toLocaleDateString(),
        raw: t
    });

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setSending(true);
        try {
            await api.messages.send({
                ticketId,
                content: inputValue
            });
            setInputValue(""); // socket will handle UI
        } catch (err) {
            console.error("Send failed", err);
        } finally {
            setSending(false);
        }
    };

    const handleCloseTicket = async () => {
        try {
            await api.tickets.updateStatus(ticketId, "CLOSED");
            updateTicketStatus(ticketId, "CLOSED");
        } catch (err) {
            console.error("Close failed", err);
        }
    };

    const handleResolveTicket = async () => {
        try {
            await api.tickets.updateStatus(ticketId, "RESOLVED");
            updateTicketStatus(ticketId, "RESOLVED");
        } catch (err) {
            console.error("Resolve failed", err);
        }
    };


    if (loading) return <div className="h-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">


            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-brand-card border border-gray-800 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between bg-brand-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">
                                {ticket?.subject || `Ticket #${ticketId}`}
                                {user.role !== 'CUSTOMER' && (
                                    <span className="ml-2 text-xs text-gray-400">
                                        (Customer Conversation)
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                {isClosed ? (
                                    <p className="text-xs text-red-500 flex items-center gap-1 font-medium bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        Closed
                                    </p>
                                ) : isResolved ? (
                                    <p className="text-xs text-green-500 flex items-center gap-1 font-medium bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                        <CheckCircle size={12} />
                                        Resolved
                                    </p>
                                ) : (
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        Active Now
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">

                            {/* CUSTOMER → CLOSE */}
                            {isCustomer && !isClosed && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCloseTicket}
                                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                    <AlertCircle size={16} />
                                    Close Ticket
                                </motion.button>
                            )}

                            {/* AGENT → RESOLVE */}
                            {isAgent && !isClosed && (
                                isResolved ? (
                                    <div className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium bg-green-500/10 flex items-center gap-2 opacity-75 cursor-default">
                                        <CheckCircle size={16} />
                                        Resolved
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleResolveTicket}
                                        className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} />
                                        Mark Resolved
                                    </motion.button>
                                )
                            )}

                            {/* ADMIN → BOTH */}
                            {isAdmin && !isClosed && (
                                <div className="flex items-center gap-2">
                                    {isResolved ? (
                                        <div className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium bg-green-500/10 flex items-center gap-2 opacity-75 cursor-default">
                                            <CheckCircle size={16} />
                                            Resolved
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleResolveTicket}
                                            className="px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/10 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            Resolve
                                        </motion.button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCloseTicket}
                                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <AlertCircle size={16} />
                                        Close
                                    </motion.button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-darker/50">
                    {messages.map((msg) => {
                        const isMe =
                            typeof msg.senderId === "string"
                                ? msg.senderId === user.id
                                : msg.senderId?._id === user.id;

                        return (
                            <MessageBubble
                                key={msg._id}
                                message={msg}
                                isMe={isMe}
                            />
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {isClosed ? (
                    <div className="p-6 bg-brand-dark/50 border-t border-gray-800 flex flex-col items-center justify-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                            {ticket?.status === 'RESOLVED' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <p className="text-gray-400 font-medium">
                            This ticket has been {ticket?.status}.
                        </p>
                        <p className="text-xs text-gray-500">
                            No further messages can be sent.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 bg-brand-card border-t border-gray-800">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <button type="button" className="p-3 text-gray-400 hover:text-white transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-brand-dark border border-gray-700 rounded-lg px-4 text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-gray-600"
                            />
                            <PrimaryButton type="submit" loading={sending} className="w-auto px-4 bg-brand-purple hover:bg-brand-orchid">
                                <Send size={18} />
                            </PrimaryButton>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
