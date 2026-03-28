import React from 'react';
import { Plus, ShieldAlert, Users, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { initialPods, initialLocations } from '../../../data/mockAdminData';

export const PodsBrowser = ({
    isSuperAdmin,
    showAddForm,
    setShowAddForm,
    handleAddPod,
    newPodFlow,
    setNewPodFlow,
    clients,
    locations,
    visiblePods,
    activeSessions,
    terminateSession,
    setEditingPod,
    renderEmptyState,
    upcomingBookings
}) => (
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
                        <label className="block text-xs font-medium text-slate-500 mb-1 text-indigo-600 font-bold">IoT Thing Name (Must match AWS)</label>
                        <input
                            required type="text" placeholder="e.g. pod_alpha_01"
                            value={newPodFlow.thingName} onChange={e => setNewPodFlow({ ...newPodFlow, thingName: e.target.value })}
                            className="w-full px-3 py-2 border border-indigo-200 bg-indigo-50/30 rounded-lg outline-none focus:border-indigo-500 text-sm font-mono"
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
                            onChange={e => setNewPodFlow({ ...newPodFlow, clientId: e.target.value, locationId: "" })}
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
                    const liveSession = activeSessions.find(s => s.podId === pod.id);

                    return (
                        <div key={pod.id} className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            {liveSession && (
                                <div className="absolute inset-0 bg-slate-900/95 z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 relative">
                                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-1 tracking-tight">Session Active</h4>
                                    <div className="text-4xl text-emerald-400 font-mono font-bold tracking-tighter mb-6 drop-shadow-md">
                                        {Math.floor(liveSession.timeLeft / 60)}:{(liveSession.timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                    <button
                                        onClick={() => terminateSession(liveSession.id)}
                                        className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all"
                                    >
                                        Force Terminate
                                    </button>
                                </div>
                            )}

                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">{pod.name}</h3>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{pod.type}</span>
                                </div>
                                <p className="text-xs text-slate-400 flex items-center gap-1 font-mono tracking-tighter mb-2">{pod.id}</p>
                                <p className="text-sm text-indigo-600 flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4" />{locationName}</p>
                            </div>

                            <div className="p-6 flex-1 space-y-5">
                                {isSuperAdmin && (
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Users className="w-4 h-4 text-slate-400" /> {clientName}
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nap Config</p>
                                    {pod.napOptions.length === 0 ? (
                                        <p className="text-sm text-amber-600 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Not Configured</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {pod.napOptions.map((opt, i) => (
                                                <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200">
                                                    {opt.durationMinutes}m / ${opt.price}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                                <button
                                    onClick={() => setEditingPod(pod)}
                                    className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 py-2.5 rounded-xl transition-colors"
                                >
                                    Configure Unit
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}

        {upcomingBookings.length > 0 && (
            <div className="mt-12">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" /> Upcoming Reservations
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="py-4 px-6 font-medium">Date & Time</th>
                                <th className="py-4 px-6 font-medium">User Email</th>
                                <th className="py-4 px-6 font-medium">Pod Assignment</th>
                                <th className="py-4 px-6 font-medium">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {upcomingBookings.map(booking => {
                                const pod = initialPods.find(p => p.id === booking.podId);
                                const loc = initialLocations.find(l => l.id === pod?.locationId);
                                const dateObj = new Date(booking.scheduledTime);
                                const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                                const formattedTime = dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

                                return (
                                    <tr key={booking.id} className="hover:bg-slate-50/50">
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-slate-900">{formattedDate}</div>
                                            <div className="text-sm font-medium text-indigo-600">{formattedTime}</div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-slate-700">{booking.email || 'N/A'}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-slate-900">{pod?.name || 'Unknown Pod'}</div>
                                            <div className="text-xs text-slate-500">{loc?.name}</div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-slate-800">{booking.durationMinutes} mins</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);
