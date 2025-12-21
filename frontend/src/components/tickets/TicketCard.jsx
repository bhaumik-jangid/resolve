import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

export const TicketCard = ({ ticket, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClick}
            className="group bg-brand-card hover:bg-gray-800/80 border border-gray-800 rounded-lg p-5 cursor-pointer transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        ticket.status === 'open' ? "bg-blue-500/10 text-blue-400" :
                            ticket.status === 'assigned' ? "bg-orange-500/10 text-orange-400" :
                                ticket.status === 'resolved' ? "bg-green-500/10 text-green-400" :
                                    "bg-red-500/10 text-red-500"
                    )}>
                        <Ticket size={20} />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500 font-mono">#{ticket.id}</span>
                            <Badge variant={ticket.priority === 'high' ? 'error' : 'default'} className="scale-90 origin-left">
                                {ticket.priority}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "scale-90 origin-left border-opacity-50",
                                    ticket.status === 'open' ? "text-blue-400 border-blue-400" :
                                        ticket.status === 'assigned' ? "text-orange-400 border-orange-400" :
                                            ticket.status === 'resolved' ? "text-green-400 border-green-400" :
                                                "text-red-400 border-red-400"
                                )}
                            >
                                {ticket.status === 'assigned' ? 'IN PROGRESS' : ticket.status.toUpperCase()}
                            </Badge>
                        </div>
                        <h3 className="font-medium text-white group-hover:text-brand-light transition-colors line-clamp-1">
                            {ticket.subject}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{ticket.preview}</p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Clock size={12} />
                                {ticket.updated}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageSquare size={12} />
                                {ticket.messages} replies
                            </span>
                        </div>
                    </div>
                </div>

                <ChevronRight size={18} className="text-gray-600 group-hover:text-brand-orchid transition-colors" />
            </div>
        </motion.div>
    );
};
