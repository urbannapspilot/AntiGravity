import React, { useState, useEffect } from 'react';
import { 
    Play, Calendar, Coffee, ArrowLeft, ChevronRight, CheckCircle2, Clock,
    Ear, MessageSquare, Wind, Lightbulb, UserCheck, Users, Plus, Minus
} from 'lucide-react';

export const CheckoutFlow = ({
    currentStep,
    setCurrentStep,
    activePod,
    activeLocation,
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
    // Local state for slot picker
    const [selectedDurationIndex, setSelectedDurationIndex] = useState(0);
    const [timeTab, setTimeTab] = useState('midnight'); // 'midnight' or 'noon'
    
    const sortedOptions = activePod && activePod.napOptions 
        ? [...activePod.napOptions].sort((a, b) => a.durationMinutes - b.durationMinutes) 
        : [];
        
    useEffect(() => {
        if (sortedOptions.length > 0 && !selectedNap) {
            setSelectedNap(sortedOptions[0]);
        }
    }, [sortedOptions, selectedNap, setSelectedNap]);

    // Handle initial date
    useEffect(() => {
        if (!scheduledDate) {
            setScheduledDate(new Date().toISOString().split('T')[0]);
        }
    }, [scheduledDate, setScheduledDate]);

    if (currentStep === '3a') {
        // --- PREMIUM POD DETAILS VIEW ---
        const lowestPrice = sortedOptions.length > 0 ? sortedOptions[0].price : 0;
        const lowestMins = sortedOptions.length > 0 ? sortedOptions[0].durationMinutes : 0;

        const isPaid = activePod?.overrides?.isPaid !== null
            ? activePod?.overrides?.isPaid
            : activeClient?.defaultIsPaid;

        return (
            <div className="flex flex-col h-full animate-fade-in bg-white">
                {/* Header Navbar */}
                <div className="px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-20">
                    <button onClick={() => setCurrentStep(2)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-800" />
                    </button>
                    <span className="font-bold text-slate-900 tracking-tight" style={{ color: theme.color }}>{theme.name}</span>
                    <div className="w-10"></div> {/* Spacer for symmetry */}
                </div>

                <div className="flex-1 overflow-y-auto pb-28">
                    {/* Hero Image (Abstract Block) */}
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-slate-100 to-transparent"></div>
                        <div className="w-24 h-24 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white z-10">
                             <div className="w-16 h-16 border border-slate-700 bg-slate-800 rounded-xl relative overflow-hidden">
                                 <div className="absolute bottom-0 w-full h-1/3 bg-slate-700"></div>
                             </div>
                        </div>
                    </div>

                    <div className="px-6 pt-6 pb-2">
                        <div className="flex justify-between items-start mb-2">
                             <span className="bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
                                 {activePod?.id.toUpperCase()}
                             </span>
                             <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded text-emerald-600 text-[10px] font-bold tracking-widest uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                Online
                             </div>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{activePod?.name} | {activeLocation?.name || 'Partner Location'}</h1>
                        
                        <div className="mt-4 flex items-end gap-1">
                             <span className="text-2xl font-extrabold text-slate-900">
                                {isPaid ? `$${lowestPrice}` : 'Free'}
                             </span>
                             {isPaid && <span className="text-sm font-semibold text-slate-500 mb-1 line-through ml-1">${Math.round(lowestPrice * 1.5)}</span>}
                             <span className="text-sm font-medium text-slate-500 mb-1 ml-1"> / {lowestMins} min</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Taxes and additional optional fees may apply.</p>
                    </div>

                    <div className="h-px bg-slate-100 mx-6 my-4"></div>

                    {/* Features List */}
                    <div className="px-6 space-y-4">
                        <div className="flex gap-4 items-start">
                            <Wind className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Silent ventilation</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Quiet fans continuously exchange air inside the capsule.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <Ear className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Acoustics</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Sound insulating materials reduce external noise significantly.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <UserCheck className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Occupancy indicator</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Smart sensors detect internal presence automatically.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <Lightbulb className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Ambient lighting</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Adjustable zero-glare soft lighting for relaxation.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Speech intelligibility</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Engineered to keep conversations private and contained.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 items-start">
                            <Users className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Capacity</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Designed comfortably for 1 person + cabin baggage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Bottom Action */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 sm:max-w-[390px] sm:mx-auto pb-8 sm:pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-20">
                    <button
                        onClick={() => setCurrentStep('3b')}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all"
                        style={{ backgroundColor: theme.color }}
                    >
                        Pick your slot
                    </button>
                </div>
            </div>
        );
    }

    if (currentStep === '3b') {
        const handleMinus = () => {
            if (selectedDurationIndex > 0) {
                const newIdx = selectedDurationIndex - 1;
                setSelectedDurationIndex(newIdx);
                setSelectedNap(sortedOptions[newIdx]);
            }
        };

        const handlePlus = () => {
            if (selectedDurationIndex < sortedOptions.length - 1) {
                const newIdx = selectedDurationIndex + 1;
                setSelectedDurationIndex(newIdx);
                setSelectedNap(sortedOptions[newIdx]);
            }
        };

        const currentDuration = sortedOptions[selectedDurationIndex]?.durationMinutes || 0;
        const hr = Math.floor(currentDuration / 60);
        const min = currentDuration % 60;
        const durationDisplay = `${hr} hr, ${min} min`;

        const isPaid = activePod?.overrides?.isPaid !== null
            ? activePod?.overrides?.isPaid
            : activeClient?.defaultIsPaid;
            
        const priceToDisplay = isPaid ? (sortedOptions[selectedDurationIndex]?.price || 0) : 0;

        // Generate Dates for mock
        const dates = [];
        const today = new Date();
        for(let i=0; i<7; i++) {
             const d = new Date(today);
             d.setDate(d.getDate() + i);
             dates.push({
                 iso: d.toISOString().split('T')[0],
                 day: d.getDate(),
                 weekday: d.toLocaleDateString('en-US', { weekday: 'short'}).toUpperCase(),
                 month: d.toLocaleDateString('en-US', { month: 'short'}).toUpperCase()
             });
        }
        
        // Generate Times
        const times = timeTab === 'midnight' 
            ? ['12:00 am', '1:00 am', '2:00 am', '3:00 am', '4:00 am', '5:00 am', '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am']
            : ['12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'];

        // Mocking some unvailable times (every 3rd slot disabled)
        const isTimeAvailable = (idx) => idx % 3 !== 1;

        // Helper to check if a slot is within the selected range
        const isSlotInRange = (timeString) => {
            if (!scheduledTime) return false;
            try {
                const parseTime = (s) => {
                    const [t, p] = s.split(' ');
                    const [h, m] = t.split(':').map(Number);
                    return (p.toLowerCase() === 'pm' && h !== 12 ? h + 12 : (p.toLowerCase() === 'am' && h === 12 ? 0 : h)) * 60 + m;
                };
                const startMins = parseTime(scheduledTime);
                const currentMins = parseTime(timeString);
                const duration = selectedNap?.durationMinutes || 30;
                
                // Handle wraparound for long bookings (e.g. 11pm + 4 hours)
                if (currentMins < startMins) {
                    return currentMins + 1440 >= startMins && currentMins + 1440 < startMins + duration;
                }
                return currentMins >= startMins && currentMins < startMins + duration;
            } catch (e) {
                return false;
            }
        };

        const onConfirm = () => {
            if (!scheduledTime) {
                // If nothing selected, just select the first available for UX sake.
                const firstAvail = times.find((_, i) => isTimeAvailable(i));
                setScheduledTime(firstAvail || '12:00 pm');
            }
            
            // Map the selection up
            const selectedOpt = sortedOptions[selectedDurationIndex];
            const effPrice = isPaid ? selectedOpt.price : 0;
            setSelectedNap({ ...selectedOpt, effectivePrice: effPrice, originalPrice: effPrice });
            setBookingType('scheduled');
            setCurrentStep(4);
        };

        return (
            <div className="flex flex-col h-full animate-fade-in bg-white">
                <div className="px-5 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-20">
                    <button onClick={() => setCurrentStep('3a')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                         <span className="text-xl leading-none text-slate-800">✕</span>
                    </button>
                    <span className="text-lg font-medium text-slate-900 tracking-tight flex-1 ml-4">Pick your slot</span>
                </div>

                <div className="flex-1 overflow-y-auto pb-32">
                    {/* Top Pod Info Card */}
                    <div className="m-4 p-4 border border-slate-200 rounded-2xl shadow-sm bg-white flex gap-4 items-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border-2 border-slate-100">
                             <div className="w-8 h-8 bg-slate-800 rounded relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 m-1 rounded-full"></div>
                                 <div className="absolute bottom-0 w-full h-1/2 bg-slate-700"></div>
                             </div>
                        </div>
                        <div>
                             <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-1 inline-block">
                                 {activePod?.id.toUpperCase()}
                             </span>
                             <p className="text-xs text-slate-600 font-medium leading-tight line-clamp-2">
                                 {activeLocation?.name || 'Local'} {activePod?.name}
                             </p>
                        </div>
                    </div>

                    {/* Booking Date */}
                    <div className="mt-2">
                         <div className="px-5 mb-3 flex items-center gap-2">
                              <div className="h-px bg-slate-200 flex-1"></div>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">BOOKING DATE</span>
                              <div className="h-px bg-slate-200 flex-1"></div>
                         </div>
                         <div className="flex overflow-x-auto px-5 pb-2 gap-2 hide-scrollbar">
                             {/* Group by month UI as per screenshot */}
                             <div className="bg-slate-900 text-white rounded-full flex items-center justify-center shrink-0 py-3 px-2 flex-col font-bold tracking-widest uppercase text-[10px]">
                                 <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{dates[0].month}</span>
                             </div>
                             {dates.map((d, i) => (
                                 <button 
                                     key={d.iso}
                                     onClick={() => setScheduledDate(d.iso)}
                                     className={`min-w-[50px] flex flex-col items-center justify-center py-2 rounded-xl border-2 transition-all shrink-0
                                         ${scheduledDate === d.iso ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-slate-500 hover:bg-slate-50'}
                                     `}
                                     style={scheduledDate === d.iso ? { borderColor: theme.color, backgroundColor: `${theme.color}10`, color: theme.color } : {}}
                                 >
                                     <span className="text-[10px] font-bold uppercase mb-1">{d.weekday}</span>
                                     <span className="text-xl font-medium">{d.day}</span>
                                 </button>
                             ))}
                         </div>
                    </div>

                    {/* Available Slots Segment */}
                    <div className="mt-6">
                         <div className="px-5 mb-4 flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">AVAILABLE SLOTS</span>
                              <div className="h-px bg-slate-200 flex-1"></div>
                         </div>
                         
                         <div className="px-5 mb-6">
                             <div className="flex bg-slate-100 p-1 rounded-xl">
                                 <button 
                                     onClick={() => setTimeTab('midnight')}
                                     className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${timeTab === 'midnight' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                                 >
                                     Midnight → Morning
                                 </button>
                                 <button 
                                     onClick={() => setTimeTab('noon')}
                                     className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${timeTab === 'noon' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                                 >
                                     Noon → Night
                                 </button>
                             </div>
                         </div>

                         {/* Slot Period Control */}
                         <div className="px-5 flex justify-between items-center mb-6">
                             <span className="text-slate-800 font-medium text-lg">Slot Period</span>
                             <div className="flex items-center gap-6">
                                 <button onClick={handleMinus} className={`p-1 ${selectedDurationIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:text-black'}`}>
                                     <Minus className="w-5 h-5" />
                                 </button>
                                 <span className="font-medium text-slate-800 min-w-[70px] text-center">{durationDisplay}</span>
                                 <button onClick={handlePlus} className={`p-1 ${selectedDurationIndex >= sortedOptions.length - 1 ? 'text-slate-300 pointer-events-none' : 'text-[#6d28d9] hover:text-[#5b21b6]'}`}>
                                     <Plus className="w-5 h-5" />
                                 </button>
                             </div>
                         </div>

                         {/* Grid of Slots */}
                         <div className="px-5 grid grid-cols-3 md:grid-cols-4 gap-y-6 gap-x-2">
                             {times.map((t, i) => {
                                 const available = isTimeAvailable(i);
                                 const isSelected = scheduledTime === t;

                                 if (!available) {
                                     // Striped background disabled style
                                     return (
                                        <div key={t} className="relative group">
                                            <span className="text-[10px] font-medium text-slate-600 px-1 absolute -top-4 left-0">{t}</span>
                                            <div className="h-10 w-full rounded border-t border-b border-r border-slate-200 first:border-l bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#f1f5f9_4px,#f1f5f9_8px)]"></div>
                                        </div>
                                     );
                                 }

                                 return (
                                     <div key={t} className="relative">
                                         <span className="text-[10px] font-medium text-slate-600 px-1 absolute -top-4 left-0">{t}</span>
                                         <button 
                                            onClick={() => setScheduledTime(t)}
                                            className={`h-10 w-full rounded border-t border-b border-r border-slate-100 first:border-l relative hover:bg-slate-50 transition-colors ${isSlotInRange(t) ? 'bg-primary/5' : ''}`}
                                            style={isSlotInRange(t) ? { backgroundColor: `${theme.color}10`, borderColor: theme.color } : {}}
                                         >
                                            {isSlotInRange(t) && (
                                                <div className="absolute inset-y-0 -left-px -right-px border-2 border-slate-900 rounded pointer-events-none flex items-center justify-center" style={{ borderColor: theme.color }}>
                                                    {scheduledTime === t && (
                                                        <div className="absolute -top-6 min-w-max bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10" style={{ backgroundColor: theme.color }}>
                                                            {t}
                                                        </div>
                                                    )}
                                                    <div className="w-0.5 h-full bg-slate-900 absolute left-0" style={{ backgroundColor: theme.color }}></div>
                                                </div>
                                            )}
                                         </button>
                                     </div>
                                 )
                             })}
                         </div>
                    </div>
                </div>

                {/* Sticky Floor */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 sm:max-w-[390px] sm:mx-auto pb-8 sm:pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-20 flex justify-between items-center h-[90px]">
                    <span className="text-xl font-bold text-slate-900">${priceToDisplay}</span>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-3.5 rounded-2xl text-white font-medium text-base bg-slate-500 hover:bg-slate-600 active:scale-[0.98] transition-all"
                    >
                        Confirm booking
                    </button>
                </div>

                <style>{`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        );
    }

    if (currentStep === 4) {
        return (
            <div className="flex flex-col h-full animate-fade-in bg-slate-50">
                <div className="px-5 pt-12 pb-4 flex items-center border-b border-slate-200 bg-white sticky top-0 z-10">
                    <button onClick={() => setCurrentStep('3b')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-800" />
                    </button>
                    <h2 className="text-xl font-semibold text-slate-900 text-center flex-1 pr-10">Booking summary</h2>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto pb-24">
                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{activePod?.name}</h3>
                                    <p className="text-sm text-slate-500">{activeLocation?.name || 'Partner Location'}</p>
                                </div>
                                <span className="text-xs uppercase font-bold tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{activePod?.type}</span>
                            </div>

                            <div className="h-px bg-slate-100 my-4"></div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400" /> Date
                                </span>
                                <span className="font-semibold text-slate-900">{scheduledDate}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600 font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" /> Slot
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {(() => {
                                        // Simple logic to calculate end time for display
                                        try {
                                            const [time, period] = scheduledTime.split(' ');
                                            const [hours, minutes] = time.split(':').map(Number);
                                            let totalMinutes = (period.toLowerCase() === 'pm' && hours !== 12 ? hours + 12 : (period.toLowerCase() === 'am' && hours === 12 ? 0 : hours)) * 60 + minutes;
                                            totalMinutes += selectedNap?.durationMinutes || 30;
                                            
                                            const endHours24 = Math.floor(totalMinutes / 60) % 24;
                                            const endMinutes = totalMinutes % 60;
                                            const endPeriod = endHours24 >= 12 ? 'pm' : 'am';
                                            const endHours12 = endHours24 % 12 || 12;

                                            const isNextDay = totalMinutes >= 1440;
                                            
                                            return `${scheduledTime} - ${endHours12}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}${isNextDay ? ' (+1 day)' : ''}`;
                                        } catch (e) {
                                            return scheduledTime;
                                        }
                                    })()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-600 font-medium">Session Duration</span>
                                <span className="font-semibold text-slate-900">{selectedNap?.durationMinutes} min</span>
                            </div>
                        </div>

                        {/* Order Calculation */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                             <div className="flex justify-between items-center mb-3">
                                 <span className="text-slate-600 font-medium">Subtotal</span>
                                 <span className="font-semibold">${selectedNap?.originalPrice?.toFixed(2) || '0.00'}</span>
                             </div>

                             {appliedPromo && (
                                <div className="flex justify-between items-center mb-3 text-emerald-600">
                                    <span className="font-medium text-sm">Promo: {appliedPromo.appliedCodeName || appliedPromo.code}</span>
                                    <span className="font-semibold text-sm">
                                        -{appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}%` : `$${appliedPromo.discountValue}`}
                                    </span>
                                </div>
                            )}

                             <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-1">
                                <span className="font-bold text-slate-900">Total</span>
                                <span className="text-2xl font-bold" style={{ color: theme.color }}>${selectedNap?.effectivePrice?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>

                        {/* Promo Code Input */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">PROMO CODE</label>
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

                    </div>
                </div>
                
                 {/* Sticky Floor */}
                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 sm:max-w-[390px] sm:mx-auto pb-8 sm:pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] z-20">
                    <button
                        onClick={handlePayment}
                        style={{ backgroundColor: theme.color }}
                        className="w-full py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl"
                    >
                         {selectedNap?.effectivePrice === 0 ? 'Start Free Session' : `Pay $${selectedNap?.effectivePrice?.toFixed(2)}`}
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
