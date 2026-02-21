import { generateDeck } from './deck';

export const INITIAL_STATE = {
    deck: [],
    discardPile: [],
    players: [
        { id: 'p1', name: 'Player 1', hand: [], field: [], bank: [], sets: [] },
        { id: 'p2', name: 'AI Rival', hand: [], field: [], bank: [], sets: [] } // Simple AI or minimal 2nd player for testing
    ],
    currentPlayerIdx: 0,
    actionsPlayedThisTurn: 0,
    winner: null,
    logs: ['Game initialized. Waiting for UN Summit...']
};

export const ACTIONS = {
    START_GAME: 'START_GAME',
    DRAW_CARDS: 'DRAW_CARDS',
    PLAY_CARD: 'PLAY_CARD',
    END_TURN: 'END_TURN'
};

export function gameReducer(state, action) {
    switch (action.type) {
        case ACTIONS.START_GAME: {
            const deck = generateDeck();

            // Deal 5 cards to each player
            const p1Hand = deck.splice(0, 5);
            const p2Hand = deck.splice(0, 5);

            return {
                ...state,
                deck,
                players: state.players.map(p =>
                    p.id === 'p1' ? { ...p, hand: p1Hand } : { ...p, hand: p2Hand }
                ),
                logs: [...state.logs, 'Dealt 5 cards to all superpowers.']
            };
        }

        case ACTIONS.DRAW_CARDS: {
            const { count = 2 } = action.payload || {};
            const newDeck = [...state.deck];
            // simplistic empty deck handling: usually reshuffle discard here
            if (newDeck.length < count) return state; // TODO: Reshuffle

            const drawn = newDeck.splice(0, count);
            const playerIdx = state.currentPlayerIdx;

            const newPlayers = [...state.players];
            newPlayers[playerIdx] = {
                ...newPlayers[playerIdx],
                hand: [...newPlayers[playerIdx].hand, ...drawn]
            };

            return {
                ...state,
                deck: newDeck,
                players: newPlayers,
                logs: [...state.logs, `${newPlayers[playerIdx].name} drew ${count} cards.`]
            };
        }

        // Very simplified play logic for now
        case ACTIONS.PLAY_CARD: {
            if (state.actionsPlayedThisTurn >= 3) {
                return {
                    ...state,
                    logs: [...state.logs, 'Action limit reached (3 per turn).']
                };
            }

            const { card, target } = action.payload; // target = 'field' | 'bank'
            const playerIdx = state.currentPlayerIdx;
            const player = state.players[playerIdx];

            // Remove from hand
            const newHand = player.hand.filter(c => c.uniqueId !== card.uniqueId);

            const newPlayer = { ...player, hand: newHand };

            if (target === 'bank') {
                newPlayer.bank = [...newPlayer.bank, card];
            } else if (target === 'field') {
                // Logic for property vs action
                if (card.type === 'PROPERTY') {
                    newPlayer.field = [...newPlayer.field, card];
                } else if (card.type === 'ACTION') {
                    // Action logic (stub) - e.g. Pass Go
                    if (card.id === 'go') {
                        // Effect happens outside or handled via immediate draw?
                        // For now, just discard action cards played
                    }
                }
            }

            const newPlayers = [...state.players];
            newPlayers[playerIdx] = newPlayer;

            return {
                ...state,
                players: newPlayers,
                actionsPlayedThisTurn: state.actionsPlayedThisTurn + 1,
                logs: [...state.logs, `${player.name} played ${card.name}.`]
            };
        }

        case ACTIONS.END_TURN: {
            const nextIdx = (state.currentPlayerIdx + 1) % state.players.length;
            return {
                ...state,
                currentPlayerIdx: nextIdx,
                actionsPlayedThisTurn: 0,
                logs: [...state.logs, `Turn passed to ${state.players[nextIdx].name}.`]
            };
        }

        default:
            return state;
    }
}
