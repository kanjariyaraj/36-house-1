import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

const Pulse: FC<{ className?: string; children?: ReactNode }> = ({ className = '', children }) => (
    <motion.div 
        className={`rounded ${className}`}
        initial={{ opacity: 0.5 }}
        animate={{ 
            opacity: [0.5, 1, 0.5],
        }}
        transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
        }}
        style={{
            background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)',
        }}
    >
        {children}
    </motion.div>
);

const RainbowPulse: FC<{ className?: string; children?: ReactNode }> = ({ className = '', children }) => (
    <motion.div 
        className={`rounded ${className}`}
        initial={{ opacity: 0.5 }}
        animate={{ 
            opacity: [0.5, 1, 0.5],
            background: [
                'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)',
                'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)',
                'linear-gradient(90deg, #EC4899, #F59E0B, #10B981)',
                'linear-gradient(90deg, #F59E0B, #10B981, #3B82F6)',
                'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)',
                'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)'
            ]
        }}
        transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

const TaskSkeleton: FC = () => (
    <div className="relative mb-8 pl-8">
        <RainbowPulse className="absolute -left-[41px] top-1.5 w-8 h-8 rounded-full" />
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
                <Pulse className="h-6 w-3/5" />
                <Pulse className="h-6 w-1/5" />
            </div>
            <Pulse className="h-4 w-full mt-3" />
            <Pulse className="h-4 w-4/5 mt-2" />
            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-3 flex gap-6">
                <Pulse className="h-5 w-1/4" />
                <Pulse className="h-5 w-1/4" />
            </div>
        </div>
    </div>
);

const CardSkeleton: FC = () => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <Pulse className="h-6 w-1/2 mb-4" />
        <Pulse className="h-4 w-full mb-2" />
        <Pulse className="h-4 w-5/6 mb-6" />
        <RainbowPulse className="h-12 w-full mb-4 rounded-lg" />
        <RainbowPulse className="h-12 w-full rounded-lg" />
    </div>
);

const OrganizerDashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <Pulse className="h-8 w-1/2" />
                    <RainbowPulse className="h-10 w-28 rounded-lg" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => <RainbowPulse key={i} className="h-8 w-20 rounded-full" />)}
                </div>
                <TaskSkeleton />
                <TaskSkeleton />
                <TaskSkeleton />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    </motion.div>
);

const AttendeeDashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <Pulse className="h-9 w-1/2" />
                    <Pulse className="h-5 w-3/4 mt-2" />
                </div>
                <TaskSkeleton />
                <TaskSkeleton />
            </div>
            <div className="lg:col-span-1">
                <CardSkeleton />
            </div>
        </div>
    </motion.div>
)

const VendorDashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="space-y-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <Pulse className="h-9 w-1/3" />
                <Pulse className="h-5 w-1/2 mt-2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><CardSkeleton /></div>
                <div className="lg:col-span-1"><CardSkeleton /></div>
            </div>
        </div>
    </motion.div>
)

const SponsorDashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="space-y-8">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <Pulse className="h-9 w-64" />
                    <Pulse className="h-6 w-48 mt-2" />
                </div>
                <RainbowPulse className="h-10 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <RainbowPulse className="h-24 rounded-lg" />
                <RainbowPulse className="h-24 rounded-lg" />
                <RainbowPulse className="h-24 rounded-lg" />
            </div>
            <CardSkeleton />
        </div>
    </motion.div>
)

interface SkeletonLoaderProps {
    type: 'OrganizerDashboard' | 'AttendeeDashboard' | 'VendorDashboard' | 'SponsorDashboard';
}

const SkeletonLoader: FC<SkeletonLoaderProps> = ({ type }) => {
    switch (type) {
        case 'OrganizerDashboard': return <OrganizerDashboardSkeleton />;
        case 'AttendeeDashboard': return <AttendeeDashboardSkeleton />;
        case 'VendorDashboard': return <VendorDashboardSkeleton />;
        case 'SponsorDashboard': return <SponsorDashboardSkeleton />;
        default: return <OrganizerDashboardSkeleton />;
    }
};

export default SkeletonLoader;