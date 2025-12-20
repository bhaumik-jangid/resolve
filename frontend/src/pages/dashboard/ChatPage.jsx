import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Video, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Ticket } from 'lucide-react';

const MOCK_MESSAGES = [
    { id: 1, sender: 'Support Bot', role: 'bot', content: 'Hello! How can we help you today?', timestamp: '10:00 AM' },
    { id: 2, sender: 'You', role: 'customer', content: 'Hi, I am having trouble with the API key generation.', timestamp: '10:02 AM' },
    { id: 3, sender: 'Sarah Miller', role: 'agent', content: 'I can certainly help with that. Are you getting a specific error message?', timestamp: '10:05 AM' },
    { id: 4, sender: 'You', role: 'customer', content: 'Yes, it says "403 Forbidden" even though I am an admin.', timestamp: '10:06 AM' },
    { id: 5, sender: 'System Admin', role: 'admin', content: 'This might be a permissions sync issue. I create a ticket to escalate this check.', timestamp: '10:10 AM' },
];

export const ChatPage = () => {
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'You',
            role: 'customer',
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Chat List (Sidebar for chat) */}
            <div className="w-80 hidden lg:flex flex-col bg-brand-card border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-brand-dark border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-brand-purple focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`p-4 border-b border-gray-800 hover:bg-white/5 cursor-pointer transition-colors ${i === 0 ? 'bg-brand-purple/5 border-l-2 border-l-brand-purple' : ''}`}>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-white text-sm">Ticket #{1000 + i}</span>
                                <span className="text-xs text-gray-500">10:30 AM</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-1">API Key issue escalation...</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-brand-card border border-gray-800 rounded-xl overflow-hidden">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between bg-brand-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Ticket #1024: API Issue</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Active Now
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Phone size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Video size={20} /></button>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-brand-darker/50">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} isMe={msg.sender === 'You'} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
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
                            className="flex-1 bg-brand-dark border border-gray-700 rounded-lg px-4 text-white focus:outline-none focus:border-brand-purple transition-all"
                        />
                        <PrimaryButton type="submit" className="w-auto px-4 bg-brand-purple hover:bg-brand-orchid">
                            <Send size={18} />
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
};
