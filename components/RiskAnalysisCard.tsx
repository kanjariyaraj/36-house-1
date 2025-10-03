import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { RiskAnalysis, IdentifiedRisk } from '../types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface RiskAnalysisCardProps {
    analysis: RiskAnalysis | null;
}

const RiskAnalysisCard: FC<RiskAnalysisCardProps> = ({ analysis }) => {
    if (!analysis) {
        return (
            <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <ExclamationTriangleIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Analysis Yet</h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Click "Analyze Timeline" to get AI-powered risk insights.
                </p>
            </motion.div>
        );
    }

    const getRiskColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
            case 'Medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
            case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
        }
    };

    const getOverallRiskColor = (level: string) => {
        switch (level) {
            case 'High': return 'text-red-600 dark:text-red-400';
            case 'Medium': return 'text-amber-600 dark:text-amber-400';
            case 'Low': return 'text-green-600 dark:text-green-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900 dark:text-white">Overall Risk Level</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getOverallRiskColor(analysis.overallRiskLevel)}`}>
                        {analysis.overallRiskLevel}
                    </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {analysis.summary}
                </p>
            </div>

            {analysis.risks.length > 0 ? (
                <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 dark:text-white">Identified Risks</h4>
                    <div className="space-y-3">
                        {analysis.risks.map((risk: IdentifiedRisk, index: number) => (
                            <motion.div
                                key={risk.taskId}
                                className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-medium text-slate-900 dark:text-white">Task #{risk.taskId}</h5>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(risk.severity)}`}>
                                                {risk.severity}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                                            {risk.risk}
                                        </p>
                                        <div className="mt-3 flex items-start gap-2">
                                            <LightBulbIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-slate-700 dark:text-slate-300 text-sm">
                                                <span className="font-medium">Suggestion:</span> {risk.suggestion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1">No Risks Identified</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Your timeline looks good! No immediate risks detected.
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default RiskAnalysisCard;