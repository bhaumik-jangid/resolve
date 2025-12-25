import { motion, useMotionValue, useSpring } from 'framer-motion';

export const FluidBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient Moving Blobs */}
            <motion.div
                animate={{
                    x: ["-20%", "0%", "-20%"],
                    y: ["0%", "-20%", "0%"],
                    rotate: [0, 10, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(160,62,153,0.08)_0%,transparent_60%)] blur-3xl opacity-60"
            />
            <motion.div
                animate={{
                    x: ["0%", "20%", "0%"],
                    y: ["-20%", "0%", "-20%"],
                    rotate: [0, -10, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(245,156,169,0.08)_0%,transparent_60%)] blur-3xl opacity-60"
            />
            {/* Mouse Follower Blob */}
            <motion.div
                style={{ x, y }}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
        </div>
    );
};
