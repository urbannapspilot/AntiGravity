import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShieldAlert, XCircle, Calendar, Settings, CheckCircle } from 'lucide-react';
import { BookingHistoryTable } from '../shared/BookingHistoryTable';

export const PodEditor = ({
    pod,
    isSuperAdmin,
    currentClient,
    activeSessions,
    upcomingBookings,
    pastSessions,
    setEditingPod,
    podDetailsTab,
    setPodDetailsTab,
    terminateSession,
    updateNapOption,
    removeNapOption,
    addNapOption,
    updatePodOverride
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [podHistory, setPodHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch real booking history for this specific pod on mount
    useEffect(() => {
        if (!pod?.id) return;
        setHistoryLoading(true);
        // Fetch by clientId and filter by podId
        const clientId = pod.clientId;
        const url = clientId
            ? `http://localhost:3001/api/admin/sessions/client/${clientId}`
            : `http://localhost:3001/api/admin/sessions/pod/${pod.id}`;
        fetch(url)
            .then(r => r.json())
            .then(data => {
                if (data?.status?.success) {
                    // Filter to only this pod's sessions
                    const podSessions = (data.data || []).filter(s => s.podId === pod.id);
                    setPodHistory(podSessions);
                }
            })
            .catch(err => console.warn('Could not load pod history', err))
            .finally(() => setHistoryLoading(false));
    }, [pod.id, pod.clientId]);

    // Resolve permissions based on persona
    const canEditPricing = isSuperAdmin || currentClient?.permissions.canDefineNapPricing;
    const canOverrideLogin = isSuperAdmin || currentClient?.permissions.canOverrideLoginRules;

    const activeSession = (activeSessions || []).find(s => s.podId === pod.id);
    const podFutureBookings = (upcomingBookings || []).filter(b => b.podId === pod.id);
    const podPastSessions = podHistory; // Use locally fetched real data

    // Filter sessions based on date range
    const filteredSessions = podPastSessions.filter(session => {
        if (!startDate && !endDate) return true;

        const sessionDate = new Date(session.startTime || session.terminatedAt);
        sessionDate.setHours(0, 0, 0, 0);

        const start = startDate ? new Date(startDate) : new Date(0);
        start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);

        return sessionDate >= start && sessionDate <= end;
    });

    const totalSessions = filteredSessions.length;
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    return (
        <div className="p-8 lg:p-12 animate-fade-in max-w-5xl">
            <button
                onClick={() => { setEditingPod(null); setPodDetailsTab('overview'); }}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Inventory
            </button>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{pod.name}</h2>
                            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                <span className="font-mono bg-slate-200/50 px-2 py-0.5 rounded text-xs">{pod.id}</span>
                                <span className="uppercase tracking-widest text-[10px]">{pod.type}</span>
                            </p>
                        </div>
                        {activeSession ? (
                            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-2 shadow-sm animate-pulse-slow">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-bold text-emerald-700">In Use</span>
                            </div>
                        ) : (
                            <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full flex items-center gap-2 text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                <span className="text-sm font-medium">Available</span>
                            </div>
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-2 border-b border-slate-200 pt-2">
                        {['overview', 'future', 'history', 'config'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setPodDetailsTab(tab)}
                                className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors -mb-[1px] ${podDetailsTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab === 'future' ? 'Reservations' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white min-h-[400px]">
                    {/* Tab Content: Overview */}
                    {podDetailsTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in-up">
                            {activeSession ? (
                                <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden group border border-slate-800">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
                                    <h3 className="text-white text-xl font-bold mb-2">Active Session</h3>
                                    <p className="text-slate-400 text-sm mb-6">User: {activeSession.email || 'Anonymous Guest'}</p>

                                    <div className="text-5xl font-mono text-emerald-400 font-bold tracking-tighter mb-8 drop-shadow-md tabular-nums">
                                        {Math.floor(activeSession.timeLeft / 60)}:{(activeSession.timeLeft % 60).toString().padStart(2, '0')}
                                    </div>

                                    <button
                                        onClick={() => terminateSession(activeSession.id)}
                                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-sm font-bold tracking-wide transition-all active:scale-95 mx-auto flex items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Force End Session
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                    <CheckCircle className="w-12 h-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-slate-700">Pod is Vacant</h3>
                                    <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">There is no active session currently running on this hardware unit.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content: Future Reservations */}
                    {podDetailsTab === 'future' && (
                        <div className="animate-fade-in-up">
                            {podFutureBookings.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                                    <p>No upcoming reservations for this pod.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {podFutureBookings.map(booking => {
                                        const d = new Date(booking.scheduledTime);
                                        return (
                                            <div key={booking.id} className="flex justify-between items-center p-5 bg-white border border-slate-200 hover:border-indigo-200 transition-colors rounded-2xl shadow-sm group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                        <span className="text-xs font-bold uppercase tracking-widest leading-none mt-1">{d.toLocaleDateString([], { month: 'short' })}</span>
                                                        <span className="text-lg font-black leading-none">{d.getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-lg">{d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                                        <p className="text-sm font-medium text-slate-500">{booking.email || 'Anonymous'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{booking.durationMinutes} Min</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab Content: Session History */}
                    {podDetailsTab === 'history' && (
                        <div className="animate-fade-in-up">
                            <BookingHistoryTable
                                sessions={podHistory}
                                loading={historyLoading}
                                exportPrefix={pod.name.replace(/\s+/g, '_').toLowerCase()}
                            />
                        </div>
                    )}

                    {/* Tab Content: Config */}
                    {podDetailsTab === 'config' && (
                        <div className="space-y-12 animate-fade-in-up">
                            {/* Nap Options Editor */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-slate-800 flex items-center gap-2 mb-1">
                                            <Clock className="w-5 h-5 text-indigo-500" /> Nap Configurations
                                        </h3>
                                        <p className="text-sm text-slate-500">Define the duration and pricing tiers for this pod.</p>
                                    </div>
                                    {!canEditPricing && (
                                        <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3" /> Locked by HQ
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {pod.napOptions.map((opt, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-colors hover:border-slate-200">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Duration (Mins)</label>
                                                <input
                                                    type="number"
                                                    disabled={!canEditPricing}
                                                    value={opt.durationMinutes}
                                                    onChange={(e) => updateNapOption(pod.id, index, 'durationMinutes', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50 disabled:bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Price ($)</label>
                                                <input
                                                    type="number"
                                                    disabled={!canEditPricing}
                                                    value={opt.price}
                                                    onChange={(e) => updateNapOption(pod.id, index, 'price', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm disabled:opacity-50 disabled:bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                />
                                            </div>
                                            {canEditPricing && (
                                                <div className="pt-6">
                                                    <button onClick={() => removeNapOption(pod.id, index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {canEditPricing && (
                                        <button
                                            onClick={() => addNapOption(pod.id)}
                                            className="w-full py-4 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl text-sm font-semibold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-sm"
                                        >
                                            + Add Nap Option
                                        </button>
                                    )}
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Granular Overrides */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-slate-800 flex items-center gap-2 mb-1">
                                            <Settings className="w-5 h-5 text-emerald-500" /> Unit Overrides
                                        </h3>
                                        <p className="text-sm text-slate-500">Override client defaults for this specific unit.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Login Override */}
                                    <div className="bg-white border border-slate-100 hover:border-slate-200 transition-colors p-6 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <label className="font-semibold text-slate-900">Email Login</label>
                                            {!canOverrideLogin && <ShieldAlert className="w-4 h-4 text-amber-500" title="Locked by HQ" />}
                                        </div>
                                        <select
                                            disabled={!canOverrideLogin}
                                            value={pod.overrides.requiresEmailLogin === null ? "default" : pod.overrides.requiresEmailLogin.toString()}
                                            onChange={(e) => {
                                                const val = e.target.value === "default" ? null : e.target.value === "true";
                                                updatePodOverride(pod.id, 'requiresEmailLogin', val);
                                            }}
                                            className="w-full mt-2 border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="default">Use Client Default ({currentClient?.defaultRequiresEmailLogin ? 'Yes' : 'No'})</option>
                                            <option value="true">Force Login (Yes)</option>
                                            <option value="false">Skip Login (No)</option>
                                        </select>
                                    </div>

                                    {/* Pricing Override */}
                                    <div className="bg-white border border-slate-200 p-5 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <label className="font-medium text-slate-900">Paid Pod Unit</label>
                                            {!canEditPricing && <ShieldAlert className="w-4 h-4 text-amber-500" title="Locked by HQ" />}
                                        </div>
                                        <select
                                            disabled={!canEditPricing}
                                            value={pod.overrides.isPaid === null ? "default" : pod.overrides.isPaid.toString()}
                                            onChange={(e) => {
                                                const val = e.target.value === "default" ? null : e.target.value === "true";
                                                updatePodOverride(pod.id, 'isPaid', val);
                                            }}
                                            className="w-full mt-2 border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="default">Use Client Default ({currentClient?.defaultIsPaid ? 'Yes' : 'No'})</option>
                                            <option value="true">Force Paid (Yes)</option>
                                            <option value="false">Force Free (No)</option>
                                        </select>
                                    </div>

                                    {/* Advance Booking Override */}
                                    <div className="bg-white border border-slate-200 p-5 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <label className="font-medium text-slate-900">Reservations</label>
                                        </div>
                                        <select
                                            value={pod.overrides.allowAdvanceBooking !== false ? "true" : "false"}
                                            onChange={(e) => {
                                                updatePodOverride(pod.id, 'allowAdvanceBooking', e.target.value === "true");
                                            }}
                                            className="w-full mt-2 border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="true">Allow Advance Booking</option>
                                            <option value="false">Instant Access Only</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
