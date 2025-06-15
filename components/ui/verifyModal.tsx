"use client"
import React, { useEffect } from 'react';

interface VerifyModalProps {
  functionality: string;
  onClose: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({ functionality, onClose }) => {
  // Disable scrolling when modal opens
  useEffect(() => {
    // Save original overflow setting
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <>
      {/* Backdrop - darkened with bg-black and lower opacity */}
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        {/* Modal - not affected by the opacity of the backdrop */}
        <div className="bg-[#F9F2EA] p-8 rounded-lg shadow-lg max-w-md w-full mx-4 border border-[#D4C4B0] z-50">
          {/* Header */}
          <div className="flex items-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-[#B78370] mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <h2 className="text-lg font-semibold text-[#8A5A3B]">Account Verification Required</h2>
          </div>
          
          {/* Content */}
          <div className="text-[#8A5A3B] mb-6">
            <p className="mb-3">Your account hasn't been verified yet!</p>
            <p className="mb-3">You cannot <span className=" text-[#B78370] font-bold">{functionality}</span> until your account is verified.</p>
            <p className="mb-3">Please check your email to verify your account.</p>
            <p className="text-sm text-[#B78370]">You might need to log out and log back in after verifying your email.</p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="bg-[#8A5A3B] text-white px-6 py-2 rounded-md hover:bg-[#6B4530] transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyModal;