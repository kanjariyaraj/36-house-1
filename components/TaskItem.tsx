import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { EventTask, TaskStatus } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface TaskItemProps {
    task: EventTask;
    isAtRisk?: boolean;
    onStatusChange: (id: number, status: TaskStatus) => void;
}

const statusConfig = {
    [TaskStatus.Completed]: {
        icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-800 dark:text-green-200',
        label: 'Completed'
    },
    [TaskStatus.InProgress]: {
        icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-800 dark:text-blue-200',
        label: 'In Progress'
    },
    [TaskStatus.Upcoming]: {
        icon: <ClockIcon className="w-5 h-5 text-slate-500" />,
        bgColor: 'bg-slate-50 dark:bg-slate-800',
        borderColor: 'border-slate-200 dark:border-slate-700',
        textColor: 'text-slate-800 dark:text-slate-200',
        label: 'Upcoming'
    },
    [TaskStatus.AtRisk]: {
        icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />,
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-800 dark:text-amber-200',
        label: 'At Risk'
    },
    [TaskStatus.Delayed]: {
        icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-800 dark:text-red-200',
        label: 'Delayed'
    }
};

const TaskItem: FC<TaskItemProps> = ({ task, isAtRisk, onStatusChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const config = statusConfig[task.status];
    const showRiskIndicator = isAtRisk && task.status !== TaskStatus.Completed && task.status !== TaskStatus.Delayed;

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (task.status === newStatus) return;
        
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update task status');
            }
            
            onStatusChange(task.id, newStatus);
            toast.success(`Task marked as ${statusConfig[newStatus].label.toLowerCase()}`);
        } catch (error) {
            console.error('Failed to update task status:', error);
            toast.error('Failed to update task status');
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = task.status !== TaskStatus.Completed && task.status !== TaskStatus.Delayed && new Date(task.dueDate) < new Date();

    return (
        <motion.div
            className={`rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                            {showRiskIndicator ? (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                </motion.div>
                            ) : (
                                config.icon
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${config.textColor} truncate`}>
                                    {task.title}
                                </h3>
                                {isOverdue && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                        Overdue
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">
                                {task.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {task.assignee}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                    Due: {formatDate(task.dueDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                            aria-label={isExpanded ? "Collapse task details" : "Expand task details"}
                        >
                            {isExpanded ? (
                                <ChevronUpIcon className="w-5 h-5" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3">
                    {Object.values(TaskStatus).map((status) => {
                        const statusInfo = statusConfig[status];
                        const isActive = task.status === status;
                        const isDisabled = isUpdating || isActive;
                        
                        return (
                            <motion.button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={isDisabled}
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-colors ${
                                    isActive 
                                        ? `${statusInfo.borderColor} ${statusInfo.bgColor} ${statusInfo.textColor}`
                                        : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                whileHover={{ scale: !isDisabled ? 1.05 : 1 }}
                                whileTap={{ scale: !isDisabled ? 0.95 : 1 }}
                            >
                                {statusInfo.icon}
                                {statusInfo.label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
            
            {isExpanded && (
                <motion.div
                    className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="pt-4">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">Task Details</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {task.description || 'No description provided.'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Assignee:</span>
                                <span className="ml-2 font-medium text-slate-900 dark:text-white">{task.assignee}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Due Date:</span>
                                <span className="ml-2 font-medium text-slate-900 dark:text-white">{formatDate(task.dueDate)}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                                <span className={`ml-2 font-medium ${config.textColor}`}>{config.label}</span>
                            </div>
                            {showRiskIndicator && (
                                <div>
                                    <span className="text-slate-500 dark:text-slate-400">Risk:</span>
                                    <span className="ml-2 font-medium text-amber-600 dark:text-amber-400">At Risk</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TaskItem;