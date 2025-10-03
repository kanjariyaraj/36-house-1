import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { SparklesIcon } from './icons/SparklesIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';

interface LandingPageProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

const FeatureCard: FC<{ icon: ReactNode; title: string; children: ReactNode }> = ({ icon, title, children }) => (
    <motion.div 
        className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/30 hover:shadow-xl transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <motion.div 
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg mb-4"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 400 }}
        >
            {icon}
        </motion.div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{children}</p>
    </motion.div>
);

const LandingPage: FC<LandingPageProps> = ({ onLoginClick, onSignupClick }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    // Refs for scroll animations
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <div className="container mx-auto px-4 md:px-8 py-16 sm:py-24 text-center relative">
            {/* Animated background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"></div>
                
                {/* Floating elements */}
                <div className="absolute inset-0">
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                    <motion.div 
                        className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 blur-3xl"
                        animate={{
                            y: [0, 15, 0],
                            x: [0, -15, 0],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 2,
                        }}
                    />
                </div>
            </div>
            
            <motion.div
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={controls}
                className="relative z-10"
            >
                <motion.div 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold mb-6"
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </motion.div>
                    <span>AI-Powered Solutions</span>
                </motion.div>
                
                <motion.h1 
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
                >
                    Event Management
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Made Simple
                    </span>
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400"
                >
                    Organize, manage, and execute events with ease using our AI-powered platform.
                </motion.p>
                
                <motion.div 
                    variants={itemVariants}
                    className="mt-10 flex justify-center gap-4 flex-wrap"
                >
                    <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)" }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={onSignupClick} 
                        className="px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Get Started
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(209, 213, 219, 0.5)" }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={onLoginClick} 
                        className="px-8 py-3 text-base font-semibold text-blue-600 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Log In
                    </motion.button>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    className="mt-24 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left"
                >
                    <motion.div variants={itemVariants}>
                        <FeatureCard icon={<SparklesIcon className="w-6 h-6"/>} title="Smart Planning">
                            AI-powered timeline analysis and risk prediction.
                        </FeatureCard>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6"/>} title="Vendor Management">
                           Streamline vendor compliance and documentation.
                        </FeatureCard>
                    </motion.div>
                     <motion.div variants={itemVariants}>
                        <FeatureCard icon={<UsersIcon className="w-6 h-6"/>} title="Attendee Experience">
                           Personalized schedules and engagement tools.
                        </FeatureCard>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <FeatureCard icon={<ChartBarIcon className="w-6 h-6"/>} title="Sponsor Analytics">
                            Track leads and measure ROI in real-time.
                        </FeatureCard>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingPage;