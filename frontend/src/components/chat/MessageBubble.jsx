import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';

export const MessageBubble = ({ message, isMe }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex flex-col gap-1 max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
            )}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-medium">{message.sender}</span>
                {message.role === 'admin' && (
                    <Badge variant="blue" className="text-[10px] py-0 px-1.5 h-auto">Admin</Badge>
                )}
                {message.role === 'agent' && (
                    <Badge variant="purple" className="text-[10px] py-0 px-1.5 h-auto">Agent</Badge>
                )}
            </div>

            <div
                className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isMe
                        ? "bg-brand-purple text-white rounded-br-none"
                        : message.role === 'admin'
                            ? "bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-bl-none"
                            : "bg-gray-800 text-gray-200 rounded-bl-none"
                )}
            >
                {message.content}
            </div>

            <span className="text-[10px] text-gray-600 px-1">
                {message.timestamp}
            </span>
        </motion.div>
    );
};
