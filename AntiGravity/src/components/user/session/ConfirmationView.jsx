import React from 'react';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';

export const ConfirmationView = ({
    scheduledDate,
    scheduledTime,
    theme,
    activePod,
    activeLocation,
    endSessionUIOnly
}) => {
    const dateObj = scheduledDate ? new Date(`${scheduledDate}T${scheduledTime || '00:00'}`) : new Date();
    const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = scheduledTime ? dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

    return (
        <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in text-center relative bg-slate-50">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative bg-white shadow-xl shadow-emerald-500/10 border-4 border-emerald-50">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Booking Confirmed</h2>
            <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-[260px]">
                Your reservation at <span className="font-semibold text-slate-700">{theme.name}</span> is secured!
            </p>

            <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-12 text-left space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Date & Time</p>
                        <p className="font-semibold text-slate-900">{formattedDate}</p>
                        <p className="text-sm font-medium text-emerald-600">{formattedTime}</p>
                    </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                        <p className="font-semibold text-slate-900">{activePod?.name}</p>
                        <p className="text-sm text-slate-500">{activeLocation?.name || 'Local Facility'}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 pb-8 w-full absolute bottom-0 left-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                <button
                    onClick={endSessionUIOnly}
                    className="w-full py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
};
