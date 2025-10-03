import React, { FC, useState, FormEvent } from 'react';
import Modal from './Modal';
import * as authService from '../services/authService';
import { KeyIcon } from './icons/KeyIcon';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
    token: string | null;
}

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({ isOpen, onClose, onSwitchToLogin, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!token) {
            setError("No reset token provided. Please request a new reset link.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await authService.resetPassword(token, password);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCloseAndLogin = () => {
        onClose();
        onSwitchToLogin();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set a New Password">
            {isSuccess ? (
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                       <KeyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Password Reset Successful</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <button
                        onClick={handleCloseAndLogin}
                        className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Proceed to Log In
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Please enter and confirm your new password below.
                    </p>
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm" role="alert">
                            {error}
                        </div>
                    )}
                    <div>
                        {/* FIX: Corrected typo 'c lassName' to 'className' */}
                        <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">New Password</label>
                        <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        {/* FIX: Corrected typo 'c lassName' to 'className' */}
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !token}
                        className="w-full flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
        </Modal>
    );
};

export default ResetPasswordModal;