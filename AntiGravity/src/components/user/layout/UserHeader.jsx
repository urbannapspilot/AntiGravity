import React from 'react';
import { Wifi, Battery, UserCircle } from 'lucide-react';

export const UserHeader = ({ currentStep, showProfile, setShowProfile }) => {
    return (
        <>
            {/* Status Bar simulation (Top) */}
            <div className="absolute top-0 w-full h-12 z-50 flex justify-between items-center px-6 pointer-events-none">
                <span className="text-xs font-medium" style={{ color: currentStep === 1 ? 'transparent' : 'inherit' }}>9:41</span>
                <div className="flex items-center gap-1.5" style={{ color: currentStep === 1 ? 'transparent' : 'inherit' }}>
                    <Wifi className="w-4 h-4" />
                    <Battery className="w-4 h-4" />
                </div>
            </div>

            {/* Header Overlay Layer (always on top of views except Step 1 and 6) */}
            {currentStep > 1 && currentStep < 6 && (
                <div className="absolute top-12 right-6 z-50">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className={`p-2.5 rounded-full shadow-lg backdrop-blur-md border transition-all ${showProfile ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/80 border-slate-200/50 text-slate-800 hover:bg-white'}`}
                    >
                        <UserCircle className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
};
