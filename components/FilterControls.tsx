import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { TaskStatus } from '../types';

interface FilterControlsProps {
    activeFilter: TaskStatus | 'All';
    onFilterChange: (filter: TaskStatus | 'All') => void;
}

const FilterControls: FC<FilterControlsProps> = ({ activeFilter, onFilterChange }) => {
    const filters: (TaskStatus | 'All')[] = [
        'All',
        TaskStatus.Upcoming,
        TaskStatus.InProgress,
        TaskStatus.Completed,
        TaskStatus.AtRisk,
        TaskStatus.Delayed
    ];

    const getFilterLabel = (filter: TaskStatus | 'All') => {
        if (filter === 'All') return 'All Tasks';
        return filter;
    };

    return (
        <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {filters.map((filter) => (
                <motion.button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                        activeFilter === filter
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {getFilterLabel(filter)}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default FilterControls;