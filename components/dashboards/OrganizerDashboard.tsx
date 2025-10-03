import React, { FC, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { EventTask, TaskStatus, RiskAnalysis } from '../../types';
import { useApi } from '../../hooks/useApi';
import * as geminiService from '../../services/geminiService';
import Timeline from '../Timeline';
import RiskAnalysisCard from '../RiskAnalysisCard';
import FilterControls from '../FilterControls';
import { PlusIcon } from '../icons/PlusIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import SkeletonLoader from '../SkeletonLoader';

interface OrganizerDashboardProps {
    onAddTask: () => void;
}

const OrganizerDashboard: FC<OrganizerDashboardProps> = ({ onAddTask }) => {
    const { data: tasks, error: tasksError, isLoading: tasksLoading, mutate: mutateTasks } = useApi('/api/tasks');
    // Using a separate state for analysis because it's loaded on-demand
    const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<TaskStatus | 'All'>('All');

    const handleAnalyzeTimeline = useCallback(async () => {
        if (!tasks || tasks.length === 0) {
            toast.error("There are no tasks to analyze.");
            return;
        }
        setIsAnalyzing(true);
        const toastId = toast.loading("Analyzing timeline with AI...");
        try {
            const result = await geminiService.analyzeTimeline(tasks);
            setAnalysis(result);
            
            const atRiskTaskIds = result.risks
                .map(r => r.taskId)
                .filter(id => {
                    const task = tasks.find(t => t.id === id);
                    return task && task.status !== TaskStatus.Completed && task.status !== TaskStatus.Delayed;
                });

            if (atRiskTaskIds.length > 0) {
                // Persist the status changes to the backend
                await fetch('/api/tasks/bulk-status-update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskIds: atRiskTaskIds, status: TaskStatus.AtRisk })
                });
                // Re-fetch data from the server to get the persisted state
                mutateTasks(); 
                toast.success("Timeline analysis complete! Task statuses updated.", { id: toastId });
            } else {
                toast.success("Timeline analysis complete! No new risks found.", { id: toastId });
            }

        } catch (error) {
            console.error("Analysis failed:", error);
            const message = error instanceof Error ? error.message : "Failed to analyze timeline.";
            toast.error(message, { id: toastId });
        } finally {
            setIsAnalyzing(false);
        }
    }, [tasks, mutateTasks]);

    const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        if (activeFilter === 'All') return tasks;
        return tasks.filter(task => task.status === activeFilter);
    }, [tasks, activeFilter]);
    
    if (tasksLoading) {
        return <SkeletonLoader type="OrganizerDashboard" />;
    }

    if (tasksError) {
        return <div className="text-center text-red-500">Error loading tasks. Please try again later.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                         <motion.h2 
                            className="text-3xl font-bold text-slate-900 dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            Event Timeline
                        </motion.h2>
                         <motion.p 
                            className="mt-1 text-slate-600 dark:text-slate-400"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Manage all tasks and monitor risks for your event.
                        </motion.p>
                    </div>
                    <motion.button
                        onClick={onAddTask}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 w-full sm:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Task
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <FilterControls activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                </motion.div>

                {filteredTasks.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Timeline tasks={filteredTasks} risks={analysis?.risks || []} />
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-lg"
                    >
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No tasks found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">There are no tasks matching the "{activeFilter}" filter.</p>
                    </motion.div>
                )}
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1 space-y-8"
            >
                 <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg sticky top-24 border border-slate-200 dark:border-slate-700">
                    <motion.h3 
                        className="text-xl font-bold text-slate-900 dark:text-white mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        AI Risk Analysis
                    </motion.h3>
                     <motion.button
                        onClick={handleAnalyzeTimeline}
                        disabled={isAnalyzing}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 mb-6 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {isAnalyzing ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <SparklesIcon className="w-5 h-5" />
                        )}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Timeline'}</span>
                    </motion.button>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <RiskAnalysisCard analysis={analysis} />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrganizerDashboard;