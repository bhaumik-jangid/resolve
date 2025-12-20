import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Loader = ({ className, size = 24 }) => {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 size={size} className="text-brand-purple" />
            </motion.div>
        </div>
    );
};
