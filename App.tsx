import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import AddTaskModal from './components/AddTaskModal';
import OrganizerDashboard from './components/dashboards/OrganizerDashboard';
import AttendeeDashboard from './components/dashboards/AttendeeDashboard';
import VendorDashboard from './components/dashboards/VendorDashboard';
import SponsorDashboard from './components/dashboards/SponsorDashboard';
import * as notificationService from './services/notificationService';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import LandingPage from './components/LandingPage';
import { useTheme } from './context/ThemeContext';

const teamMembers = [
    "Alex Chen",
    "Brenda Miles",
    "Casey Lee",
    "David Garcia",
    "Fiona Kim",
    "George Hill",
    "Ivy Jones",
];

// Animated background component with subtle animations
const AnimatedBackground = () => {
    const { animationsEnabled } = useTheme();
    
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"></div>
            
            {/* Subtle animated elements when animations are enabled */}
            {animationsEnabled && (
                <div className="absolute top-0 left-0 w-full h-full">
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/20"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                    <motion.div 
                        className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20"
                        animate={{
                            x: [0, -50, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </div>
            )}
        </div>
    );
};

function App() {
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setSignupModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
    const [passwordResetToken, setPasswordResetToken] = useState<string | null>(null);
    const { user, isLoading: isAuthLoading } = useAuth();

    // Effect to handle password reset tokens from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('reset-token');
        if (token) {
            setPasswordResetToken(token);
            setResetPasswordModalOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Effect for user-specific setup like notification permissions
    useEffect(() => {
        if(user && (user.role === 'Organizer' || user.role === 'Admin')) {
            notificationService.requestPermission();
        }
    }, [user]);

    const openLoginModal = () => {
        setSignupModalOpen(false);
        setForgotPasswordModalOpen(false);
        setResetPasswordModalOpen(false);
        setLoginModalOpen(true);
    };

    const openSignupModal = () => {
        setLoginModalOpen(false);
        setSignupModalOpen(true);
    };
    
    const openForgotPasswordModal = () => {
        setLoginModalOpen(false);
        setForgotPasswordModalOpen(true);
    };

    const renderDashboard = () => {
        if (!user) return null;

        switch (user.role) {
            case 'Admin':
            case 'Organizer':
                return (
                    <OrganizerDashboard 
                        onAddTask={() => setAddTaskModalOpen(true)}
                    />
                );
            case 'Attendee':
                return <AttendeeDashboard user={user} />;
            case 'Vendor':
                return <VendorDashboard user={user} />;
            case 'Sponsor':
                 return <SponsorDashboard />;
            default:
                return (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {user.email}</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Your dashboard is being set up.</p>
                    </div>
                );
        }
    };


    return (
        <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 font-sans relative">
            <AnimatedBackground />
            <Header 
                onLoginClick={openLoginModal}
                onSignupClick={openSignupModal}
            />
            <motion.main
                key={user ? user.id : 'logged-out'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                {isAuthLoading ? (
                     <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                            }}
                            className="relative"
                        >
                            <svg className="w-16 h-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <motion.div 
                                className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                     </div>
                ) : user ? (
                    <div className="container mx-auto p-4 md:p-8">
                        {renderDashboard()}
                    </div>
                ) : (
                    <LandingPage onLoginClick={openLoginModal} onSignupClick={openSignupModal} />
                )}
            </motion.main>
            
            <AnimatePresence mode="wait">
                {isLoginModalOpen && (
                     <LoginModal 
                        key="login"
                        isOpen={isLoginModalOpen} 
                        onClose={() => setLoginModalOpen(false)} 
                        onSwitchToSignup={openSignupModal}
                        onForgotPassword={openForgotPasswordModal}
                    />
                )}
                {isSignupModalOpen && (
                    <SignupModal 
                        key="signup"
                        isOpen={isSignupModalOpen} 
                        onClose={() => setSignupModalOpen(false)} 
                        onSwitchToLogin={openLoginModal} 
                    />
                )}
                {isForgotPasswordModalOpen && (
                    <ForgotPasswordModal 
                        key="forgot"
                        isOpen={isForgotPasswordModalOpen}
                        onClose={() => setForgotPasswordModalOpen(false)}
                        onSwitchToLogin={openLoginModal}
                    />
                )}
                {isResetPasswordModalOpen && (
                    <ResetPasswordModal 
                        key="reset"
                        isOpen={isResetPasswordModalOpen}
                        onClose={() => setResetPasswordModalOpen(false)}
                        onSwitchToLogin={openLoginModal}
                        token={passwordResetToken}
                    />
                )}
                {user && (user.role === 'Organizer' || user.role === 'Admin') && isAddTaskModalOpen && (
                    <AddTaskModal 
                        key="addtask"
                        isOpen={isAddTaskModalOpen} 
                        onClose={() => setAddTaskModalOpen(false)}
                        teamMembers={teamMembers}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;