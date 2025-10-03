// types.ts

export enum TaskStatus {
    Upcoming = 'Upcoming',
    InProgress = 'In Progress',
    Completed = 'Completed',
    AtRisk = 'At Risk',
    Delayed = 'Delayed',
}

export interface EventTask {
    id: number;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: TaskStatus;
}

export interface IdentifiedRisk {
    taskId: number;
    risk: string;
    suggestion: string;
    severity: 'High' | 'Medium' | 'Low';
}

export interface RiskAnalysis {
    overallRiskLevel: 'Low' | 'Medium' | 'High';
    summary: string;
    risks: IdentifiedRisk[];
}

export enum UserRole {
    Organizer = 'Organizer',
    Attendee = 'Attendee',
    Vendor = 'Vendor',
    Sponsor = 'Sponsor',
    Admin = 'Admin',
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
}

export enum ComplianceDocumentStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export const COMPLIANCE_DOCUMENT_TYPES = [
    'General Liability Insurance',
    'Worker\'s Compensation',
    'Food Handler Certification',
    'Business License',
    'W-9 Form',
    'Other'
] as const;

export type ComplianceDocumentType = typeof COMPLIANCE_DOCUMENT_TYPES[number];


export interface ComplianceDocument {
    id: number;
    vendorId: string; // Corresponds to assignee name for simplicity
    documentName: string;
    documentType: ComplianceDocumentType;
    fileName: string; // Simulate file upload with just the name
    submittedDate: string;
    status: ComplianceDocumentStatus;
}

export enum SponsorshipPackageTier {
    Gold = 'Gold',
    Silver = 'Silver',
    Bronze = 'Bronze',
}

export interface SponsorLead {
    id: number;
    name: string;
    email: string;
    scannedAt: string; // ISO timestamp
}

export interface SponsorData {
    sponsorName: string;
    packageTier: SponsorshipPackageTier;
    leads: SponsorLead[];
    boothVisits: number;
    roi: number; // Represented as a percentage
}

export enum VendorComplianceStatus {
    Approved = 'Approved',
    Pending = 'Pending',
    Rejected = 'Rejected',
}

export interface VendorWithCompliance {
    id: string; // vendorId
    status: VendorComplianceStatus;
    documents: ComplianceDocument[];
}

export enum LogisticsStatus {
    Scheduled = 'Scheduled',
    InProgress = 'In Progress',
    Completed = 'Completed',
}

export interface LogisticsTask {
    id: number;
    taskName: string;
    scheduledTime: string;
    status: LogisticsStatus;
}

export interface VendorPerformanceData {
    onTimePercentage: number;
    complianceScore: number;
    organizerRating: number; // out of 5
}

export interface VendorData {
    vendorId: string;
    performance: VendorPerformanceData;
    logistics: LogisticsTask[];
    documents: ComplianceDocument[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}


// Defines a map for API endpoints to ensure type safety and consistency
export type ApiEndpoints = {
    '/api/tasks': EventTask[];
    '/api/vendors': VendorData[];
    '/api/vendors/me': VendorData;
    '/api/attendees': User[];
    '/api/sponsors/me': SponsorData;
    '/api/risks': RiskAnalysis; // Added for type safety
    '/api/chatbot': { response: string };
};