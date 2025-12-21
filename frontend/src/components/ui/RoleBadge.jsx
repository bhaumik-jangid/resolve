import { cn } from '../../lib/utils';

export const RoleBadge = ({ role, approved, className }) => {
    const r = role?.toLowerCase();

    let text = 'Customer';
    let styles = "bg-gray-500/10 text-gray-400 border-gray-500/20";

    if (r === 'admin') {
        text = 'Admin';
        styles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    } else if (r === 'agent') {
        if (approved) {
            text = 'Agent (Approved)';
            styles = "bg-green-500/10 text-green-400 border-green-500/20";
        } else {
            text = 'Agent (Pending Approval)';
            styles = "bg-amber-500/10 text-amber-500/70 border-amber-500/20";
        }
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            styles,
            className
        )}>
            {text}
        </span>
    );
};
