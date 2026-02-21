import React, { useState, useEffect } from 'react';
import { Users, Box, Settings, ShieldAlert, Clock, LayoutDashboard, CheckCircle2, XCircle, Plus, MapPin, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { initialClients, initialPods, initialLocations } from './data/mockAdminData';

// Shared: QR Code Generator
const QrGenView = ({ availablePods, availableLocations }) => {
    const [qrType, setQrType] = useState('pod'); // 'pod' or 'location'
    const [selectedId, setSelectedId] = useState('');
    const [qrValue, setQrValue] = useState('');

    const generateQrCode = () => {
        if (selectedId) {
            // In a real app, this would be a dynamic URL pointing to the user interface
            if (qrType === 'pod') {
                setQrValue(`https://urbannaps.com/scan?podId=${selectedId}`);
            } else {
                setQrValue(`https://urbannaps.com/scan?locationId=${selectedId}`);
            }
        } else {
            setQrValue('');
        }
    };

    // Reset selection when changing type
    useEffect(() => {
        setSelectedId('');
        setQrValue('');
    }, [qrType]);

    return (
        <div className="p-8 animate-fade-in max-w-3xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">QR Code Generator</h2>
            <p className="text-sm text-slate-500 mb-8">Generate and print QR codes for your locations or pods to enable quick access for users.</p>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                {/* QR Type Toggle */}
                <div className="flex gap-6 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="qrType"
                            value="pod"
                            checked={qrType === 'pod'}
                            onChange={() => setQrType('pod')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Specific Pod</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="qrType"
                            value="location"
                            checked={qrType === 'location'}
                            onChange={() => setQrType('location')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Entire Location</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {qrType === 'pod' ? 'Select a Pod' : 'Select a Location'}
                    </label>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                    >
                        <option value="">{qrType === 'pod' ? 'Select a pod...' : 'Select a location...'}</option>
                        {qrType === 'pod' ? (
                            availablePods.map(pod => (
                                <option key={pod.id} value={pod.id}>{pod.name} ({pod.id})</option>
                            ))
                        ) : (
                            availableLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name} ({loc.id})</option>
                            ))
                        )}
                    </select>
                </div>

                <button
                    onClick={generateQrCode}
                    disabled={!selectedId}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate QR Code
                </button>

                {qrValue && (
                    <div className="pt-6 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
                        <p className="text-sm font-medium text-slate-700">
                            {qrType === 'pod' ? 'Scan this QR code to access the pod:' : 'Scan this QR code to view the location:'}
                        </p>
                        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-md">
                            <QRCode value={qrValue} size={256} level="H" />
                        </div>
                        <p className="text-xs text-slate-500 font-mono break-all">{qrValue}</p>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <QrCode className="w-4 h-4" /> Print QR Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default function AdminApp() {
    // --- Centralized App State ---
    const [clients, setClients] = useState(initialClients);
    const [locations, setLocations] = useState(initialLocations);
    const [pods, setPods] = useState(initialPods);

    // Default to Super Admin (Urban Naps HQ)
    // "super-admin" OR client ID e.g., "client-2"
    const [activePersona, setActivePersona] = useState("super-admin");

    // View state
    // "dashboard", "clients", "locations", "pods", "branding", "qr-gen"
    const [currentView, setCurrentView] = useState("dashboard");
    const [editingPod, setEditingPod] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); // Used to toggle creation modals

    // --- Form States ---
    const [newClientFlow, setNewClientFlow] = useState({ name: "", type: "custom" });
    const [newLocationFlow, setNewLocationFlow] = useState({ name: "", clientId: "" });
    const [newPodFlow, setNewPodFlow] = useState({ type: "Sleep Pod", clientId: "", locationId: "", name: "" });

    // --- Helpers ---
    const isSuperAdmin = activePersona === "super-admin";
    const currentClient = isSuperAdmin ? null : clients.find(c => c.id === activePersona);

    // Data derivation
    const visiblePods = isSuperAdmin
        ? pods
        : pods.filter(p => p.clientId === activePersona);

    // --- Handlers ---

    const toggleClientPermission = (clientId, permissionKey) => {
        if (!isSuperAdmin) return;
        setClients(prev => prev.map(c => {
            if (c.id === clientId) {
                return {
                    ...c,
                    permissions: {
                        ...c.permissions,
                        [permissionKey]: !c.permissions[permissionKey]
                    }
                };
            }
            return c;
        }));
    };

    const updatePodOverride = (podId, overrideKey, value) => {
        setPods(prev => prev.map(p => {
            if (p.id === podId) {
                return {
                    ...p,
                    overrides: {
                        ...p.overrides,
                        [overrideKey]: value
                    }
                };
            }
            return p;
        }));
    };

    const addNapOption = (podId) => {
        setPods(prev => prev.map(p => {
            if (p.id === podId) {
                return {
                    ...p,
                    napOptions: [...p.napOptions, { durationMinutes: 15, price: 5 }]
                }
            }
            return p;
        }))
    }

    const removeNapOption = (podId, index) => {
        setPods(prev => prev.map(p => {
            if (p.id === podId) {
                const newOptions = [...p.napOptions];
                newOptions.splice(index, 1);
                return { ...p, napOptions: newOptions }
            }
            return p;
        }))
    }

    const updateNapOption = (podId, index, field, value) => {
        setPods(prev => prev.map(p => {
            if (p.id === podId) {
                const newOptions = [...p.napOptions];
                newOptions[index] = { ...newOptions[index], [field]: Number(value) };
                return { ...p, napOptions: newOptions }
            }
            return p;
        }))
    }

    // --- Add Handlers ---

    const handleAddClient = (e) => {
        e.preventDefault();
        const id = `client-${Date.now()}`;
        const newClient = {
            id,
            name: newClientFlow.name,
            brandingType: newClientFlow.type,
            customTheme: newClientFlow.type === "custom" ? "#3b82f6" : null,
            defaultRequiresEmailLogin: false,
            defaultIsPaid: true,
            permissions: { canEditBranding: true, canOverrideLoginRules: false, canDefineNapPricing: true }
        };
        setClients(prev => [...prev, newClient]);
        setShowAddForm(false);
        setNewClientFlow({ name: "", type: "custom" });
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        const locId = `loc-${Date.now()}`;
        setLocations(prev => [...prev, { id: locId, clientId: newLocationFlow.clientId, name: newLocationFlow.name }]);
        setShowAddForm(false);
        setNewLocationFlow({ name: "", clientId: "" });
    };

    const handleAddPod = (e) => {
        e.preventDefault();
        const podId = `pod-${Math.floor(Math.random() * 1000) + 1000}`;
        const newPod = {
            id: podId,
            type: newPodFlow.type,
            clientId: newPodFlow.clientId,
            locationId: newPodFlow.locationId,
            name: newPodFlow.name,
            overrides: { requiresEmailLogin: null, isPaid: null },
            napOptions: []
        };
        setPods(prev => [...prev, newPod]);
        setShowAddForm(false);
        setNewPodFlow({ type: "Sleep Pod", clientId: "", locationId: "", name: "" });
    };

    const renderEmptyState = (message, actionText, actionFn) => (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-slate-500 mb-4">{message}</p>
            {actionFn && (
                <button onClick={actionFn} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                    + {actionText}
                </button>
            )}
        </div>
    );

    // --- Layout Components ---

    const Sidebar = () => (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                    Urban Naps HQ
                </h1>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">
                    {isSuperAdmin ? "Global Operations" : "Client Portal"}
                </p>
            </div>

            <nav className="flex-1 py-4 space-y-1 px-3">
                <button
                    onClick={() => { setCurrentView('dashboard'); setEditingPod(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <LayoutDashboard className="w-4 h-4" /> Overview
                </button>

                {isSuperAdmin && (
                    <button
                        onClick={() => { setCurrentView('clients'); setEditingPod(null); setShowAddForm(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'clients' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Users className="w-4 h-4" /> Clients
                    </button>
                )}

                <button
                    onClick={() => { setCurrentView('locations'); setEditingPod(null); setShowAddForm(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'locations' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <MapPin className="w-4 h-4" /> Locations
                </button>

                <button
                    onClick={() => { setCurrentView('pods'); setEditingPod(null); setShowAddForm(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'pods' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <Box className="w-4 h-4" /> Inventory
                </button>

                <button
                    onClick={() => { setCurrentView('qr-gen'); setEditingPod(null); setShowAddForm(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'qr-gen' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <QrCode className="w-4 h-4" /> Link & Print QR
                </button>

                {!isSuperAdmin && (
                    <button
                        onClick={() => { setCurrentView('branding'); setEditingPod(null); setShowAddForm(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'branding' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Settings className="w-4 h-4" /> Branding Settings
                    </button>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <label className="text-xs uppercase font-bold text-slate-500 block mb-2">Simulate Persona</label>
                <select
                    value={activePersona}
                    onChange={(e) => {
                        setActivePersona(e.target.value);
                        setCurrentView('dashboard');
                        setEditingPod(null);
                    }}
                    className="w-full bg-slate-800 border-none text-white text-sm rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="super-admin">👑 Super Admin (Urban Naps)</option>
                    <optgroup label="Client Admins">
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>👤 {c.name}</option>
                        ))}
                    </optgroup>
                </select>
            </div>
        </div>
    );

    // --- Main Views ---

    // Dashboard View
    const renderDashboard = () => (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Dashboard</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Box className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Pods</p>
                        <p className="text-3xl font-light text-slate-900">{visiblePods.length}</p>
                    </div>
                </div>
                {isSuperAdmin && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Clients</p>
                            <p className="text-3xl font-light text-slate-900">{clients.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Super Admin: View all clients and grant permissions
    const renderClientsView = () => (
        <div className="p-8 animate-fade-in max-w-5xl">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Client Management</h2>
                    <p className="text-sm text-slate-500">Add new clients and manage their override permissions.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Client
                </button>
            </div>

            {/* Add Client Form Overlay */}
            {showAddForm && (
                <div className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-fade-in-up">
                    <h3 className="font-semibold text-slate-800 mb-4">Create New Client</h3>
                    <form onSubmit={handleAddClient} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label>
                            <input
                                required type="text" placeholder="e.g. Acme Corp"
                                value={newClientFlow.name} onChange={e => setNewClientFlow({ ...newClientFlow, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Branding Package</label>
                            <select
                                value={newClientFlow.type} onChange={e => setNewClientFlow({ ...newClientFlow, type: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                            >
                                <option value="custom">Custom Hex Theme</option>
                                <option value="urban-naps">Default Urban Naps</option>
                            </select>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg shrink-0">Save Client</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium shrink-0">Cancel</button>
                    </form>
                </div>
            )}

            {clients.length === 0 ? renderEmptyState("No clients registered.", "Add Client", () => setShowAddForm(true)) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    // Shared: View Locations
    const renderLocationsView = () => {
        const visibleLocations = isSuperAdmin ? locations : locations.filter(l => l.clientId === activePersona);

        return (
            <div className="p-8 animate-fade-in max-w-5xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Locations</h2>
                        <p className="text-sm text-slate-500">Physical venues where Pods are stationed.</p>
                    </div>
                    {(isSuperAdmin || currentClient) && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Location
                        </button>
                    )}
                </div>

                {showAddForm && (
                    <div className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-fade-in-up">
                        <h3 className="font-semibold text-slate-800 mb-4">Register New Location</h3>
                        <form onSubmit={handleAddLocation} className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Venue Name</label>
                                <input
                                    required type="text" placeholder="e.g. Lobby 1"
                                    value={newLocationFlow.name} onChange={e => setNewLocationFlow({ ...newLocationFlow, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                                />
                            </div>
                            {isSuperAdmin && (
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Assign To Client</label>
                                    <select
                                        required value={newLocationFlow.clientId} onChange={e => setNewLocationFlow({ ...newLocationFlow, clientId: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
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
                                className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg shrink-0"
                            >Save Location</button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium shrink-0">Cancel</button>
                        </form>
                    </div>
                )}

                {visibleLocations.length === 0 ? renderEmptyState("No locations registered.", "Create Location", () => setShowAddForm(true)) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
        )
    };

    // Shared: View Pods
    const renderPodsView = () => {
        if (editingPod) return renderPodEditor(editingPod);

        return (
            <div className="p-8 animate-fade-in max-w-5xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">{isSuperAdmin ? "Global Inventory" : "My Pods"}</h2>
                        <p className="text-sm text-slate-500">Configure nap durations and local overrides for your physical units.</p>
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Pod
                        </button>
                    )}
                </div>

                {showAddForm && isSuperAdmin && (
                    <div className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-fade-in-up">
                        <h3 className="font-semibold text-slate-800 mb-4">Register Hardware Unit</h3>
                        <form onSubmit={handleAddPod} className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Pod Custom Name</label>
                                <input
                                    required type="text" placeholder="e.g. Alpha Box"
                                    value={newPodFlow.name} onChange={e => setNewPodFlow({ ...newPodFlow, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Hardware Type</label>
                                <select
                                    value={newPodFlow.type} onChange={e => setNewPodFlow({ ...newPodFlow, type: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                                >
                                    <option value="Sleep Pod">Sleep Pod</option>
                                    <option value="Work Pod">Work Pod</option>
                                    <option value="Aero Pod">Aero Pod</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Assign Client</label>
                                <select
                                    required value={newPodFlow.clientId}
                                    onChange={e => setNewPodFlow({ ...newPodFlow, clientId: e.target.value, locationId: "" })} // Reset loc when client changes
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                                >
                                    <option value="" disabled>Select client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Assign Location</label>
                                <select
                                    required value={newPodFlow.locationId}
                                    disabled={!newPodFlow.clientId}
                                    onChange={e => setNewPodFlow({ ...newPodFlow, locationId: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm disabled:opacity-50"
                                >
                                    <option value="" disabled>Select location...</option>
                                    {locations.filter(l => l.clientId === newPodFlow.clientId).map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium shrink-0">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg shrink-0">Save Pod</button>
                            </div>
                        </form>
                    </div>
                )}

                {visiblePods.length === 0 ? renderEmptyState("No pods deployed.", isSuperAdmin ? "Add Pod" : null, isSuperAdmin ? () => setShowAddForm(true) : null) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visiblePods.map(pod => {
                            const clientName = isSuperAdmin ? (clients.find(c => c.id === pod.clientId)?.name || "Unassigned") : false;
                            const locationName = locations.find(l => l.id === pod.locationId)?.name || "Unknown Location";

                            return (
                                <div key={pod.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">{pod.name}</h3>
                                            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">{pod.type}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-mono mb-1">{pod.id}</p>
                                        <p className="text-xs text-indigo-600 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" />{locationName}</p>
                                    </div>

                                    <div className="p-5 flex-1 space-y-4">
                                        {isSuperAdmin && (
                                            <div className="flex items-center gap-2 text-sm text-slate-700">
                                                <Users className="w-4 h-4 text-slate-400" /> {clientName}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nap Config</p>
                                            {pod.napOptions.length === 0 ? (
                                                <p className="text-sm text-amber-600 flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Not Configured</p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {pod.napOptions.map((opt, i) => (
                                                        <span key={i} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">
                                                            {opt.durationMinutes}m / ${opt.price}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                                        <button
                                            onClick={() => setEditingPod(pod)}
                                            className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-colors"
                                        >
                                            Configure Unit
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    };

    // Shared: Granular Pod Configurator
    const renderPodEditor = (pod) => {
        // Resolve permissions based on persona
        const canEditPricing = isSuperAdmin || currentClient?.permissions.canDefineNapPricing;
        const canOverrideLogin = isSuperAdmin || currentClient?.permissions.canOverrideLoginRules;

        return (
            <div className="p-8 animate-fade-in max-w-4xl">
                <button
                    onClick={() => setEditingPod(null)}
                    className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6"
                >
                    ← Back to Pods
                </button>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-900">{pod.name}</h2>
                        <p className="text-sm text-slate-500">{pod.id} • {pod.type}</p>
                    </div>

                    <div className="p-6 space-y-8">

                        {/* Nap Options Editor */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" /> Nap Configurations
                                </h3>
                                {!canEditPricing && (
                                    <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200 flex items-center gap-1">
                                        <ShieldAlert className="w-3 h-3" /> Locked by HQ
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                {pod.napOptions.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-slate-500 block mb-1">Duration (Mins)</label>
                                            <input
                                                type="number"
                                                disabled={!canEditPricing}
                                                value={opt.durationMinutes}
                                                onChange={(e) => updateNapOption(pod.id, index, 'durationMinutes', e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:bg-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-slate-500 block mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                disabled={!canEditPricing}
                                                value={opt.price}
                                                onChange={(e) => updateNapOption(pod.id, index, 'price', e.target.value)}
                                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 disabled:bg-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        {canEditPricing && (
                                            <div className="pt-5">
                                                <button onClick={() => removeNapOption(pod.id, index)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {canEditPricing && (
                                    <button
                                        onClick={() => addNapOption(pod.id)}
                                        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                    >
                                        + Add Nap Option
                                    </button>
                                )}
                            </div>
                        </section>

                        <hr className="border-slate-100" />

                        {/* Granular Overrides */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-emerald-500" /> Unit Overrides
                                </h3>
                                <p className="text-sm text-slate-500">Override client defaults for this specific pod.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Login Override */}
                                <div className="bg-white border border-slate-200 p-5 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <label className="font-medium text-slate-900">Email Login Required</label>
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
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    // Client Admin Only: Branding
    const renderBrandingView = () => {
        if (!currentClient) return null;
        const canEdit = currentClient.permissions.canEditBranding;

        return (
            <div className="p-8 animate-fade-in max-w-3xl">
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Branding Settings</h2>
                <p className="text-sm text-slate-500 mb-8">Configure your business identity across the Urban Naps frontend. {!canEdit && <span className="text-amber-600 font-medium">Your permissions have been restricted by Urban Naps HQ.</span>}</p>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Client Name / Label</label>
                        <input
                            type="text"
                            value={currentClient.name}
                            disabled
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-slate-500 bg-slate-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Contact HQ to change your registered business name.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="text-sm font-medium text-slate-700 block mb-2">Brand UI Theme Variant</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${!canEdit && 'opacity-50'} ${currentClient.brandingType === 'urban-naps' ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" disabled={!canEdit} readOnly checked={currentClient.brandingType === 'urban-naps'} className="w-4 h-4 text-indigo-600 pointer-events-none" />
                                <div>
                                    <p className="font-semibold text-slate-900">Default Urban Naps</p>
                                    <p className="text-xs text-slate-500">Standard Indigo/Slate design.</p>
                                </div>
                            </label>
                            <label className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${!canEdit && 'opacity-50'} ${currentClient.brandingType === 'custom' ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input type="radio" disabled={!canEdit} readOnly checked={currentClient.brandingType === 'custom'} className="w-4 h-4 text-indigo-600 pointer-events-none" />
                                <div>
                                    <p className="font-semibold text-slate-900">Custom Branding</p>
                                    <p className="text-xs text-slate-500">Provide your own branding details.</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {currentClient.brandingType === 'custom' && (
                        <div className="pt-4 border-t border-slate-100 animate-fade-in-up">
                            <label className="text-sm font-medium text-slate-700 block mb-2">Primary App Hex Color</label>
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full border-4 border-white shadow-md shadow-black/10" style={{ backgroundColor: currentClient.customTheme || '#000000' }}></div>
                                <input
                                    type="text"
                                    value={currentClient.customTheme || '#000000'}
                                    disabled={!canEdit}
                                    readOnly
                                    className="border border-slate-300 rounded-lg px-4 py-2 w-32 disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                />
                                {canEdit && <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Edit Color</button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Shared: QR Code Generator
    // The QR component was moved outside of AdminApp.


    return (
        <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                {currentView === 'dashboard' && renderDashboard()}
                {currentView === 'clients' && isSuperAdmin && renderClientsView()}
                {currentView === 'locations' && renderLocationsView()}
                {currentView === 'pods' && renderPodsView()}
                {currentView === 'branding' && !isSuperAdmin && renderBrandingView()}
                {currentView === 'qr-gen' && <QrGenView availablePods={isSuperAdmin ? pods : visiblePods} availableLocations={isSuperAdmin ? locations : locations.filter(l => l.clientId === activePersona)} />}
            </div>
        </div>
    );
}
