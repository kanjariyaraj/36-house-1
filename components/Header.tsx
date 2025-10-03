import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SettingsModal from './SettingsModal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon';

interface HeaderProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

const Header: FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `sticky top-0 z-20 transition-all duration-300 ${
        isScrolled || user 
        ? 'bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-md' 
        : 'bg-transparent'
    }`;

    return (
        <>
            <header className={headerClasses}>
                <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
                    <motion.h1 
                        className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Event Platform
                    </motion.h1>
                    <div className="flex items-center gap-4">
                        <AnimatePresence mode="wait">
                            {user ? (
                                <motion.div
                                    key="user-logged-in"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="hidden md:flex flex-col text-right">
                                        <motion.span 
                                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {user.email}
                                        </motion.span>
                                        <motion.span 
                                            className="text-xs text-slate-500 dark:text-slate-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {user.role}
                                        </motion.span>
                                    </div>
                                    <motion.button
                                        onClick={logout}
                                        className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Logout
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="user-logged-out"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-2"
                                >
                                    <motion.button 
                                        onClick={onLoginClick} 
                                        className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Log In
                                    </motion.button>
                                    <motion.button
                                        onClick={onSignupClick}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Sign Up
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            onClick={() => setSettingsModalOpen(true)}
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            aria-label="Open settings"
                        >
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <ThemeToggle />
                        </motion.div>
                    </div>
                </div>
            </header>
            <SettingsModal 
                isOpen={isSettingsModalOpen} 
                onClose={() => setSettingsModalOpen(false)} 
            />
        </>
    );
};

export default Header;