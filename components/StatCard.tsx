import React, { FC, ReactNode, cloneElement, ReactElement, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string | number | ReactNode;
    colorClass?: string;
}

const StatCard: FC<StatCardProps> = ({ icon, title, value, colorClass = 'text-blue-500' }) => {
    // A simple way to generate a background color from the text color
    const iconBgColorClass = colorClass.replace('text', 'bg').replace('500', '100') + ' dark:bg-opacity-20';
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div 
            className="bg-white dark:bg-slate-800/50 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden"
            whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Animated background gradient */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0"
                animate={isHovered ? { 
                    opacity: 1,
                    x: ['-100%', '100%']
                } : { 
                    opacity: 0 
                }}
                transition={{ duration: 0.5 }}
            />
            
            <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                    className={`p-3 rounded-full ${iconBgColorClass}`}
                    whileHover={{ 
                        scale: 1.1,
                        rotate: 5
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {cloneElement(icon as ReactElement, { className: `w-6 h-6 ${colorClass}` })}
                </motion.div>
                <div>
                    <motion.p 
                        className="text-sm text-slate-500 dark:text-slate-400 font-medium"
                        animate={isHovered ? { x: 3 } : { x: 0 }}
                    >
                        {title}
                    </motion.p>
                    <motion.div 
                        className="text-2xl font-bold text-slate-900 dark:text-white"
                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                    >
                        {value}
                    </motion.div>
                </div>
            </div>
            
            {/* Animated border highlight */}
            <motion.div 
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, ${colorClass.replace('text-', '')}, transparent)`,
                    height: '2px',
                    top: '0',
                    left: '-100%',
                }}
                animate={isHovered ? { 
                    left: '100%',
                    opacity: [0, 1, 0]
                } : { 
                    left: '-100%',
                    opacity: 0
                }}
                transition={{ duration: 0.8 }}
            />
        </motion.div>
    );
};

export default StatCard;