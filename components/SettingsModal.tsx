import React, { FC } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { useTheme } from '../context/ThemeContext';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme, animationsEnabled, toggleAnimations } = useTheme();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">Animations</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enable or disable UI animations</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleAnimations}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            animationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                            <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">Theme</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>

                <div className="pt-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </Modal>
    );
};

export default SettingsModal;