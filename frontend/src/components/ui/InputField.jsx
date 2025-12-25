import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const InputField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    name,
    icon: Icon,
    required = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full space-y-1">
            {label && (
                <label
                    className={cn(
                        "block text-sm font-medium transition-colors duration-200",
                        error ? "text-red-400" : isFocused ? "text-brand-orchid" : "text-slate-500"
                    )}
                >
                    {label} {required && <span className="text-brand-salmon">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full bg-slate-50 border rounded-lg px-4 py-3 outline-none transition-all duration-300",
                        "text-slate-900 placeholder:text-slate-400",
                        Icon ? "pl-10" : "pl-4",
                        isPassword ? "pr-10" : "pr-4",
                        error
                            ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                            : "border-gray-200 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50"
                    )}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 mt-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};
