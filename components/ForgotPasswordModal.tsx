import React, { FC, useState, FormEvent } from 'react';
import Modal from './Modal';
import * as authService from '../services/authService';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const ForgotPasswordModal: FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset state after a short delay to allow modal to close
        setTimeout(() => {
            setEmail('');
            setError(null);
            setIsSubmitted(false);
            setIsLoading(false);
        }, 300);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
            {isSubmitted ? (
                <div className="text-center">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Check your console</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        If an account exists for {email}, a simulated password reset link has been printed to the developer console.
                    </p>
                    <button
                        onClick={handleClose}
                        className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Close
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enter your account's email address and we will send you a password reset link.
                    </p>
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="reset-email" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Your email</label>
                        <input
                            type="email"
                            name="email"
                            id="reset-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 text-center">
                        Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="text-blue-700 hover:underline dark:text-blue-500">Back to log in</a>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ForgotPasswordModal;