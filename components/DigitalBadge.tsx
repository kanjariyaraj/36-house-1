import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { QrCodeIcon } from './icons/QrCodeIcon';
import { TicketIcon } from './icons/TicketIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface DigitalBadgeProps {
    user: User;
    isCheckedIn: boolean;
}

const DigitalBadge: FC<DigitalBadgeProps> = ({ user, isCheckedIn }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 p-1 rounded-2xl shadow-2xl sticky top-24"
        >
            <div className="relative bg-slate-50 dark:bg-slate-900 rounded-xl p-6 overflow-hidden">
                 {/* Cutout effect */}
                <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                
                <div className="text-center border-b-2 border-dashed border-slate-300 dark:border-slate-700 pb-6">
                     <div className="mx-auto bg-white p-2 rounded-lg inline-block shadow-md">
                         <QrCodeIcon className="w-36 h-36 text-slate-800" />
                    </div>
                     <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-4 truncate" title={user.email}>
                        {user.email}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full inline-block mt-2">
                        {user.role}
                    </p>
                </div>
                
                <div className="mt-6">
                    <h4 className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-3">Check-in Status</h4>
                    {isCheckedIn ? (
                        <div className="flex items-center justify-center gap-2 text-lg font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6" />
                            <span>Checked In</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-lg font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                            <XCircleIcon className="w-6 h-6" />
                            <span>Not Checked In</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DigitalBadge;