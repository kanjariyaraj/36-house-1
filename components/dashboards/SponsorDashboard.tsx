import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { SponsorData, SponsorshipPackageTier } from '../../types';
import { TrophyIcon } from '../icons/TrophyIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { ArrowTrendingUpIcon } from '../icons/ArrowTrendingUpIcon';
import { ArrowDownTrayIcon } from '../icons/ArrowDownTrayIcon';
import { useApi } from '../../hooks/useApi';
import SkeletonLoader from '../SkeletonLoader';
import StatCard from '../StatCard';


interface SponsorDashboardProps {}

const packageStyles = {
    [SponsorshipPackageTier.Gold]: { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/40', border: 'border-yellow-500' },
    [SponsorshipPackageTier.Silver]: { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-200 dark:bg-slate-700/40', border: 'border-slate-500' },
    [SponsorshipPackageTier.Bronze]: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-500' },
};

const SponsorDashboard: FC<SponsorDashboardProps> = () => {
    const { data, isLoading, error } = useApi('/api/sponsors/me');

    if (isLoading) {
        return <SkeletonLoader type="SponsorDashboard" />;
    }

    if (error || !data) {
        return <div className="text-center py-10 text-red-500">Failed to load sponsor data. Please contact support.</div>;
    }

    const tierStyles = packageStyles[data.packageTier];

    const handleDownload = (format: 'csv' | 'excel') => {
        console.log(`Downloading leads as ${format.toUpperCase()}...`);
        alert(`Simulating download of leads as a ${format.toUpperCase()} file.`);
    };
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sponsor Dashboard</h2>
                    <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">Welcome, <span className="font-semibold">{data.sponsorName}</span>!</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${tierStyles.bg} ${tierStyles.text}`}>
                    <TrophyIcon className="w-5 h-5" />
                    <span>{data.packageTier} Sponsor</span>
                </div>
            </div>

            {/* Key Metrics */}
            <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <StatCard 
                        icon={<UsersIcon />} 
                        title="Leads Captured" 
                        value={data.leads.length} 
                        colorClass="text-blue-500"
                    />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <StatCard 
                        icon={<ChartBarIcon />} 
                        title="Booth Visits" 
                        value={data.boothVisits.toLocaleString()}
                         colorClass="text-purple-500"
                    />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                    <StatCard 
                        icon={<ArrowTrendingUpIcon />} 
                        title="Simulated ROI" 
                        value={`${data.roi}%`}
                         colorClass="text-green-500"
                    />
                </motion.div>
            </motion.div>

            {/* Lead Tracking & Reporting */}
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lead Tracking</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Attendees who visited your booth and were scanned.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => handleDownload('csv')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            CSV
                        </button>
                         <button onClick={() => handleDownload('excel')} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Excel
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-l-lg">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3 rounded-r-lg">Time Scanned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.leads.map(lead => (
                                <tr key={lead.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-600/30">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                        {lead.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {lead.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(lead.scannedAt).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SponsorDashboard;