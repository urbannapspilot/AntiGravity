import React from 'react';
import { Shield, Skull, Landmark, Database, CircleDollarSign } from 'lucide-react';
import { CARD_TYPES } from '../engine/deck';

const Card = ({ card, onClick, isPlayable = true, size = 'md' }) => {
    const isSmall = size === 'sm';

    // Dynamic border based on card type
    const getBorderColor = () => {
        switch (card.type) {
            case CARD_TYPES.PROPERTY: return `border-[${card.color}]`;
            case CARD_TYPES.ACTION: return 'border-red-500';
            case CARD_TYPES.MONEY: return 'border-emerald-500';
            default: return 'border-slate-500';
        }
    };

    // Custom Render for Property Color Bar
    const renderHeader = () => {
        if (card.type === CARD_TYPES.PROPERTY) {
            return (
                <div
                    className={`w-full h-8 mb-2 flex items-center justify-center font-bold text-xs uppercase text-white shadow-sm`}
                    style={{ backgroundColor: card.color }}
                >
                    {/* Maybe add regions here? */}
                </div>
            );
        }
        if (card.type === CARD_TYPES.ACTION) {
            return (
                <div className="w-full h-8 mb-2 bg-red-900/50 flex items-center justify-center border-b border-red-500/30">
                    <Skull size={14} className="text-red-400 mr-1" />
                    <span className="text-[10px] sm:text-xs text-red-200 uppercase tracking-widest font-bold">Operation</span>
                </div>
            );
        }
        if (card.type === CARD_TYPES.MONEY) {
            return (
                <div className="w-full h-8 mb-2 bg-emerald-900/50 flex items-center justify-center border-b border-emerald-500/30">
                    <CircleDollarSign size={14} className="text-emerald-400 mr-1" />
                    <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-widest font-bold">Influence</span>
                </div>
            );
        }
        return <div className="h-4" />;
    };

    const getValueBadge = () => (
        <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-mono font-bold text-neutral-400 z-10 shadow-lg">
            {card.value}M
        </div>
    );

    return (
        <div
            onClick={isPlayable ? onClick : undefined}
            className={`
        relative 
        ${isSmall ? 'w-24 h-36 border-2 text-[10px]' : 'w-40 h-56 border-4 text-xs'}
        bg-neutral-800 
        ${isPlayable ? 'hover:-translate-y-4 cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
        transition-all duration-300 ease-out
        rounded-xl overflow-hidden
        flex flex-col items-center
        select-none
        border-opacity-50
      `}
            style={{ borderColor: card.color || (card.type === CARD_TYPES.ACTION ? '#ef4444' : (card.type === CARD_TYPES.MONEY ? '#10b981' : '#64748b')) }}
        >
            {/* Value Badge */}
            {card.value && getValueBadge()}

            {/* Card Header (Color Bar or Type Indicator) */}
            {renderHeader()}

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center px-2 text-center w-full">
                <h3 className={`font-black uppercase leading-tight mb-2 ${isSmall ? 'text-[9px]' : 'text-sm'}`}>
                    {card.name}
                </h3>

                {card.type === CARD_TYPES.ACTION && (
                    <p className="text-neutral-400 italic leading-snug text-[9px] border-t border-neutral-700 pt-2 mt-auto pb-4">
                        {card.description}
                    </p>
                )}

                {card.type === CARD_TYPES.PROPERTY && (
                    <div className="mt-auto mb-4 opacity-30">
                        <Landmark size={isSmall ? 16 : 32} />
                    </div>
                )}

                {card.type === CARD_TYPES.MONEY && (
                    <div className="mt-auto mb-4 opacity-30">
                        <Database size={isSmall ? 16 : 32} />
                    </div>
                )}
            </div>

            {/* Footer Decoration */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
};

export default Card;
