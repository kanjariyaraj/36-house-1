import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const ThemeToggle: FC = () => {
    const { theme, toggleTheme } = useTheme();

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <SunIcon className="w-6 h-6" />;
            case 'dark':
                return <MoonIcon className="w-6 h-6" />;
            case 'vibrant':
                return <SunIcon className="w-6 h-6" />; // Use sun icon for vibrant as well
            default:
                return <SunIcon className="w-6 h-6" />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Switch to dark mode';
            case 'dark':
                return 'Switch to light mode';
            case 'vibrant':
                return 'Switch to light mode';
            default:
                return 'Switch theme';
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 transition-colors"
            aria-label={getThemeLabel()}
        >
            {getThemeIcon()}
        </button>
    );
};

export default ThemeToggle;