import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { AuthCard } from '../components/auth/AuthCard';

export const AuthPage = () => {
    // Setup for scroll animations
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    // Parallax background or simple gradient mesh
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full bg-white text-slate-900 overflow-y-auto overflow-x-hidden relative"
        >
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-pink/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orchid/20 blur-[120px]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-20">

                {/* Brand Logo / Header (Optional above card) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 flex items-center gap-2"
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orchid to-brand-purple flex items-center justify-center font-bold text-white shadow-lg shadow-brand-purple/30">
                        R
                    </div>
                    <span className="text-xl font-bold tracking-tight">Resolve Chat</span>
                </motion.div>

                {/* The Auth Card */}
                <AuthCard />

                {/* Footer info (for scroll demo purposes) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 text-center text-gray-500 text-sm max-w-lg"
                >
                    <p>Secure. Fast. Reliable.</p>
                    <p className="mt-2">Trusted by support teams worldwide.</p>
                </motion.div>
            </div>
        </div>
    );
};
