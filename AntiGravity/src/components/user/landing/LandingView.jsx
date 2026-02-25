import React from 'react';
import { Play, Battery, Wifi, MapPin, Calendar } from 'lucide-react';

export const LandingView = ({
    currentStep,
    activeLocation,
    activeClient,
    activePod,
    initialPods,
    initialLocations,
    theme,
    upcomingBookings,
    handlePodSelect,
    handleLogin,
    email,
    setEmail,
    setSearchParams
}) => {
    if (currentStep === 1) {
        if (activeLocation && activeClient) {
            // Show units specifically at this location
            const locPods = initialPods.filter(p => p.locationId === activeLocation.id);

            return (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="px-6 pt-12 pb-6" style={{ backgroundColor: theme.color }}>
                        <h1 className="text-3xl font-bold text-white mb-2">{theme.name}</h1>
                        <p className="text-white/80 flex items-center gap-1 opacity-90 text-sm">
                            <MapPin className="w-4 h-4" /> {activeLocation.name}
                        </p>
                    </div>

                    <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Available Units Here</h2>

                        {locPods.length === 0 ? (
                            <p className="text-slate-500 text-sm p-4 bg-white rounded-xl border border-slate-200 text-center">No pods currently online at this location.</p>
                        ) : (
                            <div className="space-y-4">
                                {locPods.map(pod => (
                                    <button
                                        key={pod.id}
                                        onClick={() => handlePodSelect(pod)}
                                        className="w-full text-left bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900">{pod.name}</h3>
                                            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{pod.type}</span>
                                        </div>
                                        <div className="flex gap-4 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-500" /> 100%</span>
                                            <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-indigo-500" /> Online</span>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center w-full">
                                            <span className="text-sm font-medium" style={{ color: theme.color }}>Select Unit →</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Generic Start Screen (No QR scanned or invalid)
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in bg-slate-900 text-center overflow-y-auto pt-12">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 shrink-0">
                    <MapPin className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight shrink-0">Urban Naps</h1>
                <p className="text-slate-400 mb-8 max-w-xs text-sm leading-relaxed shrink-0">
                    Please scan a QR code located on a pod or within a partner lounge to begin your session.
                </p>

                {upcomingBookings.length > 0 && (
                    <div className="w-full max-w-sm mb-8 text-left shrink-0">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 ml-2 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Your Upcoming Naps
                        </h3>
                        <div className="space-y-3">
                            {upcomingBookings.map(booking => {
                                const pod = initialPods.find(p => p.id === booking.podId);
                                const loc = initialLocations.find(l => l.id === pod?.locationId);
                                const dateObj = new Date(booking.scheduledTime);
                                return (
                                    <div key={booking.id} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20">
                                        <div>
                                            <p className="font-semibold text-white text-lg">{dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{dateObj.toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-emerald-400 text-sm">{pod?.name}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{loc?.name}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-sm shrink-0 mb-8">
                    <p className="text-xs text-slate-500 font-mono text-left mb-2 uppercase tracking-widest">Simulator Shortcuts (Admin Test):</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {initialLocations.map(loc => (
                            <button key={loc.id} onClick={() => setSearchParams({ locationId: loc.id })} className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                                <MapPin className="w-3 h-3 inline-block mr-1.5 opacity-60" />
                                {loc.name} <span className="text-slate-500">({loc.id})</span>
                            </button>
                        ))}
                        {initialPods.map(pod => (
                            <button key={pod.id} onClick={() => setSearchParams({ podId: pod.id })} className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                                <Play className="w-3 h-3 inline-block mr-1.5 opacity-60" />
                                {pod.name} <span className="text-slate-500">({pod.id})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (currentStep === 2) {
        return (
            <div className="flex flex-col h-full animate-fade-in bg-white">
                <div className="px-6 pt-12 pb-6 border-b border-slate-100 flex justify-between items-center">
                    <h1 className="text-xl font-bold" style={{ color: theme.color }}>{theme.name}</h1>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{activePod?.type}</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Member Access</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">Please verify your email to access the complimentary amenities provided by your host.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl text-white font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all"
                            style={{ backgroundColor: theme.color }}
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};
