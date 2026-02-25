import React from 'react';

export const BrandingView = ({ currentClient, setClients }) => {
    if (!currentClient) return null;
    const canEdit = currentClient.permissions.canEditBranding;

    return (
        <div className="p-8 lg:p-12 animate-fade-in max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Branding Settings</h2>
            <p className="text-sm text-slate-500 mb-8">Configure your business identity across the Urban Naps frontend. {!canEdit && <span className="text-amber-600 font-medium">Your permissions have been restricted by Urban Naps HQ.</span>}</p>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8 space-y-8">
                <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Client Name / Label</label>
                    <input
                        type="text"
                        value={currentClient.name}
                        disabled
                        className="w-full bg-slate-50 opacity-70 border border-slate-200 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-2">To change your legal entity name, contact HQ.</p>
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Theming Mode</label>
                    <select
                        disabled={!canEdit}
                        value={currentClient.brandingType}
                        onChange={(e) => {
                            setClients(prev => prev.map(c => c.id === currentClient.id ? {
                                ...c,
                                brandingType: e.target.value,
                                customTheme: e.target.value === 'custom' ? '#4F46E5' : null
                            } : c));
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50 transition-all shadow-sm"
                    >
                        <option value="urban-naps">Standard Urban Naps</option>
                        <option value="custom">Custom White-label</option>
                    </select>
                </div>

                {currentClient.brandingType === 'custom' && (
                    <div className="animate-fade-in-up">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Primary Brand Color (Hex)</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                disabled={!canEdit}
                                value={currentClient.customTheme || '#4F46E5'}
                                onChange={(e) => {
                                    setClients(prev => prev.map(c => c.id === currentClient.id ? { ...c, customTheme: e.target.value } : c));
                                }}
                                className="w-14 h-14 rounded-xl cursor-pointer disabled:opacity-50 border border-slate-200 shadow-sm"
                            />
                            <input
                                type="text"
                                disabled={!canEdit}
                                value={currentClient.customTheme || '#4F46E5'}
                                onChange={(e) => {
                                    setClients(prev => prev.map(c => c.id === currentClient.id ? { ...c, customTheme: e.target.value } : c));
                                }}
                                className="flex-1 font-mono uppercase bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
