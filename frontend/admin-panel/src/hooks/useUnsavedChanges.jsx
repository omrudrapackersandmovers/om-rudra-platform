import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, X } from "lucide-react";

export function useUnsavedChanges(navigate) {
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const confirmNavigation = useCallback(
    (targetUrl) => {
      if (isDirty) {
        setPendingNavigation(targetUrl);
        setIsModalOpen(true);
      } else {
        if (targetUrl) navigate(targetUrl);
        else navigate(-1);
      }
    },
    [isDirty, navigate]
  );

  const handleLeave = () => {
    setIsDirty(false);
    setIsModalOpen(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    } else {
      navigate(-1);
    }
  };

  const handleStay = () => {
    setIsModalOpen(false);
    setPendingNavigation(null);
  };

  const UnsavedModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
          <div className="flex items-center gap-3 text-amber-600 mb-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Unsaved Changes</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            You have unsaved changes in this form. If you leave now, any modifications will be lost.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleStay}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Stay on Page
            </button>
            <button
              type="button"
              onClick={handleLeave}
              className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Discard & Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  return {
    isDirty,
    setIsDirty,
    confirmNavigation,
    UnsavedModal,
  };
}
