import React, { useReducer, useEffect } from 'react';
import { gameReducer, INITIAL_STATE, ACTIONS } from '../engine/gameReducer';
import Card from './Card';
import Hand from './Hand';
import { Globe, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function GameBoard() {
    const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

    useEffect(() => {
        dispatch({ type: ACTIONS.START_GAME });
    }, []);

    const currentPlayer = state.players[state.currentPlayerIdx];

    const handlePlayCard = (card) => {
        // Simple logic: If Property -> Field, If Money -> Bank, If Action -> Field (effects pending)
        let target = 'field';
        if (card.type === 'MONEY') target = 'bank';

        dispatch({
            type: ACTIONS.PLAY_CARD,
            payload: { card, target }
        });
    };

    const handleEndTurn = () => {
        // Fill hand to 5 cards if needed (simplified rule)
        if (currentPlayer.hand.length < 5) {
            dispatch({ type: ACTIONS.DRAW_CARDS, payload: { count: 5 - currentPlayer.hand.length } });
        }
        dispatch({ type: ACTIONS.END_TURN });
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center text-white relative">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-8">

                {/* Top Bar */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
                            <Globe className="text-emerald-400" />
                            Global Powers
                        </h1>
                        <p className="text-neutral-500 text-xs font-mono mt-1 ml-1">DEFCON 4 // GEOPOLITICAL SIMULATION</p>
                    </div>

                    <div className="flex gap-4">
                        {state.players.map((p, i) => (
                            <div key={p.id} className={`p-4 rounded-xl border ${i === state.currentPlayerIdx ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-neutral-900/50 border-neutral-700/50 opacity-60'} backdrop-blur-md min-w-[150px]`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={14} className={i === state.currentPlayerIdx ? 'text-emerald-400' : 'text-neutral-500'} />
                                    <span className="font-bold text-sm uppercase">{p.name}</span>
                                </div>
                                <div className="flex justify-between text-xs text-neutral-400">
                                    <span>Bank:</span>
                                    <span className="text-emerald-400 font-mono font-bold">{p.bank.reduce((acc, c) => acc + c.value, 0)}B</span>
                                </div>
                                <div className="flex justify-between text-xs text-neutral-400">
                                    <span>Assets:</span>
                                    <span className="text-blue-400 font-mono font-bold">{p.field.filter(c => c.type === 'PROPERTY').length}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Game Field (Split View) */}
                <div className="flex-1 flex gap-8 items-center justify-center py-8 perspective-[1000px]">
                    {/* Opponent Field */}
                    <div className="flex-1 h-full bg-red-900/5 border border-red-500/10 rounded-2xl p-4 transform rotate-x-12 opacity-80 hover:opacity-100 transition-opacity">
                        <h3 className="text-xs uppercase font-bold text-red-500 mb-4 flex items-center gap-2">
                            <AlertTriangle size={12} /> Rival Territories
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {/* Simplified View of Opponent Cards */}
                            {state.players[1].field.map((card) => (
                                <Card key={card.uniqueId} card={card} size="sm" isPlayable={false} />
                            ))}
                            {state.players[1].field.length === 0 && <span className="text-neutral-700 text-xs text-center w-full mt-10">No visible assets</span>}
                        </div>
                    </div>

                    {/* Player Field */}
                    <div className="flex-1 h-full bg-emerald-900/5 border border-emerald-500/10 rounded-2xl p-4 transform -rotate-x-12">
                        <h3 className="text-xs uppercase font-bold text-emerald-500 mb-4 flex items-center gap-2">
                            <TrendingUp size={12} /> Sovereign Territory
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center content-start h-full overflow-y-auto pb-32">
                            {state.players[0].field.map((card) => (
                                <Card key={card.uniqueId} card={card} size="sm" isPlayable={false} />
                            ))}
                            {state.players[0].field.length === 0 && <span className="text-neutral-700 text-xs text-center w-full mt-10">Deploy assets to establish dominance</span>}
                        </div>
                    </div>
                </div>

                {/* Action Log / Controls */}
                <div className="fixed object-bottom right-4 top-1/2 -translate-y-1/2 w-64 h-96 pointer-events-none">
                    <div className="h-full flex flex-col justify-end gap-2 pointer-events-auto">
                        <div className="bg-black/80 backdrop-blur-md rounded-lg p-3 border-l-2 border-emerald-500 overflow-hidden text-xs font-mono text-emerald-500/80 shadow-2xl">
                            <div className="opacity-50 mb-1 border-b border-white/10 pb-1">COMMS LOG</div>
                            {state.logs.slice(-5).map((log, i) => (
                                <div key={i} className="mb-1 truncate opacity-80 hover:opacity-100">{`> ${log}`}</div>
                            ))}
                        </div>

                        <button
                            onClick={handleEndTurn}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wide text-sm flex items-center justify-center gap-2"
                        >
                            End Turn
                        </button>
                    </div>
                </div>

            </div>

            {/* Hand */}
            <Hand
                hand={currentPlayer?.hand || []}
                onPlayCard={handlePlayCard}
                isCurrentPlayer={state.players[0].id === currentPlayer?.id}
            />
        </div>
    );
}
