import React, { FC, useState, FormEvent, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { VendorData, ComplianceDocument, ComplianceDocumentStatus, COMPLIANCE_DOCUMENT_TYPES, ComplianceDocumentType, LogisticsStatus, User } from '../../types';
import { DocumentArrowUpIcon } from '../icons/DocumentArrowUpIcon';
import { TruckIcon } from '../icons/TruckIcon';
import { StarIcon } from '../icons/StarIcon';
import { ScaleIcon } from '../icons/ScaleIcon';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import StarRating from '../StarRating';
import { useApi } from '../../hooks/useApi';
import SkeletonLoader from '../SkeletonLoader';
import StatCard from '../StatCard';

interface VendorDashboardProps {
    user: User;
}

const statusStyles: { [key in ComplianceDocumentStatus]: { icon: ReactNode; text: string; bg: string; } } = {
    [ComplianceDocumentStatus.Approved]: { icon: <CheckBadgeIcon className="w-4 h-4" />, text: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/30' },
    [ComplianceDocumentStatus.Pending]: { icon: <ClockIcon className="w-4 h-4" />, text: 'text-yellow-700 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    [ComplianceDocumentStatus.Rejected]: { icon: <XCircleIcon className="w-4 h-4" />, text: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/30' },
};

const VendorDashboard: FC<VendorDashboardProps> = ({ user }) => {
    const { data, error, isLoading, mutate } = useApi('/api/vendors/me');

    const [documentName, setDocumentName] = useState('');
    const [documentType, setDocumentType] = useState<ComplianceDocumentType>(COMPLIANCE_DOCUMENT_TYPES[0]);
    const [fileName, setFileName] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!documentName || !fileName) {
            setSubmitError('Please provide a document name and file name.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId: data?.vendorId,
                    documentName,
                    documentType,
                    fileName,
                })
            });
            if (!res.ok) throw new Error('Failed to upload document.');
            
            toast.success('Document submitted for review!');
            mutate(); // Re-fetch vendor data to show the new document
            setDocumentName('');
            setDocumentType(COMPLIANCE_DOCUMENT_TYPES[0]);
            setFileName('');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Could not upload document.');
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <SkeletonLoader type="VendorDashboard" />;
    }
    
    if (error || !data) {
        return <div className="text-center py-10 text-red-500">Failed to load vendor data. Please contact support.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Vendor Portal</h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">Welcome, <span className="font-semibold">{data.vendorId}</span>. Manage your event participation here.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<TruckIcon />} title="On-Time %" value={`${data.performance.onTimePercentage}%`} colorClass="text-blue-500" />
                <StatCard icon={<ScaleIcon />} title="Compliance Score" value={`${data.performance.complianceScore}/100`} colorClass="text-green-500" />
                <StatCard icon={<StarIcon />} title="Organizer Rating" value={<StarRating rating={data.performance.organizerRating} readOnly />} colorClass="text-yellow-500" />
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Compliance Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Document List */}
                    <div className="space-y-3">
                         <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                             Submitted Documents
                        </h4>
                        {data.documents.length > 0 ? data.documents.map(doc => {
                            const styles = statusStyles[doc.status];
                            return (
                                <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.documentName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{doc.documentType}</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                                            {styles.icon}
                                            <span>{doc.status}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <PaperClipIcon className="w-3 h-3" />
                                            <span className="italic">{doc.fileName}</span>
                                        </div>
                                        <span>Submitted: {doc.submittedDate}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                             <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No documents submitted yet.</p>
                        )}
                    </div>
                    {/* Upload Form */}
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                             <DocumentArrowUpIcon className="w-5 h-5 text-blue-500" />
                             Upload New Document
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                            <div>
                                <label htmlFor="doc-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Document Name</label>
                                <input id="doc-name" type="text" value={documentName} onChange={e => setDocumentName(e.target.value)} placeholder="e.g., General Liability 2025" className="mt-1 bg-white dark:bg-slate-700 w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm text-sm" />
                            </div>
                            <div>
                                <label htmlFor="doc-type" className="text-sm font-medium text-slate-700 dark:text-slate-300">Document Type</label>
                                <select id="doc-type" value={documentType} onChange={e => setDocumentType(e.target.value as ComplianceDocumentType)} className="mt-1 bg-white dark:bg-slate-700 w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm text-sm">
                                    {COMPLIANCE_DOCUMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="doc-file" className="text-sm font-medium text-slate-700 dark:text-slate-300">File Name (simulated)</label>
                                <input id="doc-file" type="text" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="e.g., liability_2025.pdf" className="mt-1 bg-white dark:bg-slate-700 w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm text-sm" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 disabled:bg-blue-400">
                               {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;