import React, { useState, useMemo } from 'react';
import { Clock, Download, Calendar } from 'lucide-react';
import { downloadCsv } from '../../../utils/csvExport';

const PRESETS = [
    { label: 'All Time', key: 'all' },
    { label: 'Today', key: 'today' },
    { label: 'Yesterday', key: 'yesterday' },
    { label: 'Last 7 Days', key: 'last7' },
    { label: 'Last 30 Days', key: 'last30' },
    { label: 'Custom', key: 'custom' },
];

function getPresetRange(key) {
    const now = new Date();
    const startOf = (d) => { d.setHours(0, 0, 0, 0); return d; };
    const endOf = (d) => { d.setHours(23, 59, 59, 999); return d; };

    switch (key) {
        case 'today':
            return { from: startOf(new Date()), to: endOf(new Date()) };
        case 'yesterday': {
            const y = new Date(); y.setDate(y.getDate() - 1);
            return { from: startOf(new Date(y)), to: endOf(new Date(y)) };
        }
        case 'last7': {
            const d = new Date(); d.setDate(d.getDate() - 6);
            return { from: startOf(d), to: endOf(new Date()) };
        }
        case 'last30': {
            const d = new Date(); d.setDate(d.getDate() - 29);
            return { from: startOf(d), to: endOf(new Date()) };
        }
        default:
            return null;
    }
}

function fmtTime(dt) {
    if (!dt) return '—';
    const d = new Date(dt);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(dt) {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString();
}

export const BookingHistoryTable = ({ sessions = [], loading = false, exportPrefix = 'history' }) => {
    const [activePreset, setActivePreset] = useState('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const filtered = useMemo(() => {
        let from, to;
        if (activePreset === 'custom') {
            from = customFrom ? new Date(customFrom) : null;
            to = customTo ? new Date(customTo) : null;
            if (to) to.setHours(23, 59, 59, 999);
        } else {
            const range = getPresetRange(activePreset);
            if (range) { from = range.from; to = range.to; }
        }

        if (!from && !to) return sessions; // 'all' or no range set
        if (activePreset === 'all') return sessions;

        return sessions.filter(s => {
            const d = new Date(s.startTime || s.terminatedAt);
            if (from && d < from) return false;
            if (to && d > to) return false;
            return true;
        });
    }, [sessions, activePreset, customFrom, customTo]);

    const totalMinutes = filtered.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    const handleExport = () => {
        const columns = [
            { header: 'Plan Name', key: 'planName' },
            { header: 'User Email', key: 'email' },
            { header: 'Date', key: row => fmtDate(row.startTime) },
            { header: 'Start Time', key: row => fmtTime(row.startTime) },
            { header: 'End Time', key: row => fmtTime(row.endTime) },
            { header: 'Nap Time (min)', key: 'durationMinutes' },
            { header: 'Pod', key: 'podName' },
            { header: 'Status', key: 'status' },
        ];
        downloadCsv(filtered, columns, `${exportPrefix}_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div className="space-y-4">
            {/* Stats Bar */}
            <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex gap-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Sessions</p>
                        <p className="text-2xl font-black text-slate-800 leading-none">{filtered.length}</p>
                    </div>
                    <div className="w-px bg-slate-200" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Total Nap Time</p>
                        <p className="text-2xl font-black text-indigo-600 leading-none">
                            {totalMinutes} <span className="text-sm font-semibold text-indigo-400">min</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    disabled={filtered.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Filter Presets */}
            <div className="flex flex-wrap items-center gap-2">
                {PRESETS.map(p => (
                    <button
                        key={p.key}
                        onClick={() => setActivePreset(p.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                            activePreset === p.key
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                    >
                        {p.label}
                    </button>
                ))}

                {/* Custom date pickers - only shown when Custom is selected */}
                {activePreset === 'custom' && (
                    <div className="flex items-center gap-2 ml-2 animate-fade-in">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="date"
                                value={customFrom}
                                onChange={e => setCustomFrom(e.target.value)}
                                className="outline-none text-slate-700 font-medium bg-transparent"
                            />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">→</span>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="date"
                                value={customTo}
                                onChange={e => setCustomTo(e.target.value)}
                                className="outline-none text-slate-700 font-medium bg-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-500 text-sm font-medium">Loading booking history...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No bookings found for this period.</p>
                    <p className="text-slate-400 text-sm mt-1">Try selecting a wider date range.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Plan Name</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">User Email</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Start Time</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">End Time</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nap Time</th>
                                    <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(s => {
                                    const isForceEnded = s.status === 'force-ended';
                                    return (
                                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-slate-800">{s.planName || '—'}</span>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-slate-600 max-w-[200px] truncate">
                                                {s.email
                                                    ? s.email
                                                    : <span className="italic text-slate-400 text-xs">Walk-in / Offline</span>
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-slate-700 font-medium">
                                                {fmtDate(s.startTime)}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-700 text-xs">
                                                {fmtTime(s.startTime)}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-700 text-xs">
                                                {fmtTime(s.endTime)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs">
                                                    {s.durationMinutes}m
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    isForceEnded
                                                        ? 'bg-red-50 text-red-600 border-red-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {isForceEnded ? 'Force Ended' : 'Completed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
