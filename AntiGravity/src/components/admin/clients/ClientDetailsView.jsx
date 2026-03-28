import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Box, MapPin, Clock, Tag } from 'lucide-react';
import { BookingHistoryTable } from '../shared/BookingHistoryTable';

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
    const [clientHistory, setClientHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch real booking history for this client on mount
    useEffect(() => {
        setHistoryLoading(true);
        fetch(`http://localhost:3001/api/admin/sessions/client/${client.id}`)
            .then(r => r.json())
            .then(data => {
                if (data?.status?.success) {
                    setClientHistory(data.data || []);
                }
            })
            .catch(err => console.warn('Could not load client history', err))
            .finally(() => setHistoryLoading(false));
    }, [client.id]);

    // Related data
    const clientPods = (pods || []).filter(p => p?.clientId === client.id);
    const clientLocations = (locations || []).filter(l => l?.clientId === client.id);
    const clientSessions = clientHistory; // Use locally fetched data

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
                                <Clock className="w-4 h-4" /> Session History ({clientHistory.length})
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
                                <div className="animate-fade-in">
                                    <BookingHistoryTable
                                        sessions={clientHistory}
                                        loading={historyLoading}
                                        exportPrefix={client.name.replace(/\s+/g, '_').toLowerCase()}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
