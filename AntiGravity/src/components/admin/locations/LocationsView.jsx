import React from 'react';
import { Plus } from 'lucide-react';

export const LocationsView = ({
    isSuperAdmin,
    currentClient,
    clients,
    visibleLocations,
    showAddForm,
    setShowAddForm,
    handleAddLocation,
    newLocationFlow,
    setNewLocationFlow,
    activePersona,
    renderEmptyState
}) => (
    <div className="p-8 lg:p-12 animate-fade-in max-w-6xl">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Locations</h2>
                <p className="text-sm text-slate-500">Physical venues where Pods are stationed.</p>
            </div>
            {(isSuperAdmin || currentClient) && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-indigo-500/20 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Add Location
                </button>
            )}
        </div>

        {showAddForm && (
            <div className="mb-8 p-8 bg-white border border-slate-100 rounded-3xl shadow-card animate-fade-in-up">
                <h3 className="font-semibold text-lg text-slate-800 mb-6">Register New Location</h3>
                <form onSubmit={handleAddLocation} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Venue Name</label>
                        <input
                            required type="text" placeholder="e.g. Lobby 1"
                            value={newLocationFlow.name} onChange={e => setNewLocationFlow({ ...newLocationFlow, name: e.target.value })}
                            className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>
                    {isSuperAdmin && (
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Assign To Client</label>
                            <select
                                required value={newLocationFlow.clientId} onChange={e => setNewLocationFlow({ ...newLocationFlow, clientId: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="" disabled>Select a client...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}
                    <button type="submit"
                        onClick={(e) => {
                            if (!isSuperAdmin) setNewLocationFlow(prev => ({ ...prev, clientId: activePersona }));
                        }}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shrink-0 transition-colors shadow-md"
                    >Save Location</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-3 text-slate-500 hover:text-slate-800 font-medium shrink-0 transition-colors">Cancel</button>
                </form>
            </div>
        )}

        {visibleLocations.length === 0 ? renderEmptyState("No locations registered.", "Create Location", () => setShowAddForm(true)) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="py-3 px-6 font-medium">Location Name</th>
                            <th className="py-3 px-6 font-medium">Internal ID</th>
                            {isSuperAdmin && <th className="py-3 px-6 font-medium">Client Owner</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {visibleLocations.map(loc => {
                            const client = clients.find(c => c.id === loc.clientId);
                            return (
                                <tr key={loc.id} className="hover:bg-slate-50/50">
                                    <td className="py-4 px-6 font-medium text-slate-900 border-l-2 border-transparent hover:border-indigo-500">
                                        {loc.name}
                                    </td>
                                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">{loc.id}</td>
                                    {isSuperAdmin && (
                                        <td className="py-4 px-6 text-slate-600">
                                            {client?.name || "Orphaned"}
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
