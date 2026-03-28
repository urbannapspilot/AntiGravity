import React, { useState } from 'react';
import { Plus, ArrowLeft, Download } from 'lucide-react';
import { downloadCsv } from '../../../utils/csvExport';

export const PromotionsHub = ({
    promotions,
    setPromotions,
    selectedPromotion,
    setSelectedPromotion,
    activePersona,
    clients,
    isSuperAdmin,
    showAddForm,
    setShowAddForm,
    handleAddPromo,
    newPromoFlow,
    setNewPromoFlow,
    renderEmptyState
}) => {
    const [generateCount, setGenerateCount] = useState(10);

    const renderPromotionDetailsView = (promoId) => {
        const promo = promotions.find(p => p.id === promoId);
        if (!promo) return null;

        const usagePercentage = promo.maxUses > 0 ? Math.min(100, ((promo.currentUses || 0) / promo.maxUses) * 100) : 0;

        const updatePromo = (field, value) => {
            setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, [field]: value } : p));
        };

        const handleGenerateCodes = () => {
            if (!generateCount || generateCount < 1) return;
            const newCodes = Array.from({ length: generateCount }).map(() => ({
                code: `${promo.code}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                status: 'unused',
                usedAt: null,
                usedBy: null
            }));

            updatePromo('generatedCodes', [...(promo.generatedCodes || []), ...newCodes]);
            setGenerateCount(10);
        };

        const handleExportCsv = () => {
            const dataToExport = promo.generatedCodes || [];
            if (dataToExport.length === 0) return;
            const columns = [
                { header: 'Unique Code', key: 'code' },
                { header: 'Status', key: 'status' },
                { header: 'Used By', key: 'usedBy' },
                { header: 'Used At', key: 'usedAt' }
            ];
            downloadCsv(dataToExport, columns, `${promo.code}_unique_codes`);
        };

        return (
            <div className="p-8 lg:p-12 animate-fade-in max-w-5xl">
                <button
                    onClick={() => setSelectedPromotion(null)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Promotions
                </button>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <h2 className="text-4xl font-black font-mono tracking-tight text-slate-900">{promo.code}</h2>
                            <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${promo.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {promo.active ? 'Active' : 'Disabled'}
                            </span>
                        </div>
                        <p className="text-base text-slate-500 font-medium tracking-tight">
                            {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                            <span className="mx-2 text-slate-300">•</span>
                            {activePersona === 'super-admin' ? ((clients || []).find(c => c?.id === promo?.clientId)?.name || 'Unknown Client') : 'My Promotion'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-8">
                    {/* Analytics Card */}
                    <div className="col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-card flex flex-col justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Total Redemptions</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-6xl font-light tracking-tighter text-slate-900">{promo.currentUses}</span>
                                <span className="text-slate-400 font-medium pb-2 text-lg">/ {promo.maxUses || '∞'}</span>
                            </div>
                        </div>

                        <div>
                            <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
                                <div className="bg-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${usagePercentage}%` }}></div>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 text-right">{usagePercentage.toFixed(0)}% Claimed</p>
                        </div>
                    </div>

                    {/* Editor Form */}
                    <div className="col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-card space-y-8">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <h3 className="text-lg font-semibold tracking-tight text-slate-800">Coupon Constraints</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">Usage Cap</label>
                                <input
                                    type="number" min="0"
                                    value={promo.maxUses}
                                    onChange={(e) => updatePromo('maxUses', Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                />
                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-widest">0 = Unlimited</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">Minimum Spend ($)</label>
                                <input
                                    type="number" min="0" step="0.5"
                                    value={promo.minimumSpend}
                                    onChange={(e) => updatePromo('minimumSpend', Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={promo.startDate}
                                    onChange={(e) => updatePromo('startDate', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={promo.endDate}
                                    onChange={(e) => updatePromo('endDate', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">Internal Notes / Description</label>
                                <textarea
                                    value={promo.description}
                                    onChange={(e) => updatePromo('description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all shadow-sm"
                                    placeholder="Details about this campaign..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold bg-white text-slate-400 uppercase tracking-widest mb-2">Redemption Strategy</label>
                                <select
                                    value={promo.redemptionStrategy}
                                    onChange={(e) => updatePromo('redemptionStrategy', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                >
                                    <option value="global">Global Code Only</option>
                                    <option value="unique_restricted">Unique Codes Only</option>
                                    <option value="hybrid">Hybrid (Accepts Both)</option>
                                </select>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-widest">
                                    {promo.redemptionStrategy === 'global' ? 'Disables Unique Generation' : promo.redemptionStrategy === 'unique_restricted' ? 'Rejects root code at checkout' : 'Accepts both root variants'}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => updatePromo('active', !promo.active)}
                                className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${promo.active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                            >
                                {promo.active ? 'Deactivate Code' : 'Re-activate Code'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Generated Codes Section */}
                {promo.redemptionStrategy !== 'global' && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-card">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                            <h3 className="text-lg font-semibold tracking-tight text-slate-800">Generated Unique Codes</h3>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <input
                                    type="number"
                                    min="1"
                                    value={generateCount}
                                    onChange={e => setGenerateCount(Number(e.target.value))}
                                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                />
                                <button
                                    onClick={handleGenerateCodes}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-500/20 whitespace-nowrap"
                                >
                                    Generate Codes
                                </button>
                                <button
                                    onClick={handleExportCsv}
                                    disabled={!(promo.generatedCodes && promo.generatedCodes.length > 0)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            </div>
                        </div>

                        {!(promo.generatedCodes && promo.generatedCodes.length > 0) ? (
                            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                <p className="text-slate-500 text-sm">No unique codes generated yet. Generate some codes to distribute individually.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                        <tr>
                                            <th className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-400">Unique Code</th>
                                            <th className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-400">Used By</th>
                                            <th className="py-3 px-4 font-bold text-xs uppercase tracking-widest text-slate-400">Used At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {promo.generatedCodes.map((gc, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="py-3 px-4 font-mono font-bold text-slate-800">{gc.code}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${gc.status === 'used' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                                        {gc.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{gc.usedBy || '-'}</td>
                                                <td className="py-3 px-4 text-slate-600">{gc.usedAt || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (selectedPromotion) return renderPromotionDetailsView(selectedPromotion);

    const visiblePromotions = activePersona === 'super-admin'
        ? (promotions || [])
        : (promotions || []).filter(p => p?.clientId === activePersona);

    return (
        <div className="p-8 lg:p-12 animate-fade-in max-w-6xl">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Promotions & Campaigns</h2>
                    <p className="text-sm text-slate-500">Manage global and client-specific coupon codes.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-indigo-500/20 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Create Promo Code
                </button>
            </div>

            {/* Add Promotion Form */}
            {showAddForm && (
                <div className="mb-8 p-8 bg-white border border-slate-100 rounded-3xl shadow-card animate-fade-in-up">
                    <h3 className="font-semibold text-lg text-slate-800 mb-6">Create New Promotion</h3>
                    <form onSubmit={handleAddPromo} className="grid grid-cols-5 gap-6 items-end">
                        {isSuperAdmin && (
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Assign to Client</label>
                                <select
                                    required value={newPromoFlow.clientId} onChange={e => setNewPromoFlow({ ...newPromoFlow, clientId: e.target.value })}
                                    className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                >
                                    <option value="">Select client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className={isSuperAdmin ? "" : "col-span-2"}>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Promo Code</label>
                            <input
                                required type="text" placeholder="e.g. SUMMER25"
                                value={newPromoFlow.code}
                                onChange={e => setNewPromoFlow({ ...newPromoFlow, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 text-slate-900 font-mono font-bold tracking-wide rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Discount Type</label>
                            <select
                                value={newPromoFlow.discountType} onChange={e => setNewPromoFlow({ ...newPromoFlow, discountType: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="percentage">% Percentage</option>
                                <option value="fixed">$ Fixed Amount</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Value</label>
                            <input
                                required type="number" min="1" max={newPromoFlow.discountType === 'percentage' ? "100" : "1000"}
                                value={newPromoFlow.discountValue} onChange={e => setNewPromoFlow({ ...newPromoFlow, discountValue: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                placeholder={newPromoFlow.discountType === 'percentage' ? "e.g. 20" : "e.g. 50"}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Redemption Strategy</label>
                            <select
                                value={newPromoFlow.redemptionStrategy} onChange={e => setNewPromoFlow({ ...newPromoFlow, redemptionStrategy: e.target.value })}
                                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                            >
                                <option value="global">Global Code Only</option>
                                <option value="unique_restricted">Unique Codes Only</option>
                                <option value="hybrid">Hybrid (Both)</option>
                            </select>
                        </div>
                        <div className="flex gap-3 col-span-5 md:col-span-1">
                            <button type="submit" className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors shadow-md">Save</button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 text-slate-500 hover:bg-slate-100 font-medium rounded-xl transition-colors">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {visiblePromotions.length === 0 ? renderEmptyState("No promotions active.", isSuperAdmin ? "Create Promo" : null, isSuperAdmin ? () => setShowAddForm(true) : null) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400">
                            <tr>
                                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest w-1/4">Code</th>
                                {isSuperAdmin && <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest w-1/4">Assigned Client</th>}
                                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest w-1/4">Discount Rule</th>
                                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest w-[15%]">Status</th>
                                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visiblePromotions.map(promo => {
                                const client = clients.find(c => c.id === promo.clientId);
                                return (
                                    <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 px-6 font-mono font-bold text-slate-900 tracking-wide text-base">
                                            {promo.code}
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="py-5 px-6 font-medium text-slate-600">
                                                {client?.name || 'Unknown Entity'}
                                            </td>
                                        )}
                                        <td className="py-5 px-6 font-semibold text-emerald-600">
                                            {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`}
                                        </td>
                                        <td className="py-5 px-6">
                                            <button
                                                onClick={() => setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, active: !p.active } : p))}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${promo.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200 opacity-70 hover:opacity-100'}`}
                                            >
                                                {promo.active ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="py-5 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => setSelectedPromotion(promo.id)}
                                                className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            >
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => setPromotions(prev => prev.filter(p => p.id !== promo.id))}
                                                className="text-red-500 hover:text-red-700 font-semibold text-xs px-4 py-2 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
