import React from 'react';
import { Clock, CheckCircle2, Box, ChevronRight } from 'lucide-react';

export const UserProfileOverlay = ({
    upcomingBookings,
    pastSessions,
    email,
    initialPods,
    initialLocations
}) => {
    const myUpcoming = upcomingBookings.filter(b => b.email === email);
    const myPast = pastSessions.filter(s => s.email === email);

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in overflow-y-auto pb-12">
            <div className="px-6 pt-10 pb-8 bg-indigo-600">
                <h1 className="text-2xl font-bold text-white mb-1">Your Profile</h1>
                <p className="text-indigo-200 text-sm font-medium">{email || 'Not logged in'}</p>
            </div>

            <div className="p-6 space-y-8">
                {/* Active/Scheduled Reservations */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Upcoming Naps
                    </h2>
                    {myUpcoming.length === 0 ? (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
                            <p className="text-slate-500 text-sm">No scheduled reservations.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myUpcoming.map(booking => {
                                const pod = initialPods.find(p => p.id === booking.podId);
                                const loc = initialLocations.find(l => l.id === pod?.locationId);
                                const dateObj = new Date(booking.scheduledTime);
                                return (
                                    <div key={booking.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-bold text-slate-900 text-lg">{dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                                <p className="text-sm font-medium text-slate-500">{dateObj.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-800">{pod?.name}</p>
                                                <p className="text-xs text-slate-500">{loc?.name}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => console.log('Cancel ' + booking.id)}
                                            className="w-full mt-2 py-2.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            Cancel Reservation
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* Past Receipts */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Session History & Receipts
                    </h2>
                    {myPast.length === 0 ? (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm">
                            <p className="text-slate-500 text-sm">No past sessions found.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                            {myPast.map(session => {
                                const pod = initialPods.find(p => p.id === session.podId);
                                const start = new Date(session.startTime);
                                const end = session.terminatedAt ? new Date(session.terminatedAt) : new Date();
                                return (
                                    <div key={session.id} className="p-5 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-slate-900">{start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-sm shadow-sm border border-emerald-100">Paid</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-3">{start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>

                                        <div className="flex justify-between items-center text-sm font-medium bg-slate-100 p-3 rounded-xl border border-slate-200/60">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Box className="w-4 h-4 text-slate-400" />
                                                {pod?.name || 'Standard Pod'} ({session.durationMinutes}m)
                                            </div>
                                            <div className="flex items-center text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors">
                                                Receipt <ChevronRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
