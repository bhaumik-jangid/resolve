import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { cn } from '../../lib/utils';

export const AuthCard = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md relative"
        >
            {/* Card Container */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 text-center">
                    <motion.h1
                        key={isLogin ? "login-title" : "signup-title"}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orchid to-brand-purple"
                    >
                        {isLogin ? "Welcome Back" : "Join Our Platform"}
                    </motion.h1>
                    <p className="text-slate-500 text-sm mt-2">
                        {isLogin ? "Sign in to access your dashboard" : "Create an account to get started"}
                    </p>
                </div>

                {/* Form Container */}
                <div className="px-8 pb-8 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? "login" : "signup"}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLogin ? <LoginForm /> : <SignupForm />}
                        </motion.div>
                    </AnimatePresence>

                    {/* Toggle Link */}
                    <div className="mt-6 pt-6 border-t border-slate-100/50 text-center">
                        <p className="text-sm text-slate-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-medium text-brand-salmon hover:text-brand-pink transition-colors focus:outline-none"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
