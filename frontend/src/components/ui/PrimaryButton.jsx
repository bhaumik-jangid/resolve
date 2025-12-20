import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const PrimaryButton = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    className
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                "w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all duration-300",
                "bg-gradient-to-r from-brand-purple to-brand-orchid hover:shadow-lg hover:shadow-brand-purple/20",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                className
            )}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                children
            )}
        </motion.button>
    );
};
