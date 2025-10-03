import React, { FC, useState, useEffect } from 'react';
// FIX: Imported RiskAnalysis type to resolve compilation error.
import { EventTask, IdentifiedRisk, User, RiskAnalysis } from '../../types';
import Timeline from '../Timeline';
import { getRecommendedSessions } from '../../services/recommendationService';
import { LightBulbIcon } from '../icons/LightBulbIcon';
import DigitalBadge from '../DigitalBadge';
import { useApi } from '../../hooks/useApi';
import SkeletonLoader from '../SkeletonLoader';
import Chatbot from '../Chatbot';

interface AttendeeDashboardProps {
    user: User;
}

// Simulate that the attendee is registered for these marketing-related events
const INTERESTED_TASK_IDS = [3, 8]; 

const AttendeeDashboard: FC<AttendeeDashboardProps> = ({ user }) => {
    // FIX: Removed explicit generic types from useApi calls, as they are inferred from the URL.
    const { data: tasks, isLoading, error } = useApi('/api/tasks');
    const { data: riskAnalysis } = useApi('/api/risks');
    
    const [recommendedTasks, setRecommendedTasks] = useState<EventTask[]>([]);
    const [isCheckedIn, setIsCheckedIn] = useState(false); // Can be enhanced with backend state

    useEffect(() => {
        if (tasks && tasks.length > 0) {
            const recommendations = getRecommendedSessions(tasks, INTERESTED_TASK_IDS, 3);
            setRecommendedTasks(recommendations);
        }
    }, [tasks]);

    const interestedTasks = tasks?.filter(t => INTERESTED_TASK_IDS.includes(t.id)) || [];

    if (isLoading) {
        return <SkeletonLoader type="AttendeeDashboard" />
    }
    
    if (error) {
        return <div className="text-center py-10 text-red-500">Failed to load event data. Please try again later.</div>
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Event Schedule</h2>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">Here is the current schedule of events and key deadlines.</p>
                    </div>

                    {recommendedTasks.length > 0 && (
                        <div className="mb-10 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-4">
                                <LightBulbIcon className="w-7 h-7 text-yellow-500" />
                                Recommended For You
                            </h3>
                            {interestedTasks.length > 0 && (
                                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                                    Based on your interest in sessions like "{interestedTasks.map(t => t.title).join('" and "')}".
                                </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                {recommendedTasks.map(task => (
                                    <div key={task.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{task.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="max-w-3xl">
                        <Timeline tasks={tasks || []} risks={riskAnalysis?.risks || []} />
                    </div>
                </div>
                 <div className="lg:col-span-1">
                    <DigitalBadge user={user} isCheckedIn={isCheckedIn} />
                </div>
            </div>
            <Chatbot />
        </>
    );
};

export default AttendeeDashboard;