import React, { useState, useEffect } from 'react';
import { Play, Coffee, Clock, ShieldAlert, Wifi, Battery, MapPin, CheckCircle, Lock, Calendar, ArrowRight, UserCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initialClients, initialPods, initialLocations, initialPromotions } from './data/mockAdminData';
import { useGlobalSession } from './context/GlobalSessionContext';
import { UserHeader } from './components/user/layout/UserHeader';
import { LandingView } from './components/user/landing/LandingView';
import { CheckoutFlow } from './components/user/checkout/CheckoutFlow';
import { ActiveSessionView } from './components/user/session/ActiveSessionView';
import { ConfirmationView } from './components/user/session/ConfirmationView';
import { UserProfileOverlay } from './components/user/profile/UserProfileOverlay';

// --- Shared Helper for Theme Resolution ---
const resolveThemeProps = (client) => {
    if (!client) return { color: "#3b82f6", name: "Urban Naps", isCustom: false };
    if (client.brandingType === "custom" && client.customTheme) {
        return { color: client.customTheme, name: client.name, isCustom: true };
    }
    return { color: "#4f46e5", name: "Urban Naps", isCustom: false };
};

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Derived state from URL parameters
    const scanLocId = searchParams.get('locationId');
    const scanPodId = searchParams.get('podId');

    // 1: Scan/Location List, 2: Login, 3: Nap Selection, 4: Payment, 5: Session
    const [currentStep, setCurrentStep] = useState(1);
    const [showProfile, setShowProfile] = useState(false);

    // Core Data
    const [activeClient, setActiveClient] = useState(null);
    const [activeLocation, setActiveLocation] = useState(null);
    const [activePod, setActivePod] = useState(null);

    // Session Data
    // Session Data
    const { activeSessions, addSession, terminateSession, upcomingBookings, addBooking, pastSessions = [] } = useGlobalSession();
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [selectedNap, setSelectedNap] = useState(null);
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPodOpen, setIsPodOpen] = useState(false);

    // Booking Type Data
    const [bookingType, setBookingType] = useState('instant'); // 'instant' or 'scheduled'
    const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
    const [scheduledTime, setScheduledTime] = useState('');

    // Promo Data
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

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

                setCurrentStep(requiresLogin ? 2 : '3a');
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

    // Global Timer Sync Effect
    useEffect(() => {
        if (currentStep === 5 && currentSessionId) {
            const session = activeSessions.find(s => s.id === currentSessionId);
            if (session) {
                // Sync local UI timer with global state block
                setTimeLeft(session.timeLeft);
            } else {
                // The session was terminated remotely or naturally ended
                endSessionUIOnly();
            }
        }
    }, [activeSessions, currentStep, currentSessionId]);

    const endSessionUIOnly = () => {
        setCurrentStep(1);
        setActivePod(null);
        setSelectedNap(null);
        setEmail('');
        setTimeLeft(0);
        setIsPodOpen(false);
        setCurrentSessionId(null);
        setAppliedPromo(null);
        setPromoInput('');
        setBookingType('instant');
        setScheduledTime('');

        // If we came from a direct pod scan, we shouldn't go back to the location list.
        // Cleanly wipe the hash routing state for SPAs.
        if (scanPodId || scanLocId) {
            navigate('/', { replace: true });
        }
    };


    // Handlers
    const handlePodSelect = (pod) => {
        setActivePod(pod);
        const client = initialClients.find(c => c.id === pod.clientId) || activeClient;
        setActiveClient(client);

        const requiresLogin = pod.overrides.requiresEmailLogin !== null
            ? pod.overrides.requiresEmailLogin
            : client?.defaultRequiresEmailLogin;

        setCurrentStep(requiresLogin ? 2 : '3a');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setCurrentStep('3a');
    };

    const handleNapSelection = (nap) => {
        const isPaid = activePod.overrides.isPaid !== null
            ? activePod.overrides.isPaid
            : activeClient?.defaultIsPaid;

        const effectivePrice = isPaid ? nap.price : 0;
        const resolvedNap = { ...nap, effectivePrice, originalPrice: effectivePrice };

        setSelectedNap(resolvedNap);
        setAppliedPromo(null); // Reset any previous promo
        setPromoInput('');
        setPromoError('');

        if (effectivePrice > 0) {
            setCurrentStep(4);
        } else {
            finalizeBooking(resolvedNap);
        }
    };

    const handleApplyPromo = () => {
        setPromoError('');
        if (!promoInput.trim()) return;

        // Find a matching active promo for this specific client or a universal one
        const promo = initialPromotions.find(p =>
            p.active &&
            p.code === promoInput.toUpperCase() &&
            p.clientId === activeClient?.id
        );

        if (!promo) {
            setPromoError('Invalid or expired promo code.');
            return;
        }

        // Advanced Coupon Engine Validations
        const today = new Date().toISOString().split('T')[0];

        // 1. Check Date Validity
        if (promo.startDate && today < promo.startDate) {
            setPromoError('This promo code is not active yet.');
            return;
        }
        if (promo.endDate && today > promo.endDate) {
            setPromoError('This promo code has expired.');
            return;
        }

        // 2. Check Usage Limits
        if (promo.maxUses > 0 && promo.currentUses >= promo.maxUses) {
            setPromoError('This promo code has reached its redemption limit.');
            return;
        }

        // 3. Check Minimum Spend Threshold
        if (promo.minimumSpend > 0 && selectedNap.originalPrice < promo.minimumSpend) {
            setPromoError(`This code requires a minimum spend of $${promo.minimumSpend.toFixed(2)}.`);
            return;
        }

        // Calculate new price
        let newPrice = selectedNap.originalPrice;
        if (promo.discountType === 'percentage') {
            newPrice = newPrice - (newPrice * (promo.discountValue / 100));
        } else if (promo.discountType === 'fixed') {
            newPrice = Math.max(0, newPrice - promo.discountValue);
        }

        setAppliedPromo(promo);
        setSelectedNap(prev => ({ ...prev, effectivePrice: newPrice }));
    };

    const handlePayment = () => {
        // Simulate payment processing
        setTimeout(() => {
            finalizeBooking(selectedNap);
        }, 800);
    };

    const finalizeBooking = (nap) => {
        if (bookingType === 'scheduled') {
            const combinedDateTime = `${scheduledDate}T${scheduledTime}:00Z`; // simplified UTC
            const newBooking = {
                podId: activePod?.id,
                clientId: activeClient?.id,
                durationMinutes: nap.durationMinutes,
                scheduledTime: combinedDateTime,
                email: email
            };
            addBooking(newBooking);
            setCurrentStep(6); // Confirmation screen
        } else {
            startSession(nap);
        }
    };

    const startSession = (nap) => {
        // Record into global state
        const generatedSessionId = `session-${Date.now()}`;
        addSession({
            id: generatedSessionId,
            podId: activePod?.id,
            clientId: activeClient?.id,
            durationMinutes: nap.durationMinutes,
            startTime: new Date().toISOString()
        });

        setCurrentSessionId(generatedSessionId);
        setTimeLeft(nap.durationMinutes * 60);
        setCurrentStep(5);
        setIsPodOpen(false); // Reset pod open state
    };

    const endSession = () => {
        if (currentSessionId) {
            terminateSession(currentSessionId);
        }
        endSessionUIOnly();
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

    // LandingView handles Step 1 & 2

    // CheckoutFlow handles Steps 3a, 3b, 3, 4

    // ActiveSessionView handles Step 5
    // ConfirmationView handles Step 6
    // UserProfileOverlay handles Profile View

    return (
        <div className="h-screen w-full bg-slate-100 flex items-center justify-center font-sans sm:p-4">
            <div className="w-full h-full sm:max-w-[390px] sm:max-h-[844px] bg-slate-100 sm:rounded-[3rem] overflow-hidden relative shadow-2xl sm:border-[8px] border-slate-800">
                <UserHeader currentStep={currentStep} showProfile={showProfile} setShowProfile={setShowProfile} />

                {/* Main Content Area */}
                <div className="h-full w-full bg-white overflow-hidden relative">
                    {showProfile ? (
                        <UserProfileOverlay
                            upcomingBookings={upcomingBookings}
                            pastSessions={pastSessions}
                            email={email}
                            initialPods={initialPods}
                            initialLocations={initialLocations}
                        />
                    ) : (
                        <>
                            {(currentStep === 1 || currentStep === 2) && (
                                <LandingView
                                    currentStep={currentStep}
                                    activeLocation={activeLocation}
                                    activeClient={activeClient}
                                    activePod={activePod}
                                    initialPods={initialPods}
                                    initialLocations={initialLocations}
                                    theme={theme}
                                    upcomingBookings={upcomingBookings}
                                    handlePodSelect={handlePodSelect}
                                    handleLogin={handleLogin}
                                    email={email}
                                    setEmail={setEmail}
                                    setSearchParams={setSearchParams}
                                />
                            )}
                            {['3a', '3b', 3, 4].includes(currentStep) && (
                                <CheckoutFlow
                                    currentStep={currentStep}
                                    setCurrentStep={setCurrentStep}
                                    activePod={activePod}
                                    activeClient={activeClient}
                                    theme={theme}
                                    bookingType={bookingType}
                                    setBookingType={setBookingType}
                                    scheduledDate={scheduledDate}
                                    setScheduledDate={setScheduledDate}
                                    scheduledTime={scheduledTime}
                                    setScheduledTime={setScheduledTime}
                                    selectedNap={selectedNap}
                                    setSelectedNap={setSelectedNap}
                                    appliedPromo={appliedPromo}
                                    setAppliedPromo={setAppliedPromo}
                                    promoInput={promoInput}
                                    setPromoInput={setPromoInput}
                                    promoError={promoError}
                                    setPromoError={setPromoError}
                                    handleNapSelection={handleNapSelection}
                                    handleApplyPromo={handleApplyPromo}
                                    handlePayment={handlePayment}
                                />
                            )}
                            {currentStep === 5 && (
                                <ActiveSessionView
                                    isPodOpen={isPodOpen}
                                    setIsPodOpen={setIsPodOpen}
                                    theme={theme}
                                    activePod={activePod}
                                    timeLeft={timeLeft}
                                    formatTime={formatTime}
                                    endSession={endSession}
                                />
                            )}
                        </>
                    )}
                    {currentStep === 6 && (
                        <ConfirmationView
                            scheduledDate={scheduledDate}
                            scheduledTime={scheduledTime}
                            theme={theme}
                            activePod={activePod}
                            activeLocation={activeLocation}
                            endSessionUIOnly={endSessionUIOnly}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
