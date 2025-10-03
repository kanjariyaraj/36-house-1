import React, { FC, useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const SignupModal: FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { signup, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Attendee);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await signup(email, password, role);
            onClose(); // Close modal on successful signup
        } catch (err: any) {
            setError(err.message || 'Failed to sign up. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await loginWithGoogle();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
            <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                 {error && (
                    <motion.div 
                        className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" 
                        role="alert"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {error}
                    </motion.div>
                )}
                <div>
                    <label htmlFor="signup-email" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Your email</label>
                    <input
                        type="email"
                        name="email"
                        id="signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                        placeholder="name@company.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="signup-password" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">I am an</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                    >
                        {Object.values(UserRole).map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {isLoading ? 'Creating account...' : 'Create account'}
                </motion.button>
            </motion.form>
            <motion.div 
                className="my-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-400 text-sm">OR</span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
            </motion.div>
            <motion.button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-slate-300 dark:border-slate-600 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <GoogleIcon className="w-5 h-5" />
                Sign up with Google
            </motion.button>
            <motion.div 
                className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="text-blue-700 hover:underline dark:text-blue-500">Log in</a>
            </motion.div>
        </Modal>
    );
};

export default SignupModal;