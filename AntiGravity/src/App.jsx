import React, { useState, useEffect } from 'react';
import { Play, Coffee, Clock, ShieldAlert, Wifi, Battery, MapPin, CheckCircle, Lock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { initialClients, initialPods, initialLocations } from './data/mockAdminData';

// --- Shared Helper for Theme Resolution ---
export const resolveThemeProps = (client) => {
    if (!client) return { color: "#3b82f6", name: "Urban Naps", isCustom: false };
    if (client.brandingType === "custom" && client.customTheme) {
        return { color: client.customTheme, name: client.name, isCustom: true };
    }
    return { color: "#4f46e5", name: "Urban Naps", isCustom: false };
};

export default function App() {
    const [searchParams] = useSearchParams();

    // Derived state from URL parameters
    const scanLocId = searchParams.get('locationId');
    const scanPodId = searchParams.get('podId');

    // 1: Scan/Location List, 2: Login, 3: Nap Selection, 4: Payment, 5: Session
    const [currentStep, setCurrentStep] = useState(1);

    // Core Data
    const [activeClient, setActiveClient] = useState(null);
    const [activeLocation, setActiveLocation] = useState(null);
    const [activePod, setActivePod] = useState(null);

    // Session Data
    const [selectedNap, setSelectedNap] = useState(null);
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPodOpen, setIsPodOpen] = useState(false);

    // Initial Routing Logic
    useEffect(() => {
        if (scanPodId) {
            // Direct Pod Scan
            const pod = initialPods.find(p => p.id === scanPodId);
            if (pod) {
                const client = initialClients.find(c => c.id === pod.clientId);
                setActivePod(pod);
                setActiveClient(client);

                // Determine next step based on overrides or defaults
                const requiresLogin = pod.overrides.requiresEmailLogin !== null
                    ? pod.overrides.requiresEmailLogin
                    : client?.defaultRequiresEmailLogin;

                setCurrentStep(requiresLogin ? 2 : 3);
            }
        } else if (scanLocId) {
            // Location Scan
            const loc = initialLocations.find(l => l.id === scanLocId);
            if (loc) {
                const client = initialClients.find(c => c.id === loc.clientId);
                setActiveLocation(loc);
                setActiveClient(client);
                setCurrentStep(1); // Stay on step 1 to show the list
            }
        }
    }, [scanLocId, scanPodId]);

    // Timer effect
    useEffect(() => {
        if (currentStep === 5 && isPodOpen && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else if (timeLeft === 0 && currentStep === 5 && isPodOpen) {
            endSession(); // Auto-end when time runs out
        }
    }, [timeLeft, currentStep, isPodOpen]);


    // Handlers
    const handlePodSelect = (pod) => {
        setActivePod(pod);
        const client = initialClients.find(c => c.id === pod.clientId) || activeClient;
        setActiveClient(client);

        const requiresLogin = pod.overrides.requiresEmailLogin !== null
            ? pod.overrides.requiresEmailLogin
            : client?.defaultRequiresEmailLogin;

        setCurrentStep(requiresLogin ? 2 : 3);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setCurrentStep(3);
    };

    const handleNapSelection = (nap) => {
        const isPaid = activePod.overrides.isPaid !== null
            ? activePod.overrides.isPaid
            : activeClient?.defaultIsPaid;

        const effectivePrice = isPaid ? nap.price : 0;
        const resolvedNap = { ...nap, effectivePrice };

        setSelectedNap(resolvedNap);

        if (effectivePrice > 0) {
            setCurrentStep(4);
        } else {
            startSession(resolvedNap);
        }
    };

    const handlePayment = () => {
        // Simulate payment processing
        setTimeout(() => {
            startSession(selectedNap);
        }, 800);
    };

    const startSession = (nap) => {
        setTimeLeft(nap.durationMinutes * 60);
        setCurrentStep(5);
        setIsPodOpen(false); // Reset pod open state
    };

    const endSession = () => {
        setCurrentStep(1);
        setActivePod(null);
        setSelectedNap(null);
        setEmail('');
        setTimeLeft(0);
        setIsPodOpen(false);

        // If we came from a direct pod scan, we shouldn't go back to the location list.
        // For prototype purposes, we'll reset the URL if they end the session.
        if (scanPodId) {
            window.location.href = '/';
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const theme = resolveThemeProps(activeClient);

    // --- Renders ---

    // Step 1: Location Scanned (List Pods) or Generic No-QR screen
    const renderStep1 = () => {
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
            <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in bg-slate-900 text-center">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Urban Naps</h1>
                <p className="text-slate-400 mb-10 max-w-xs text-sm leading-relaxed">
                    Please scan a QR code located on a pod or within a partner lounge to begin your session.
                </p>
                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-sm">
                    <p className="text-xs text-slate-500 font-mono text-left mb-2 uppercase tracking-widest">Simulator Shortcuts (Admin Test):</p>
                    <div className="space-y-2">
                        <button onClick={() => window.location.href = '/?locationId=loc-2'} className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">Test Acme Location (loc-2)</button>
                        <button onClick={() => window.location.href = '/?podId=pod-101'} className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">Test Direct Pod (pod-101)</button>
                    </div>
                </div>
            </div>
        );
    };

    // Step 2: Email Login (Tenant Enforced)
    const renderStep2 = () => (
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

    // Step 3: Nap Selection
    const renderStep3 = () => {
        const isPaid = activePod?.overrides?.isPaid !== null
            ? activePod?.overrides?.isPaid
            : activeClient?.defaultIsPaid;

        // Sort nap options by duration so they are logical
        const sortedOptions = [...(activePod?.napOptions || [])].sort((a, b) => a.durationMinutes - b.durationMinutes);

        return (
            <div className="flex flex-col h-full animate-fade-in bg-slate-50">
                <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 z-10 sticky top-0">
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: theme.color }}>{theme.name}</p>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Select Duration</h2>
                </div>

                <div className="p-6 flex-1 space-y-4 overflow-y-auto">
                    {sortedOptions.length === 0 ? (
                        <p className="text-center text-slate-500 p-8">No configurations available for this unit.</p>
                    ) : (
                        sortedOptions.map((nap, idx) => {
                            const displayPrice = isPaid ? nap.price : 0;
                            const isSelected = selectedNap && selectedNap.durationMinutes === nap.durationMinutes;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleNapSelection(nap)}
                                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${isSelected ? 'bg-white shadow-sm ring-4 ring-indigo-50/50' : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'}`}
                                    style={isSelected ? { borderColor: theme.color } : {}}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-80" style={{ backgroundColor: `${theme.color}15` }}>
                                                <Coffee className="w-5 h-5" style={{ color: theme.color }} />
                                            </div>
                                            <span className="text-xl font-semibold text-slate-800 tracking-tight">{nap.durationMinutes} <span className="text-sm text-slate-500 font-medium">mins</span></span>
                                        </div>
                                        <span className="font-bold text-lg" style={{ color: isSelected ? theme.color : '#64748b' }}>
                                            {displayPrice === 0 ? "Included" : `$${displayPrice}`}
                                        </span>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        );
    };

    // Step 4: Payment (Simulated)
    const renderStep4 = () => (
        <div className="flex flex-col h-full animate-fade-in bg-white">
            <div className="px-6 pt-12 pb-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900">Checkout</h2>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 font-medium">Session</span>
                        <span className="text-slate-900 font-bold">{selectedNap?.durationMinutes} mins</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <span className="text-slate-900 font-semibold">Total</span>
                        <span className="text-2xl font-bold" style={{ color: theme.color }}>${selectedNap?.effectivePrice}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-auto">
                    <button onClick={handlePayment} className="w-full py-4 rounded-xl border-2 border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        Pay with Apple Pay
                    </button>
                    <button onClick={handlePayment} className="w-full py-4 rounded-xl border-2 border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors font-medium text-slate-700">
                        Pay with Card
                    </button>
                </div>

                <div className="pt-6">
                    <button onClick={() => setCurrentStep(3)} className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    // Step 5: Active Session Loop
    const renderStep5 = () => {
        if (!isPodOpen) {
            return (
                <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in text-center relative bg-slate-50">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 bg-white shadow-xl shadow-black/5">
                        <Lock className="w-10 h-10" style={{ color: theme.color }} />
                    </div>

                    <h2 className="text-3xl font-semibold text-slate-800 mb-2 tracking-tight">Ready to Start</h2>
                    <p className="text-slate-500 mb-12 text-sm max-w-[240px] leading-relaxed">Tap the button below to unlock your {activePod?.type} and begin your session.</p>

                    <div className="p-6 pb-8 absolute bottom-0 w-full left-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                        <button
                            onClick={() => setIsPodOpen(true)}
                            style={{ backgroundColor: theme.color }}
                            className="w-full py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                        >
                            Open Pod
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in text-center relative bg-slate-50">

                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative bg-white shadow-xl shadow-black/5">
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: theme.color }}></div>
                    <CheckCircle className="w-12 h-12" style={{ color: theme.color }} />
                </div>

                <h2 className="text-3xl font-semibold text-slate-800 mb-2 tracking-tight">Pod Unlocked</h2>
                <p className="text-slate-500 mb-12 text-sm leading-relaxed">Your session at <span className="font-medium text-slate-700">{theme.name}</span> has started.</p>

                <div className="text-7xl font-bold tabular-nums tracking-tighter text-slate-800 mb-3 drop-shadow-sm font-mono">
                    {formatTime(timeLeft)}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Remaining</p>

                <div className="p-6 pb-8 absolute bottom-0 w-full left-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                    <button
                        onClick={endSession}
                        className="w-full py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
                    >
                        End Session
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen w-full bg-slate-100 flex items-center justify-center font-sans sm:p-4">
            <div className="w-full h-full sm:max-w-[390px] sm:max-h-[844px] bg-slate-100 sm:rounded-[3rem] overflow-hidden relative shadow-2xl sm:border-[8px] border-slate-800">
                {/* Status Bar simulation (Top) */}
                <div className="absolute top-0 w-full h-12 z-50 flex justify-between items-center px-6 pointer-events-none">
                    <span className="text-xs font-medium" style={{ color: currentStep === 1 ? 'transparent' : 'inherit' }}>9:41</span>
                    <div className="flex items-center gap-1.5" style={{ color: currentStep === 1 ? 'transparent' : 'inherit' }}>
                        <Wifi className="w-4 h-4" />
                        <Battery className="w-4 h-4" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="h-full w-full bg-white overflow-hidden relative">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                </div>
            </div>
        </div>
    );
}
