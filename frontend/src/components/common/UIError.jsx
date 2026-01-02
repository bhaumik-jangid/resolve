import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const UIError = ({ message, className = "" }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-2 text-red-300 text-sm bg-red-500/10 p-4 rounded-lg border border-red-500/20 ${className}`}
                >
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
