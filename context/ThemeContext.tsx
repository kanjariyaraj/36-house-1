import React, { FC, ReactNode, createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    animationsEnabled: boolean;
    toggleAnimations: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme') as Theme;
            if (storedTheme) {
                return storedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedSetting = window.localStorage.getItem('animationsEnabled');
            return storedSetting ? JSON.parse(storedSetting) : true;
        }
        return true;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove all theme classes
        root.classList.remove('light', 'dark', 'vibrant');
        
        // Add the current theme class
        root.classList.add(theme);
        
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('animationsEnabled', JSON.stringify(animationsEnabled));
    }, [animationsEnabled]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'light') return 'dark';
            return 'light';
        });
    };

    const toggleAnimations = () => {
        setAnimationsEnabled(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, animationsEnabled, toggleAnimations }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};