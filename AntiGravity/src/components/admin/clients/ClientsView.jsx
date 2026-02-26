import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { ClientDetailsView } from './ClientDetailsView';

export const ClientsView = ({
    clients,
    showAddForm,
    setShowAddForm,
    handleAddClient,
    newClientFlow,
    setNewClientFlow,
    toggleClientPermission,
    updateClientWhitelist,
    renderEmptyState,
    selectedClient,
    setSelectedClient,
    pods,
    locations,
    pastSessions
}) => {
    if (selectedClient) {
        return (
            <ClientDetailsView
                client={selectedClient}
                onBack={() => setSelectedClient(null)}
                onUpdateWhitelist={updateClientWhitelist}
                pods={pods}
                locations={locations}
                pastSessions={pastSessions}
            />
        );
    }

    return (
        <div className="p-8 lg:p-12 animate-fade-in max-w-6xl">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Client Management</h2>
                    <p className="text-sm text-slate-500">Add new clients and manage their override permissions.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-indigo-500/20 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Add Client
                </button>
            </div>

            {/* Add Client Form Overlay */}
            {showAddForm && (
                <div className="mb-8 p-8 bg-white border border-slate-100 rounded-3xl shadow-card animate-fade-in-up">
                    <h3 className="font-semibold text-lg text-slate-800 mb-6">Create New Client</h3>
                    <form onSubmit={handleAddClient} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
                            <input
                                required type="text" placeholder="e.g. Acme Corp"
                                value={newClientFlow.name} onChange={e => setNewClientFlow({ ...newClientFlow, name: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Branding Package</label>
                            <select
                                value={newClientFlow.type} onChange={e => setNewClientFlow({ ...newClientFlow, type: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="custom">Custom Hex Theme</option>
                                <option value="urban-naps">Default Urban Naps</option>
                            </select>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shrink-0 transition-colors shadow-md">Save Client</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-3 text-slate-500 hover:text-slate-800 font-medium shrink-0 transition-colors">Cancel</button>
                    </form>
                </div>
            )}

            {clients.length === 0 ? renderEmptyState("No clients registered.", "Add Client", () => setShowAddForm(true)) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="py-3 px-6 font-medium">Client</th>
                                <th className="py-3 px-6 font-medium">Edit Branding</th>
                                <th className="py-3 px-6 font-medium">Override Login Rules</th>
                                <th className="py-3 px-6 font-medium">Define Pricing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50/50">
                                    <td className="py-4 px-6 font-medium text-slate-900">
                                        {client.name}
                                        <div className="text-xs text-slate-500 font-normal">{client.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => toggleClientPermission(client.id, 'canEditBranding')}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${client.permissions.canEditBranding ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                                        >
                                            {client.permissions.canEditBranding ? 'Granted' : 'Locked'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => toggleClientPermission(client.id, 'canOverrideLoginRules')}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${client.permissions.canOverrideLoginRules ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                                        >
                                            {client.permissions.canOverrideLoginRules ? 'Granted' : 'Locked'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => toggleClientPermission(client.id, 'canDefineNapPricing')}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${client.permissions.canDefineNapPricing ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                                        >
                                            {client.permissions.canDefineNapPricing ? 'Granted' : 'Locked'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => setSelectedClient(client)}
                                            className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
