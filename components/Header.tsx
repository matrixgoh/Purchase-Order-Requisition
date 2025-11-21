import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex justify-between items-start mb-6 pb-4">
      <div className="text-xs md:text-sm print:text-xs font-medium text-gray-900 space-y-1">
        <h1 className="text-base font-bold mb-1 text-brand-primary">Quantum Global Solutions</h1>
        <p>Reg No. 202401009988 (13579-Q)</p>
        <p>Level 25, Menara Future,</p>
        <p>Persiaran Digital, Cyberjaya,</p>
        <p>63000 Selangor, Malaysia.</p>
        <p>General Line: +603-8800 1234</p>
        <div className="pt-1">
          <p>Fax: +603-8800 1235 (Admin)</p>
          <p>Email: procurement@quantumglobal.com</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        {/* Company Logo */}
        <div className="flex items-center gap-3 mb-4">
             <svg viewBox="0 0 100 100" className="h-10 w-auto text-brand-accent fill-current">
                <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 25 L75 37.5 L75 62.5 L50 75 L25 62.5 L25 37.5 Z" fill="currentColor" opacity="0.8" />
                <circle cx="50" cy="50" r="8" fill="white" />
            </svg>
            <div className="flex flex-col">
                <span className="text-brand-primary font-bold text-2xl tracking-tight leading-none">QUANTUM</span>
                <span className="text-brand-accent font-semibold text-[0.6rem] tracking-[0.2em] uppercase">Global Solutions</span>
            </div>
        </div>
        
        <div className="text-right">
             <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide uppercase">
            Purchase Order Requisition
            </h2>
            <div className="flex justify-end gap-4 text-xs font-bold mt-1">
                <span className="text-gray-800">DOC-PUR-REQ-01</span>
                <span className="text-brand-accent">Rev 3.0</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;