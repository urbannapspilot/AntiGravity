import React, { useState, useEffect } from 'react';
import {
    Users, Box, Settings, ShieldAlert, Clock, LayoutDashboard, CheckCircle2, XCircle, Plus, Activity, Percent, ArrowLeft, MoreVertical, Search, CheckCircle, MapPin, QrCode, Tag, RefreshCw, Calendar
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { initialClients, initialLocations, initialPods, initialPromotions } from './data/mockAdminData';
import { useGlobalSession } from './context/GlobalSessionContext';
import { QrGenView } from './components/shared/QrGenView';
import { DashboardView } from './components/admin/dashboard/DashboardView';
import { ClientsView } from './components/admin/clients/ClientsView';
import { BrandingView } from './components/admin/clients/BrandingView';
import { LocationsView } from './components/admin/locations/LocationsView';
import { PodsBrowser } from './components/admin/pods/PodsBrowser';
import { PodEditor } from './components/admin/pods/PodEditor';
import { PromotionsHub } from './components/admin/promotions/PromotionsHub';
import { AdminSidebar } from './components/admin/layout/AdminSidebar';
import { API_BASE_URL } from './config';

// Shared: QR Code Generator component extracted to src/components/shared/QrGenView.jsx

export default function AdminApp() {
    // --- Centralized App State ---
    const [clients, setClients] = useState(initialClients);
    const [locations, setLocations] = useState([]);
    const [pods, setPods] = useState(initialPods);
    const [promotions, setPromotions] = useState([]);

    // --- Backend Fetching ---
    useEffect(() => {
        // Power the admin frontend from the newly created admin-core backend!
        fetch(`${API_BASE_URL}/api/admin/organizations`)
            .then(res => res.json())
            .then(data => {
                if (data?.status?.success && data.data && data.data.length > 0) {
                    setClients(data.data);
                }
            })
            .catch(err => console.warn("Using mock clients (admin-core backend not reachable running on 3001)"));

        fetch(`${API_BASE_URL}/api/admin/pods`)
            .then(res => res.json())
            .then(data => {
                if (data?.status?.success && data.data && data.data.length > 0) {
                    setPods(data.data);
                }
            })
            .catch(err => console.warn("Using mock pods (admin-core backend not reachable)"));

        fetch(`${API_BASE_URL}/api/admin/locations`)
            .then(res => res.json())
            .then(data => {
                if (data?.status?.success && data.data) {
                    setLocations(data.data);
                }
            })
            .catch(err => console.warn("Using mock locations fallback", err));

        fetch(`${API_BASE_URL}/api/admin/promotions`)
            .then(res => res.json())
            .then(data => {
                if (data?.status?.success && data.data) {
                    setPromotions(data.data);
                }
            })
            .catch(err => console.warn("Using mock promotions fallback", err));
    }, []);

    // --- Global Session State ---
    const { activeSessions, terminateSession, upcomingBookings = [], pastSessions = [] } = useGlobalSession();

    // Default to Super Admin (Urban Naps HQ)
    // "super-admin" OR client ID e.g., "client-2"
    const [activePersona, setActivePersona] = useState("super-admin");

    // View state
    // "dashboard", "clients", "locations", "pods", "branding", "qr-gen"
    const [currentView, setCurrentView] = useState("dashboard");
    const [selectedClient, setSelectedClient] = useState(null);
    const [editingPod, setEditingPod] = useState(null);
    const [podDetailsTab, setPodDetailsTab] = useState('overview'); // "overview", "future", "history", "config"
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); // Used to toggle creation modals

    // --- Form States ---
    const [newClientFlow, setNewClientFlow] = useState({ name: "", type: "custom" });
    const [newLocationFlow, setNewLocationFlow] = useState({ name: "", clientId: "" });
    const [newPodFlow, setNewPodFlow] = useState({ type: "Sleep Pod", clientId: "", locationId: "", name: "", thingName: "" });
    const [newPromoFlow, setNewPromoFlow] = useState({ code: "", clientId: "", discountType: "percentage", discountValue: 10, maxUses: 100, minimumSpend: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], redemptionStrategy: "global" });

    // Active Persona Computations
    const isSuperAdmin = activePersona === 'super-admin';
    const currentClient = isSuperAdmin ? null : (clients || []).find(c => c?.id === activePersona);
    const visiblePods = isSuperAdmin ? (pods || []) : (pods || []).filter(p => p?.clientId === activePersona);
    const visibleLocations = isSuperAdmin ? (locations || []) : (locations || []).filter(l => l?.clientId === activePersona);

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

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/organizations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newClientFlow.name }) // backend uses title
            });
            const data = await res.json();
            if (data?.status?.success) {
                // Refresh list
                const clientsRes = await fetch(`${API_BASE_URL}/api/admin/organizations`).then(r => r.json());
                setClients(clientsRes.data);
                setShowAddForm(false);
                setNewClientFlow({ name: "", type: "custom" });
            }
        } catch (err) {
            console.error("Failed to add client to DB", err);
        }
    };

    const handleAddLocation = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/locations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newLocationFlow.name, organization_id: newLocationFlow.clientId })
            });
            const data = await res.json();
            if (data?.status?.success) {
                const locsRes = await fetch(`${API_BASE_URL}/api/admin/locations`).then(r => r.json());
                setLocations(locsRes.data);
                setShowAddForm(false);
                setNewLocationFlow({ name: "", clientId: "" });
            }
        } catch (err) {
            console.error("Failed to add location to DB", err);
        }
    };

    const handleAddPod = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/pods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: newPodFlow.name, 
                    thing_name: newPodFlow.thingName,
                    slug: newPodFlow.thingName.toLowerCase().replace(/\s+/g, '-'),
                    type: newPodFlow.type, 
                    organization_id: newPodFlow.clientId, 
                    location_id: newPodFlow.locationId 
                })
            });
            const data = await res.json();
            if (data?.status?.success) {
                const podsRes = await fetch('http://localhost:3001/api/admin/pods').then(r => r.json());
                setPods(podsRes.data);
                setShowAddForm(false);
                setNewPodFlow({ type: "Sleep Pod", clientId: "", locationId: "", name: "", thingName: "" });
            }
        } catch (err) {
            console.error("Failed to add pod to DB", err);
        }
    };

    const handleAddPromo = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: newPromoFlow.code,
                    clientId: isSuperAdmin ? newPromoFlow.clientId : activePersona,
                    discountType: newPromoFlow.discountType,
                    discountValue: newPromoFlow.discountValue,
                    maxUses: newPromoFlow.maxUses,
                    minimumSpend: newPromoFlow.minimumSpend,
                    startDate: newPromoFlow.startDate,
                    endDate: newPromoFlow.endDate,
                    redemptionStrategy: newPromoFlow.redemptionStrategy
                })
            });
            const data = await res.json();
            if (data?.status?.success) {
                const promosRes = await fetch(`${API_BASE_URL}/api/admin/promotions`).then(r => r.json());
                setPromotions(promosRes.data);
                setShowAddForm(false);
                setNewPromoFlow({ code: "", clientId: "", discountType: "percentage", discountValue: 10, maxUses: 100, minimumSpend: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], redemptionStrategy: "global" });
            }
        } catch (err) {
            console.error("Failed to add promotion to DB", err);
        }
    };

    const updateClientWhitelist = async (clientId, newDomains) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/organizations/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whitelistedDomains: newDomains })
            });
            const data = await res.json();
            if (data?.status?.success) {
                const clientsRes = await fetch('http://localhost:3001/api/admin/organizations').then(r => r.json());
                setClients(clientsRes.data);
                if (selectedClient && selectedClient.id === clientId) {
                    setSelectedClient(clientsRes.data.find(c => c.id === clientId));
                }
            }
        } catch (err) {
            console.error("Failed to update whitelist in DB", err);
        }
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
    // Sidebar component extracted to src/components/admin/layout/AdminSidebar.jsx

    // Dashboard View extracted to src/components/admin/dashboard/DashboardView.jsx

    // Clients View extracted to src/components/admin/clients/ClientsView.jsx

    // Locations View extracted to src/components/admin/locations/LocationsView.jsx

    // Shared: View Pods & Pod Editor extracted to components


    // Branding View extracted to src/components/admin/clients/BrandingView.jsx

    // Shared: Promotions View extracted to src/components/admin/promotions/PromotionsHub.jsx

    // Shared: QR Code Generator
    // The QR component was moved outside of AdminApp.


    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <AdminSidebar
                isSuperAdmin={isSuperAdmin}
                currentView={currentView}
                setCurrentView={setCurrentView}
                activePersona={activePersona}
                setActivePersona={setActivePersona}
                clients={clients}
                setEditingPod={setEditingPod}
                setShowAddForm={setShowAddForm}
                setSelectedPromotion={setSelectedPromotion}
                setNewPromoFlow={setNewPromoFlow}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                {currentView === 'dashboard' && <DashboardView isSuperAdmin={isSuperAdmin} visiblePods={visiblePods} visibleLocations={visibleLocations} clients={clients} />}
                {currentView === 'clients' && isSuperAdmin && (
                    <ClientsView
                        clients={clients}
                        showAddForm={showAddForm}
                        setShowAddForm={setShowAddForm}
                        handleAddClient={handleAddClient}
                        newClientFlow={newClientFlow}
                        setNewClientFlow={setNewClientFlow}
                        toggleClientPermission={toggleClientPermission}
                        updateClientWhitelist={updateClientWhitelist}
                        renderEmptyState={renderEmptyState}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        pods={pods}
                        locations={locations}
                        pastSessions={pastSessions}
                    />
                )}
                {currentView === 'locations' && (
                    <LocationsView
                        isSuperAdmin={isSuperAdmin}
                        currentClient={currentClient}
                        clients={clients}
                        visibleLocations={visibleLocations}
                        showAddForm={showAddForm}
                        setShowAddForm={setShowAddForm}
                        handleAddLocation={handleAddLocation}
                        newLocationFlow={newLocationFlow}
                        setNewLocationFlow={setNewLocationFlow}
                        activePersona={activePersona}
                        renderEmptyState={renderEmptyState}
                    />
                )}
                {currentView === 'pods' && (
                    editingPod ? (
                        <PodEditor
                            pod={editingPod}
                            isSuperAdmin={isSuperAdmin}
                            currentClient={currentClient}
                            activeSessions={activeSessions}
                            upcomingBookings={upcomingBookings}
                            pastSessions={pastSessions}
                            setEditingPod={setEditingPod}
                            podDetailsTab={podDetailsTab}
                            setPodDetailsTab={setPodDetailsTab}
                            terminateSession={terminateSession}
                            updateNapOption={updateNapOption}
                            removeNapOption={removeNapOption}
                            addNapOption={addNapOption}
                            updatePodOverride={updatePodOverride}
                        />
                    ) : (
                        <PodsBrowser
                            isSuperAdmin={isSuperAdmin}
                            showAddForm={showAddForm}
                            setShowAddForm={setShowAddForm}
                            handleAddPod={handleAddPod}
                            newPodFlow={newPodFlow}
                            setNewPodFlow={setNewPodFlow}
                            clients={clients}
                            locations={locations}
                            visiblePods={visiblePods}
                            activeSessions={activeSessions}
                            terminateSession={terminateSession}
                            setEditingPod={setEditingPod}
                            renderEmptyState={renderEmptyState}
                            upcomingBookings={upcomingBookings}
                        />
                    )
                )}
                {currentView === 'promotions' && (
                    <PromotionsHub
                        promotions={promotions}
                        setPromotions={setPromotions}
                        selectedPromotion={selectedPromotion}
                        setSelectedPromotion={setSelectedPromotion}
                        activePersona={activePersona}
                        clients={clients}
                        isSuperAdmin={isSuperAdmin}
                        showAddForm={showAddForm}
                        setShowAddForm={setShowAddForm}
                        handleAddPromo={handleAddPromo}
                        newPromoFlow={newPromoFlow}
                        setNewPromoFlow={setNewPromoFlow}
                        renderEmptyState={renderEmptyState}
                    />
                )}
                {currentView === 'branding' && !isSuperAdmin && <BrandingView currentClient={currentClient} setClients={setClients} />}
                {currentView === 'qr-gen' && <QrGenView availablePods={isSuperAdmin ? pods : visiblePods} availableLocations={isSuperAdmin ? locations : (locations || []).filter(l => l?.clientId === activePersona)} />}
            </div>
        </div>
    );
}
