
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LineItemsTable from './components/LineItemsTable';
import AiAssistant from './components/AiAssistant';
import Dashboard from './components/Dashboard';
import { FormData, INITIAL_FORM_DATA, UserRole, RequisitionStatus } from './types';
import { Printer, RotateCcw, Download, ArrowLeft, Save, Send, CheckCircle, XCircle, User, Users } from 'lucide-react';
import { createNewRequisition, getRequisitions, getRequisitionById, saveRequisition, deleteRequisition, updateStatus } from './services/storageService';

const App: React.FC = () => {
  // Navigation & Role State
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('Requestor');
  const [requisitions, setRequisitions] = useState<FormData[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  
  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRequisitions(getRequisitions());
  };

  const handleRoleSwitch = () => {
    setUserRole(prev => {
      if (prev === 'Requestor') return 'Team Leader';
      if (prev === 'Team Leader') return 'Director';
      return 'Requestor';
    });
    // Go back to dashboard when switching roles to see relevant items
    setView('dashboard');
  };

  const handleNewRequisition = () => {
    const newReq = createNewRequisition();
    // Pre-fill current user if needed
    newReq.requestorName = userRole === 'Requestor' ? 'Current User' : ''; 
    setFormData(newReq);
    setView('form');
  };

  const handleEditRequisition = (id: string) => {
    const req = getRequisitionById(id);
    if (req) {
      setFormData(req);
      setView('form');
    }
  };

  const handleDeleteRequisition = (id: string) => {
    if (window.confirm("Are you sure you want to delete this requisition?")) {
      deleteRequisition(id);
      refreshData();
    }
  };

  const handleSaveDraft = () => {
    saveRequisition(formData);
    refreshData();
    alert("Draft saved successfully!");
  };

  const handleSubmit = () => {
    if (!formData.vendorCode || formData.lineItems.length === 0) {
      alert("Please fill in vendor code and at least one line item.");
      return;
    }
    // Initial submission moves to Team Leader and records requestor information
    const currentDate = new Date().toISOString().split('T')[0];
    const updated = { 
      ...formData, 
      status: 'Pending Team Leader' as RequisitionStatus,
      approvalRequestor: {
        name: formData.requestorName || 'Current User',
        date: currentDate
      }
    };
    saveRequisition(updated);
    refreshData();
    setView('dashboard');
    alert("Requisition submitted to Team Leader.");
  };

  // Workflow Actions
  const handleTeamLeaderApprove = () => {
    updateStatus(formData.id, 'Pending Director', 'Alex TeamLeader', 'teamLeader');
    refreshData();
    setView('dashboard');
    alert("Approved by Team Leader. Forwarded to Director.");
  };

  const handleDirectorApprove = () => {
    updateStatus(formData.id, 'Approved', 'Sarah Director', 'director');
    refreshData();
    setView('dashboard');
    alert("Final Approval Complete.");
  };

  const handleReject = () => {
    updateStatus(formData.id, 'Rejected');
    refreshData();
    setView('dashboard');
    alert("Requisition Rejected.");
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateApproval = (role: 'requestor' | 'teamLeader' | 'director', field: 'name' | 'date', value: string) => {
    const key = role === 'requestor' ? 'approvalRequestor' : role === 'teamLeader' ? 'approvalTeamLeader' : 'approvalDirector';
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const updateFooter = (field: 'enteredBy' | 'enteredDate' | 'spoNo', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to manage the vendor lines
  const vendorLines = formData.vendorDetails ? formData.vendorDetails.split('\n') : [];
  while (vendorLines.length < 4) vendorLines.push('');

  const handleVendorLineChange = (index: number, value: string) => {
    const newLines = [...vendorLines];
    newLines[index] = value;
    const fourLines = newLines.slice(0, 4); 
    updateFormData('vendorDetails', fourLines.join('\n'));
  };

  const handleAiData = (data: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      lineItems: data.lineItems || prev.lineItems
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-content-root');
    const opt = {
      margin: 0,
      filename: `Quantum_Req_${formData.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css', avoid: '.avoid-break' }
    };
    // @ts-ignore
    if (window.html2pdf) window.html2pdf().set(opt).from(element).save();
  };

  // PDF Pagination Logic
  const ROWS_PER_PAGE_1 = 10; 
  const ROWS_PER_PAGE_N = 18; 
  const getPdfPages = () => {
    const pages = [];
    const items = [...formData.lineItems];
    const page1Items = items.splice(0, ROWS_PER_PAGE_1);
    pages.push({ type: 'first', items: page1Items });
    while (items.length > 0) {
      const nextItems = items.splice(0, ROWS_PER_PAGE_N);
      pages.push({ type: 'subsequent', items: nextItems });
    }
    return pages;
  };
  const pdfPages = getPdfPages();

  // Determine if current user can edit the form fields
  const isEditable = userRole === 'Requestor' && formData.status === 'Draft';

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-gray-100 font-sans text-gray-900">
      
      {/* Role Switcher & Top Bar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print">
         <div className="flex items-center gap-4">
           <div className="bg-white px-3 py-1 rounded-full border shadow-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={handleRoleSwitch}>
              <Users size={16} className="text-brand-accent"/>
              <span className="text-sm font-medium">Current Role: <span className="font-bold">{userRole}</span></span>
              <span className="text-xs text-gray-400 ml-1">(Click to switch)</span>
           </div>
         </div>
      </div>

      {view === 'dashboard' ? (
        <Dashboard 
          requisitions={requisitions}
          onNew={handleNewRequisition}
          onEdit={handleEditRequisition}
          onDelete={handleDeleteRequisition}
          currentRole={userRole}
        />
      ) : (
        <>
          {/* Form Toolbar */}
          <div className="max-w-[210mm] mx-auto flex justify-between gap-3 mb-6 no-print sticky top-4 z-10 pointer-events-none">
            <div className="pointer-events-auto">
               <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-md transition-colors border border-gray-300 text-sm font-medium shadow-sm"
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            
            <div className="flex gap-2 pointer-events-auto">
              {/* Requestor Actions */}
              {userRole === 'Requestor' && formData.status === 'Draft' && (
                <>
                  <button onClick={handleSaveDraft} className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 text-sm font-medium shadow-sm">
                    <Save size={16} /> Save Draft
                  </button>
                  <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium shadow-sm">
                    <Send size={16} /> Submit
                  </button>
                </>
              )}

              {/* Team Leader Actions */}
              {userRole === 'Team Leader' && formData.status === 'Pending Team Leader' && (
                <>
                  <button onClick={handleReject} className="flex items-center gap-2 px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium shadow-sm">
                    <XCircle size={16} /> Reject
                  </button>
                  <button onClick={handleTeamLeaderApprove} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium shadow-sm">
                    <CheckCircle size={16} /> Approve
                  </button>
                </>
              )}

              {/* Director Actions */}
              {userRole === 'Director' && formData.status === 'Pending Director' && (
                <>
                  <button onClick={handleReject} className="flex items-center gap-2 px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium shadow-sm">
                    <XCircle size={16} /> Reject
                  </button>
                  <button onClick={handleDirectorApprove} className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium shadow-sm">
                    <CheckCircle size={16} /> Final Approval
                  </button>
                </>
              )}

              {/* Common Actions */}
              <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 text-sm font-medium shadow-sm">
                <Printer size={16} /> Print
              </button>
              <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary hover:bg-brand-dark rounded-md text-sm font-medium shadow-sm">
                <Download size={16} /> PDF
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className="max-w-[210mm] mx-auto mb-4 no-print">
             {formData.status === 'Draft' && <div className="bg-gray-100 text-gray-700 p-3 rounded-md text-sm border border-gray-200">Status: <span className="font-bold">Draft</span> - Editable by Requestor</div>}
             {formData.status === 'Pending Team Leader' && <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm border border-blue-200">Status: <span className="font-bold">Pending Team Leader Approval</span></div>}
             {formData.status === 'Pending Director' && <div className="bg-purple-50 text-purple-800 p-3 rounded-md text-sm border border-purple-200">Status: <span className="font-bold">Pending Director Approval</span></div>}
             {formData.status === 'Approved' && <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm border border-green-200">Status: <span className="font-bold">Approved</span></div>}
             {formData.status === 'Rejected' && <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm border border-red-200">Status: <span className="font-bold">Rejected</span></div>}
          </div>

          {/* Interactive Form Editor */}
          <div id="form-editor" className={`max-w-[210mm] mx-auto bg-white shadow-xl p-8 border border-gray-200 ${!isEditable ? 'opacity-90 pointer-events-none select-text' : ''}`}>
              <Header />
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-full md:w-1/2 border-2 border-black flex flex-col">
                  <div className="flex border-b border-black h-10 shrink-0">
                    <div className="w-2/3 px-2 flex items-center text-sm font-bold bg-gray-50 border-r border-black">
                      Vendor Code <span className="font-normal text-xs ml-1">(mandatory)</span>
                    </div>
                    <div className="w-1/3">
                      <input 
                        type="text" 
                        disabled={!isEditable}
                        className="w-full h-full px-2 outline-none bg-white text-center font-mono disabled:bg-gray-50"
                        value={formData.vendorCode}
                        onChange={(e) => updateFormData('vendorCode', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white min-h-[8rem]">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`flex-1 ${i < 3 ? 'border-b border-black' : ''} relative`}>
                          <input 
                            type="text"
                            disabled={!isEditable}
                            className="absolute inset-0 w-full h-full px-2 outline-none bg-transparent disabled:bg-gray-50"
                            placeholder={i === 0 && isEditable ? "Vendor Name & Address" : ""}
                            value={vendorLines[i]}
                            onChange={(e) => handleVendorLineChange(i, e.target.value)}
                          />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-between py-1 text-sm">
                  {[
                    { label: 'Dept Tracking No (if any)', key: 'deptTrackingNo', type: 'text' },
                    { label: 'Date', key: 'date', type: 'date' },
                    { label: 'Branch', key: 'branch', type: 'text' },
                    { label: 'Dept', key: 'dept', type: 'text' },
                    { label: 'Requestor Name', key: 'requestorName', type: 'text' }
                  ].map((field) => (
                    <div key={field.key} className="flex items-end mb-2">
                      <label className="font-bold text-right w-44 pr-2 whitespace-nowrap">{field.label} :</label>
                      <div className="flex-1 border-b-2 border-black">
                        <input 
                          type={field.type} 
                          disabled={!isEditable}
                          className="w-full px-1 outline-none bg-transparent disabled:text-gray-600"
                          value={(formData as any)[field.key]}
                          onChange={(e) => updateFormData(field.key as keyof FormData, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <LineItemsTable 
                items={formData.lineItems} 
                onChange={(items) => updateFormData('lineItems', items)} 
                readOnly={!isEditable}
              />

              <div className="border-2 border-black mb-6">
                 <div className="grid grid-cols-3 border-b-2 border-black bg-gray-200 text-center font-bold text-sm">
                    <div className="p-2 border-r-2 border-black">Requestor</div>
                    <div className="p-2 border-r-2 border-black">Approval by Team Leader/ <br/> Manager/ Senior Manager</div>
                    <div className="p-2">Approval by Associate Director/ <br/> Director/ Vice President</div>
                 </div>
                 <div className="grid grid-cols-3 h-32">
                   {['requestor', 'teamLeader', 'director'].map((role, idx) => {
                     const roleKey = role === 'requestor' ? 'approvalRequestor' : role === 'teamLeader' ? 'approvalTeamLeader' : 'approvalDirector';
                     const data = (formData as any)[roleKey];
                     return (
                       <div key={role} className={`p-3 flex flex-col justify-end ${idx < 2 ? 'border-r-2 border-black' : ''}`}>
                          <div className="flex-1"></div>
                          <div className="w-full border-t border-black pt-1 mb-2"></div>
                          <div className="mb-1 flex items-center">
                             <span className="text-xs font-bold w-12">Name:</span>
                             <input 
                                type="text" 
                                disabled={true} 
                                className="flex-1 border-b border-black border-dotted outline-none text-sm bg-transparent"
                                value={data.name}
                                onChange={(e) => updateApproval(role as any, 'name', e.target.value)}
                             />
                           </div>
                           <div className="flex items-center">
                             <span className="text-xs font-bold w-12">Date:</span>
                             <input 
                                type="text" 
                                disabled={true}
                                className="flex-1 border-b border-black border-dotted outline-none text-xs bg-transparent"
                                value={data.date}
                                onChange={(e) => updateApproval(role as any, 'date', e.target.value)}
                             />
                           </div>
                       </div>
                     )
                   })}
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                 <div className="flex items-center gap-2">
                    <span className="font-medium">Entered by</span>
                    <input value={formData.enteredBy} disabled={!isEditable} onChange={e => updateFooter('enteredBy', e.target.value)} className="border border-black p-1 w-40 disabled:bg-gray-50" />
                 </div>
                 <div className="flex items-center gap-2 ml-4">
                    <span className="font-medium">Date</span>
                    <input type="date" value={formData.enteredDate} disabled={!isEditable} onChange={e => updateFooter('enteredDate', e.target.value)} className="border border-black p-1 w-32 disabled:bg-gray-50" />
                 </div>
                 <div className="flex items-center gap-2 ml-auto">
                    <span className="font-medium">SPO No :</span>
                    <input value={formData.spoNo} disabled={!isEditable} onChange={e => updateFooter('spoNo', e.target.value)} className="border border-black p-1 w-40 disabled:bg-gray-50" />
                 </div>
              </div>
          </div>

          {/* Hidden PDF Template (Same as before) */}
          <div className="pdf-container">
             <div id="pdf-content-root">
                {pdfPages.map((page, index) => (
                  <div key={index} className="pdf-page">
                     <Header />
                     {page.type === 'first' && (
                       <div className="flex flex-row gap-6 mb-2 h-[45mm]">
                          <div className="w-1/2 border border-black-strong flex flex-col">
                            <div className="flex border-b border-black-strong h-8 shrink-0">
                              <div className="w-2/3 px-2 flex items-center text-xs font-bold bg-gray-50 border-r border-black-strong">
                                Vendor Code <span className="font-normal text-[10px] ml-1">(mandatory)</span>
                              </div>
                              <div className="w-1/3 flex items-center justify-center font-mono text-sm">
                                {formData.vendorCode}
                              </div>
                            </div>
                            <div className="flex-1 p-2 text-sm whitespace-pre-wrap leading-6">
                               {formData.vendorDetails}
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-col justify-between py-1 text-xs">
                             {[
                                { label: 'Dept Tracking No (if any)', val: formData.deptTrackingNo },
                                { label: 'Date', val: formData.date },
                                { label: 'Branch', val: formData.branch },
                                { label: 'Dept', val: formData.dept },
                                { label: 'Requestor Name', val: formData.requestorName }
                              ].map((f) => (
                                <div key={f.label} className="flex items-end">
                                  <label className="font-bold text-right w-40 pr-2">{f.label} :</label>
                                  <div className="flex-1 border-b border-black-strong px-1 h-5">
                                    {f.val}
                                  </div>
                                </div>
                              ))}
                          </div>
                       </div>
                     )}

                     <div className="flex-1 flex flex-col">
                        <table className="w-full border-collapse border border-black-strong text-xs">
                          <thead>
                            <tr className="bg-gray-300 font-bold text-gray-900 h-8">
                              <th className="border border-black-strong w-[5%] text-center">No</th>
                              <th className="border border-black-strong w-[50%] text-left pl-2">Description</th>
                              <th className="border border-black-strong w-[10%] text-center">Qty</th>
                              <th className="border border-black-strong w-[15%] text-right pr-2">Unit Price</th>
                              <th className="border border-black-strong w-[20%] text-right pr-2">Amount (RM)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {page.items.map((item, i) => {
                              const globalIndex = page.type === 'first' ? i + 1 : ROWS_PER_PAGE_1 + ((index - 1) * ROWS_PER_PAGE_N) + i + 1;
                              return (
                                <tr key={item.id} className="h-8">
                                  <td className="border border-black-strong text-center">{globalIndex}</td>
                                  <td className="border border-black-strong px-2">{item.description}</td>
                                  <td className="border border-black-strong text-center">{item.quantity || ''}</td>
                                  <td className="border border-black-strong text-right pr-2">{item.unitPrice ? item.unitPrice.toFixed(2) : ''}</td>
                                  <td className="border border-black-strong text-right pr-2 bg-gray-50 font-mono">
                                    {item.quantity && item.unitPrice ? (item.quantity * item.unitPrice).toFixed(2) : '0.00'}
                                  </td>
                                </tr>
                              );
                            })}
                            {Array.from({ length: (page.type === 'first' ? ROWS_PER_PAGE_1 : ROWS_PER_PAGE_N) - page.items.length }).map((_, i) => (
                               <tr key={`empty-${i}`} className="h-8">
                                  <td className="border border-black-strong"></td>
                                  <td className="border border-black-strong"></td>
                                  <td className="border border-black-strong"></td>
                                  <td className="border border-black-strong"></td>
                                  <td className="border border-black-strong text-right pr-2">0.00</td>
                               </tr>
                            ))}
                          </tbody>
                          {index === pdfPages.length - 1 && (
                             <tfoot>
                               <tr className="bg-gray-300 font-bold h-8">
                                 <td colSpan={4} className="border border-black-strong text-right pr-2 uppercase">Total</td>
                                 <td className="border border-black-strong text-right pr-2">
                                   {formData.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0).toFixed(2)}
                                 </td>
                               </tr>
                             </tfoot>
                          )}
                        </table>

                        {index === pdfPages.length - 1 && (
                          <div className="mt-auto pt-4">
                             <div className="border border-black-strong mb-4">
                                 <div className="grid grid-cols-3 border-b border-black-strong bg-gray-200 text-center font-bold text-xs h-10 items-center">
                                    <div className="border-r border-black-strong h-full flex items-center justify-center">Requestor</div>
                                    <div className="border-r border-black-strong h-full flex items-center justify-center">Approval by Team Leader</div>
                                    <div className="h-full flex items-center justify-center">Approval by Director</div>
                                 </div>
                                 <div className="grid grid-cols-3 h-[35mm]">
                                    {[formData.approvalRequestor, formData.approvalTeamLeader, formData.approvalDirector].map((app, i) => (
                                      <div key={i} className={`p-2 flex flex-col justify-end ${i < 2 ? 'border-r border-black-strong' : ''}`}>
                                         <div className="border-t border-black-strong mb-2"></div>
                                         <div className="flex text-xs mb-1">
                                           <span className="font-bold w-10">Name:</span>
                                           <span className="flex-1 border-b border-black-strong border-dotted">{app.name}</span>
                                         </div>
                                         <div className="flex text-xs">
                                           <span className="font-bold w-10">Date:</span>
                                           <span className="flex-1 border-b border-black-strong border-dotted">{app.date}</span>
                                         </div>
                                      </div>
                                    ))}
                                 </div>
                             </div>
                             <div className="flex text-xs items-center justify-between px-1 pb-2">
                                <div className="flex gap-2">
                                  <span className="font-bold">Entered by</span>
                                  <div className="border border-black-strong w-32 px-1 h-5">{formData.enteredBy}</div>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-bold">Date</span>
                                  <div className="border border-black-strong w-24 px-1 h-5">{formData.enteredDate}</div>
                                </div>
                                 <div className="flex gap-2">
                                  <span className="font-bold">SPO No :</span>
                                  <div className="border border-black-strong w-32 px-1 h-5">{formData.spoNo}</div>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          {isEditable && <AiAssistant onDataGenerated={handleAiData} />}
        </>
      )}
    </div>
  );
};

export default App;
