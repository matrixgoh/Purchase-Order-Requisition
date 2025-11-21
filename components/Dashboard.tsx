
import React from 'react';
import { FormData, RequisitionStatus, UserRole } from '../types';
import { FileText, Plus, Trash2, Edit, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  requisitions: FormData[];
  onEdit: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  currentRole: UserRole;
}

const StatusBadge: React.FC<{ status: RequisitionStatus }> = ({ status }) => {
  const styles = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Pending Team Leader': 'bg-blue-100 text-blue-800',
    'Pending Director': 'bg-purple-100 text-purple-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const Dashboard: React.FC<Props> = ({ requisitions, onEdit, onNew, onDelete, currentRole }) => {
  
  // Filter Logic based on Role
  let filteredRequisitions = requisitions;

  if (currentRole === 'Team Leader') {
    // Team Leaders see items needing their approval OR items they might have approved previously
    filteredRequisitions = requisitions.filter(r => 
      r.status === 'Pending Team Leader' || r.status === 'Pending Director' || r.status === 'Approved' || r.status === 'Rejected'
    );
  } else if (currentRole === 'Director') {
    // Directors see items needing their approval OR final items
    filteredRequisitions = requisitions.filter(r => 
      r.status === 'Pending Director' || r.status === 'Approved' || r.status === 'Rejected'
    );
  }
  // Requestors see everything

  // Sort by date descending
  const sortedRequisitions = [...filteredRequisitions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-xl p-8 border border-gray-200 min-h-[500px]">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Requisition Dashboard</h2>
            <p className="text-gray-500 text-sm">Role: <span className="font-semibold text-brand-accent">{currentRole}</span></p>
        </div>
        {currentRole === 'Requestor' && (
          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-brand-accent hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
          >
            <Plus size={16} /> New Requisition
          </button>
        )}
      </div>

      {sortedRequisitions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No requisitions found</p>
          {currentRole === 'Requestor' ? (
             <p className="text-gray-400 text-sm mt-1">Create a new one to get started</p>
          ) : (
            <p className="text-gray-400 text-sm mt-1">No items pending your review</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Total (RM)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequisitions.map((req) => {
                 const total = req.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                 const firstItem = req.lineItems[0]?.description || 'No items';
                 const desc = req.lineItems.length > 1 ? `${firstItem} + ${req.lineItems.length - 1} more` : firstItem;

                 // Determine action icon
                 let ActionIcon = Eye;
                 let actionTitle = "View";
                 
                 if (currentRole === 'Requestor' && req.status === 'Draft') {
                   ActionIcon = Edit;
                   actionTitle = "Edit";
                 } else if (currentRole === 'Team Leader' && req.status === 'Pending Team Leader') {
                   ActionIcon = Edit; // Or a Review icon
                   actionTitle = "Review & Approve";
                 } else if (currentRole === 'Director' && req.status === 'Pending Director') {
                   ActionIcon = Edit;
                   actionTitle = "Final Approval";
                 }

                 return (
                  <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{req.id.split('-')[1] || req.id}</td>
                    <td className="px-4 py-3">{req.date}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]" title={desc}>{desc}</td>
                    <td className="px-4 py-3 text-right font-mono">{total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onEdit(req.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title={actionTitle}
                        >
                          <ActionIcon size={16} />
                        </button>
                        {currentRole === 'Requestor' && req.status === 'Draft' && (
                          <button 
                            onClick={() => onDelete(req.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
