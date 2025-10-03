import React, { FC } from 'react';
import { motion } from 'framer-motion';
import TaskItem from './TaskItem';
import { EventTask, TaskStatus, IdentifiedRisk } from '../types';

interface TimelineProps {
    tasks: EventTask[];
    risks: IdentifiedRisk[];
}

const Timeline: FC<TimelineProps> = ({ tasks, risks }) => {
    // Group tasks by status
    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {} as Record<TaskStatus, EventTask[]>);

    // Sort tasks within each group by due date
    Object.keys(groupedTasks).forEach(status => {
        groupedTasks[status as TaskStatus].sort((a, b) => 
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
    });

    const statusOrder: TaskStatus[] = [
        TaskStatus.AtRisk,
        TaskStatus.Delayed,
        TaskStatus.InProgress,
        TaskStatus.Upcoming,
        TaskStatus.Completed
    ];

    const getStatusLabel = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.Completed: return 'Completed';
            case TaskStatus.InProgress: return 'In Progress';
            case TaskStatus.Upcoming: return 'Upcoming';
            case TaskStatus.AtRisk: return 'At Risk';
            case TaskStatus.Delayed: return 'Delayed';
            default: return status;
        }
    };

    const getTaskCount = (status: TaskStatus) => {
        return groupedTasks[status] ? groupedTasks[status].length : 0;
    };

    const handleStatusChange = (id: number, status: TaskStatus) => {
        // This would typically update the parent state
        console.log(`Task ${id} status changed to ${status}`);
    };

    return (
        <div className="space-y-8">
            {statusOrder.map((status) => {
                const tasksInStatus = groupedTasks[status];
                if (!tasksInStatus || tasksInStatus.length === 0) return null;

                return (
                    <motion.div
                        key={status}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{getStatusLabel(status)}</span>
                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-slate-500 rounded-full">
                                    {getTaskCount(status)}
                                </span>
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {tasksInStatus.map((task, index) => {
                                const isAtRisk = risks.some(risk => risk.taskId === task.id);
                                return (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <TaskItem 
                                            task={task} 
                                            isAtRisk={isAtRisk}
                                            onStatusChange={handleStatusChange}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default Timeline;