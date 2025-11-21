
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ApprovalInfo {
  name: string;
  date: string; // YYYY-MM-DD
}

export type RequisitionStatus = 'Draft' | 'Pending Team Leader' | 'Pending Director' | 'Approved' | 'Rejected';
export type UserRole = 'Requestor' | 'Team Leader' | 'Director';

export interface FormData {
  id: string; // Unique ID
  status: RequisitionStatus;
  createdAt: string;

  // Header/Tracking
  deptTrackingNo: string;
  date: string;
  branch: string;
  dept: string;
  requestorName: string;

  // Vendor
  vendorCode: string;
  vendorDetails: string; // Text area for the blank lines

  // Table
  lineItems: LineItem[];

  // Approvals
  approvalRequestor: ApprovalInfo;
  approvalTeamLeader: ApprovalInfo;
  approvalDirector: ApprovalInfo;

  // Footer
  enteredBy: string;
  enteredDate: string;
  spoNo: string;
}

export const INITIAL_FORM_DATA: FormData = {
  id: '',
  status: 'Draft',
  createdAt: '',
  deptTrackingNo: '',
  date: new Date().toISOString().split('T')[0],
  branch: '',
  dept: '',
  requestorName: '',
  vendorCode: '',
  vendorDetails: '',
  lineItems: [
    { id: '1', description: '', quantity: 0, unitPrice: 0 },
    { id: '2', description: '', quantity: 0, unitPrice: 0 },
    { id: '3', description: '', quantity: 0, unitPrice: 0 },
    { id: '4', description: '', quantity: 0, unitPrice: 0 },
  ],
  approvalRequestor: { name: '', date: '' },
  approvalTeamLeader: { name: '', date: '' },
  approvalDirector: { name: '', date: '' },
  enteredBy: '',
  enteredDate: '',
  spoNo: '',
};
