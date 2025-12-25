import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            <div className="bg-brand-dark/50 p-4 rounded-full mb-4">
                <Icon size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-gray-400 max-w-sm mb-6">{description}</p>
            {action && (
                <div>{action}</div>
            )}
        </motion.div>
    );
};
