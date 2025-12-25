import { cn } from '../../lib/utils';

const variants = {
    default: "bg-brand-dark text-gray-300 border-gray-700",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-brand-purple/10 text-brand-orchid border-brand-purple/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export const Badge = ({ children, variant = 'default', className }) => {
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
            variants[variant] || variants.default,
            className
        )}>
            {children}
        </span>
    );
};
