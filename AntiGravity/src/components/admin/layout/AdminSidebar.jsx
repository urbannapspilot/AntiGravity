import React from 'react';
import { LayoutDashboard, Users, MapPin, Box, QrCode, Tag, Settings } from 'lucide-react';

export const AdminSidebar = ({
    isSuperAdmin,
    currentView,
    setCurrentView,
    activePersona,
    setActivePersona,
    clients,
    setEditingPod,
    setShowAddForm,
    setSelectedPromotion,
    setNewPromoFlow
}) => (
    <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800/50 shadow-2xl z-20">
        <div className="p-8 border-b border-slate-800/50">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-indigo-500/20 shadow-lg">
                    <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                Urban Naps HQ
            </h1>
            <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em] ml-11">
                {isSuperAdmin ? "Global Operations" : "Client Portal"}
            </p>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-4">
            <button
                onClick={() => { setCurrentView('dashboard'); setEditingPod(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'dashboard' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
                <LayoutDashboard className="w-4 h-4" /> Overview
            </button>

            {isSuperAdmin && (
                <button
                    onClick={() => { setCurrentView('clients'); setEditingPod(null); setShowAddForm(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'clients' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                    <Users className="w-4 h-4" /> Clients
                </button>
            )}

            <button
                onClick={() => { setCurrentView('locations'); setEditingPod(null); setShowAddForm(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'locations' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
                <MapPin className="w-4 h-4" /> Locations
            </button>

            <button
                onClick={() => { setCurrentView('pods'); setEditingPod(null); setShowAddForm(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'pods' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
                <Box className="w-4 h-4" /> Inventory
            </button>

            <button
                onClick={() => { setCurrentView('qr-gen'); setEditingPod(null); setShowAddForm(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'qr-gen' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
                <QrCode className="w-4 h-4" /> Link & Print QR
            </button>

            <button
                onClick={() => { setCurrentView('promotions'); setEditingPod(null); setShowAddForm(false); setSelectedPromotion(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'promotions' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
                <Tag className="w-4 h-4" /> Promotions
            </button>

            {!isSuperAdmin && (
                <button
                    onClick={() => { setCurrentView('branding'); setEditingPod(null); setShowAddForm(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === 'branding' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                    <Settings className="w-4 h-4" /> Branding Settings
                </button>
            )}
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/50">
            <label className="text-[10px] uppercase font-bold tracking-[0.1em] text-slate-500 block mb-3">Simulate Persona</label>
            <select
                value={activePersona}
                onChange={(e) => {
                    setActivePersona(e.target.value);
                    setCurrentView('dashboard');
                    setEditingPod(null);
                    setSelectedPromotion(null);
                    setNewPromoFlow({ code: "", clientId: "", discountType: "percentage", discountValue: 10, maxUses: 100, minimumSpend: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] });
                }}
                className="w-full bg-slate-800 border border-slate-700/50 text-white text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            >
                <option value="super-admin">👑 Super Admin (Global)</option>
                <optgroup label="Client Admins">
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>👤 {c.name}</option>
                    ))}
                </optgroup>
            </select>
        </div>
    </div>
);
