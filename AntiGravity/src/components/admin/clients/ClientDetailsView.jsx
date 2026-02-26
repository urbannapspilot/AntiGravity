import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Box, MapPin, Clock, Tag, Download } from 'lucide-react';
import { downloadCsv } from '../../../utils/csvExport';

export const ClientDetailsView = ({
    client,
    onBack,
    onUpdateWhitelist,
    pods,
    locations,
    pastSessions
}) => {
    const [newDomain, setNewDomain] = useState('');
    const [activeTab, setActiveTab] = useState('assets'); // 'assets' | 'history'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Related data
    const clientPods = pods.filter(p => p.clientId === client.id);
    const clientLocations = locations.filter(l => l.clientId === client.id);
    const clientSessions = pastSessions.filter(s => s.clientId === client.id);

    const handleAddDomain = (e) => {
        e.preventDefault();
        const cleanDomain = newDomain.trim().toLowerCase();
        if (cleanDomain && !client.whitelistedDomains.includes(cleanDomain)) {
            const updatedDomains = [...client.whitelistedDomains, cleanDomain];
            onUpdateWhitelist(client.id, updatedDomains);
            setNewDomain('');
        }
    };

    const handleRemoveDomain = (domainToRemove) => {
        const updatedDomains = client.whitelistedDomains.filter(d => d !== domainToRemove);
        onUpdateWhitelist(client.id, updatedDomains);
    };

    // Filter sessions based on date range
    const filteredSessions = clientSessions.filter(session => {
        if (!startDate && !endDate) return true;

        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);

        const start = startDate ? new Date(startDate) : new Date(0);
        start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);

        return sessionDate >= start && sessionDate <= end;
    });

    const totalSessions = filteredSessions.length;
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    const handleExportCsv = () => {
        const columns = [
            { header: 'Session ID', key: 'id' },
            { header: 'Date', key: row => new Date(row.startTime).toLocaleDateString() },
            { header: 'Time', key: row => new Date(row.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            { header: 'User Email', key: 'email' },
            { header: 'Pod ID', key: 'podId' },
            { header: 'Pod Name', key: row => pods.find(p => p.id === row.podId)?.name || row.podId },
            { header: 'Location ID', key: row => pods.find(p => p.id === row.podId)?.locationId || 'Unknown' },
            { header: 'Duration (Min)', key: 'durationMinutes' },
            { header: 'Price ($)', key: 'price' },
            { header: 'Status', key: 'status' }
        ];

        const filename = `${client.name.replace(/\s+/g, '_').toLowerCase()}_sessions_${new Date().toISOString().split('T')[0]}`;
        downloadCsv(filteredSessions, columns, filename);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in overflow-y-auto w-full">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 shadow-sm">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Clients
                </button>
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{client.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                {client.brandingType === 'custom' ? 'Custom Theme Active' : 'Default Branding'}
                            </span>
                            <span className="text-sm font-mono text-slate-500">ID: {client.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Settings & Whitelist */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-indigo-500" /> Domain Whitelist
                        </h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                            Restrict access to this client's hardware. If empty, any user can access the pods. If populated, users must have a matching email domain.
                        </p>

                        <form onSubmit={handleAddDomain} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder="e.g. acmewave.com"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                className="flex-1 bg-slate-50 px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!newDomain.trim()}
                                className="bg-slate-900 text-white px-3 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-2">
                            {client.whitelistedDomains.length === 0 ? (
                                <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs font-medium text-slate-500">No domains restricted.</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Public Access</p>
                                </div>
                            ) : (
                                client.whitelistedDomains.map(domain => (
                                    <div key={domain} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl group/domain">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            <span className="text-sm font-medium text-emerald-800">@{domain}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDomain(domain)}
                                            className="text-emerald-600/50 hover:text-red-500 p-1 rounded-md opacity-0 group-hover/domain:opacity-100 transition-all focus:opacity-100"
                                            title="Remove Domain"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Assets and History Tabs */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        {/* Custom Tab Bar */}
                        <div className="flex border-b border-slate-100 px-6 pt-6">
                            <button
                                onClick={() => setActiveTab('assets')}
                                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'assets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                <Box className="w-4 h-4" /> Assets overview
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                <Clock className="w-4 h-4" /> Session History ({clientSessions.length})
                            </button>
                        </div>

                        {/* Tab Content Area */}
                        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/50">
                            {activeTab === 'assets' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Locations Table */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> Corporate Locations</h4>
                                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                                    <tr>
                                                        <th className="py-2.5 px-4 font-medium">Location Name</th>
                                                        <th className="py-2.5 px-4 font-medium" width="100">ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {clientLocations.map(loc => (
                                                        <tr key={loc.id} className="hover:bg-slate-50/50">
                                                            <td className="py-3 px-4 font-medium text-slate-800">{loc.name}</td>
                                                            <td className="py-3 px-4 text-slate-500 font-mono text-xs">{loc.id}</td>
                                                        </tr>
                                                    ))}
                                                    {clientLocations.length === 0 && (
                                                        <tr><td colSpan="2" className="py-6 text-center text-slate-500 font-medium">No locations assigned yet.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pods Table */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Box className="w-4 h-4 text-indigo-500" /> Hardware Units</h4>
                                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                                    <tr>
                                                        <th className="py-2.5 px-4 font-medium">Pod Name</th>
                                                        <th className="py-2.5 px-4 font-medium">Type</th>
                                                        <th className="py-2.5 px-4 font-medium">Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {clientPods.map(pod => {
                                                        const locName = locations.find(l => l.id === pod.locationId)?.name || 'Unknown';
                                                        return (
                                                            <tr key={pod.id} className="hover:bg-slate-50/50">
                                                                <td className="py-3 px-4 font-medium text-slate-800 flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${pod.overrides.allowAdvanceBooking === false ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                                                                    {pod.name}
                                                                </td>
                                                                <td className="py-3 px-4 text-slate-500 text-xs font-bold uppercase tracking-wider">{pod.type}</td>
                                                                <td className="py-3 px-4 text-slate-500">{locName}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                    {clientPods.length === 0 && (
                                                        <tr><td colSpan="3" className="py-6 text-center text-slate-500 font-medium">No pods assigned yet.</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-fade-in">
                                    {/* Analytics & Filters Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Sessions</p>
                                                <p className="text-2xl font-black text-slate-800 leading-none">{totalSessions}</p>
                                            </div>
                                            <div className="w-px bg-slate-200"></div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Duration</p>
                                                <p className="text-2xl font-black text-indigo-600 leading-none">{totalMinutes} <span className="text-sm font-semibold text-indigo-400">min</span></p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                                <span className="text-xs font-medium text-slate-500">From:</span>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={e => setStartDate(e.target.value)}
                                                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                                <span className="text-xs font-medium text-slate-500">To:</span>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={e => setEndDate(e.target.value)}
                                                    className="bg-transparent text-sm font-medium text-slate-700 outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={handleExportCsv}
                                                disabled={filteredSessions.length === 0}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto md:ml-0"
                                            >
                                                <Download className="w-4 h-4" /> Export CSV
                                            </button>
                                        </div>
                                    </div>

                                    {filteredSessions.length === 0 ? (
                                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No session history found for the selected dates.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                                    <tr>
                                                        <th className="py-3 px-4 font-medium">Date</th>
                                                        <th className="py-3 px-4 font-medium">User Email</th>
                                                        <th className="py-3 px-4 font-medium">Pod</th>
                                                        <th className="py-3 px-4 font-medium">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {filteredSessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).map(session => {
                                                        const pod = pods.find(p => p.id === session.podId);
                                                        const dateObj = new Date(session.startTime);
                                                        return (
                                                            <tr key={session.id} className="hover:bg-slate-50/50">
                                                                <td className="py-3 px-4">
                                                                    <div className="font-medium text-slate-800">{dateObj.toLocaleDateString()}</div>
                                                                    <div className="text-xs text-slate-500">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                                </td>
                                                                <td className="py-3 px-4 font-medium text-slate-600">{session.email}</td>
                                                                <td className="py-3 px-4">
                                                                    <span className="font-semibold text-slate-700">{pod?.name || session.podId}</span>
                                                                </td>
                                                                <td className="py-3 px-4 flex items-center gap-2">
                                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-bold text-xs">{session.durationMinutes}m</span>
                                                                    {session.status === 'force-ended' && (
                                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded">Admin Terminated</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
