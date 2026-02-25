import React from 'react';
import { Play, Calendar, Coffee } from 'lucide-react';

export const CheckoutFlow = ({
    currentStep,
    setCurrentStep,
    activePod,
    activeClient,
    theme,
    bookingType,
    setBookingType,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    selectedNap,
    setSelectedNap,
    appliedPromo,
    setAppliedPromo,
    promoInput,
    setPromoInput,
    promoError,
    setPromoError,
    handleNapSelection,
    handleApplyPromo,
    handlePayment
}) => {
    if (currentStep === '3a') {
        const allowAdvance = activePod?.overrides?.allowAdvanceBooking !== false;

        return (
            <div className="flex flex-col h-full animate-fade-in bg-slate-50">
                <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 relative z-10 sticky top-0">
                    <button onClick={() => setCurrentStep(2)} className="absolute left-6 top-12 text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back
                    </button>
                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: theme.color }}>{theme.name}</p>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Type</h2>
                    </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                    <button
                        onClick={() => { setBookingType('instant'); setCurrentStep(3); }}
                        className="w-full bg-white p-6 rounded-3xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group text-left"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                <Play className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Start Now</h3>
                        </div>
                        <p className="text-slate-500 text-sm ml-16">Enter the pod immediately. Subject to current availability.</p>
                    </button>

                    <button
                        disabled={!allowAdvance}
                        onClick={() => { setBookingType('scheduled'); setCurrentStep('3b'); }}
                        className={`w-full bg-white p-6 rounded-3xl border-2 transition-all group text-left ${allowAdvance ? 'border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10' : 'border-slate-100 opacity-60 cursor-not-allowed'}`}
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${allowAdvance ? 'bg-emerald-50 group-hover:bg-emerald-500' : 'bg-slate-100'}`}>
                                <Calendar className={`w-6 h-6 transition-colors ${allowAdvance ? 'text-emerald-500 group-hover:text-white' : 'text-slate-400'}`} />
                            </div>
                            <h3 className={`text-xl font-bold ${allowAdvance ? 'text-slate-900' : 'text-slate-500'}`}>Reserve for Later</h3>
                        </div>
                        <p className="text-slate-500 text-sm ml-16">
                            {allowAdvance ? 'Schedule a future time slot. Guaranteed access.' : 'Advance reservations are disabled for this unit.'}
                        </p>
                    </button>
                </div>
            </div>
        );
    }

    if (currentStep === '3b') {
        return (
            <div className="flex flex-col h-full animate-fade-in bg-slate-50">
                <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 relative z-10 sticky top-0">
                    <button onClick={() => setCurrentStep('3a')} className="absolute left-6 top-12 text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back
                    </button>
                    <div className="mt-8">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pick a Time</h2>
                        <p className="text-sm text-slate-500 mt-1">Reserve this slot in advance.</p>
                    </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Date</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-lg font-medium shadow-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Time</label>
                            <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-lg font-medium shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    <button
                        disabled={!scheduledDate || !scheduledTime}
                        onClick={() => setCurrentStep(3)}
                        className="w-full py-4 mt-8 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:active:scale-100"
                    >
                        Continue to Duration
                    </button>
                </div>
            </div>
        );
    }

    if (currentStep === 3) {
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
    }

    if (currentStep === 4) {
        return (
            <div className="flex flex-col h-full animate-fade-in bg-slate-50">
                <div className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 relative z-10">
                    <button onClick={() => setCurrentStep(3)} className="absolute left-6 top-12 text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900 text-center tracking-tight mt-10">Checkout</h2>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Order Summary</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-slate-700 font-medium">{selectedNap?.durationMinutes} Minute Session</span>
                                <span className="font-semibold text-slate-900">${selectedNap?.originalPrice}</span>
                            </div>

                            {appliedPromo && (
                                <div className="flex justify-between items-center mb-3 text-emerald-600">
                                    <span className="font-medium text-sm">Promo: {appliedPromo.code}</span>
                                    <span className="font-semibold text-sm">
                                        -{appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}%` : `$${appliedPromo.discountValue}`}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="text-2xl font-bold" style={{ color: theme.color }}>${selectedNap?.effectivePrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Promo Code Input */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Promo Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={promoInput}
                                    onChange={e => setPromoInput(e.target.value)}
                                    disabled={appliedPromo !== null}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none uppercase font-mono text-sm disabled:bg-slate-50 disabled:text-slate-500"
                                />
                                {appliedPromo ? (
                                    <button
                                        onClick={() => { setAppliedPromo(null); setPromoInput(''); setSelectedNap(prev => ({ ...prev, effectivePrice: prev.originalPrice })); }}
                                        className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium text-sm hover:bg-slate-200"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyPromo}
                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:opacity-90"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>
                            {promoError && <p className="text-red-500 text-xs mt-2 font-medium">{promoError}</p>}
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 opacity-60">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Payment Method</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-400">VISA</div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">•••• •••• •••• 4242</p>
                                    <p className="text-xs text-slate-400">Expires 12/28</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handlePayment}
                            style={{ backgroundColor: theme.color }}
                            className="w-full py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                        >
                            {selectedNap?.effectivePrice === 0 ? 'Start Free Session' : `Pay $${selectedNap?.effectivePrice.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
