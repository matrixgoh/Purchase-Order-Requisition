
import { FormData, INITIAL_FORM_DATA, RequisitionStatus } from '../types';

const STORAGE_KEY = 'quantum_requisitions';

export const saveRequisition = (data: FormData): void => {
  const stored = getRequisitions();
  const index = stored.findIndex(r => r.id === data.id);
  
  if (index >= 0) {
    stored[index] = data;
  } else {
    stored.push(data);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
};

export const getRequisitions = (): FormData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getRequisitionById = (id: string): FormData | undefined => {
  return getRequisitions().find(r => r.id === id);
};

export const createNewRequisition = (): FormData => {
  return {
    ...INITIAL_FORM_DATA,
    id: `REQ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Draft'
  };
};

export const deleteRequisition = (id: string): void => {
  const stored = getRequisitions();
  const filtered = stored.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateStatus = (id: string, status: RequisitionStatus, approverName?: string, role?: 'teamLeader' | 'director'): void => {
  const stored = getRequisitions();
  const index = stored.findIndex(r => r.id === id);
  if (index >= 0) {
    stored[index].status = status;
    const dateStr = new Date().toISOString().split('T')[0];

    // Logic to auto-sign based on role approval
    if (status === 'Pending Director' && role === 'teamLeader' && approverName) {
      stored[index].approvalTeamLeader = { name: approverName, date: dateStr };
    } else if (status === 'Approved' && role === 'director' && approverName) {
      stored[index].approvalDirector = { name: approverName, date: dateStr };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
};
