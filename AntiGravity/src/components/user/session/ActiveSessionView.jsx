import React from 'react';
import { Lock, Unlock, CheckCircle } from 'lucide-react';

export const ActiveSessionView = ({
    isPodOpen,
    setIsPodOpen,
    theme,
    activePod,
    timeLeft,
    formatTime,
    endSession
}) => {
    if (!isPodOpen) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in text-center relative bg-slate-50">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-white shadow-xl shadow-black/5">
                    <Lock className="w-10 h-10" style={{ color: theme.color }} />
                </div>

                <h2 className="text-3xl font-semibold text-slate-800 mb-2 tracking-tight">Ready to Start</h2>
                <p className="text-slate-500 mb-12 text-sm max-w-[240px] leading-relaxed">Tap the button below to unlock your {activePod?.type} and begin your session.</p>

                <div className="p-6 pb-8 absolute bottom-0 w-full left-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                    <button
                        onClick={() => setIsPodOpen(true)}
                        style={{ backgroundColor: theme.color }}
                        className="w-full py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                    >
                        Open Pod
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in text-center relative bg-slate-50">

            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative bg-white shadow-xl shadow-black/5">
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: theme.color }}></div>
                <CheckCircle className="w-12 h-12" style={{ color: theme.color }} />
            </div>

            <h2 className="text-3xl font-semibold text-slate-800 mb-2 tracking-tight">Pod Unlocked</h2>
            <p className="text-slate-500 mb-12 text-sm leading-relaxed">Your session at <span className="font-medium text-slate-700">{theme.name}</span> has started.</p>

            <div className="text-7xl font-bold tabular-nums tracking-tighter text-slate-800 mb-3 drop-shadow-sm font-mono">
                {formatTime(timeLeft)}
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Remaining</p>

            <div className="flex gap-4 w-full max-w-[280px] mb-8">
                <button
                    onClick={() => alert("Pod Door Opened!")}
                    className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all flex flex-col items-center gap-1.5 shadow-sm"
                >
                    <Unlock className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Open Door</span>
                </button>
                <button
                    onClick={() => alert("Pod Door Closed!")}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-800 border-2 border-slate-800 text-white font-bold hover:bg-slate-900 active:scale-[0.98] transition-all flex flex-col items-center gap-1.5 shadow-sm"
                >
                    <Lock className="w-5 h-5 text-slate-300" />
                    <span className="text-sm">Close Door</span>
                </button>
            </div>

            <div className="p-6 pb-8 absolute bottom-0 w-full left-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                <button
                    onClick={endSession}
                    className="w-full py-4 rounded-full bg-white border border-red-100 text-red-600 font-semibold text-lg hover:bg-red-50 active:scale-[0.98] transition-all shadow-sm"
                >
                    End Session
                </button>
            </div>
        </div>
    );
};
