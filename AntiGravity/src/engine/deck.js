export const CARD_TYPES = {
    PROPERTY: 'PROPERTY',
    ACTION: 'ACTION',
    MONEY: 'MONEY',
    WILD_PROPERTY: 'WILD_PROPERTY',
    RENT: 'RENT'
};

export const COLORS = {
    NA: '#3b82f6', // North America (Blue)
    EU: '#eab308', // Europe (Yellow)
    AS: '#ef4444', // Asia (Red)
    ME: '#f97316', // Middle East (Orange)
    SA: '#22c55e', // South America (Green)
    AF: '#854d0e', // Africa (Brown)
    OC: '#06b6d4', // Oceania (Cyan)
    UT: '#a855f7', // Tech/Energy (Purple)
    RR: '#1e293b'  // Transport/Logistics (Slate)
};

export const PROPERTIES = [
    // North America (Need 3)
    { id: 'na1', name: 'USA', color: COLORS.NA, value: 4 },
    { id: 'na2', name: 'Canada', color: COLORS.NA, value: 4 },
    { id: 'na3', name: 'Mexico', color: COLORS.NA, value: 2 },

    // Europe (Need 3)
    { id: 'eu1', name: 'Germany', color: COLORS.EU, value: 4 },
    { id: 'eu2', name: 'France', color: COLORS.EU, value: 3 },
    { id: 'eu3', name: 'UK', color: COLORS.EU, value: 3 },

    // Asia (Need 3)
    { id: 'as1', name: 'China', color: COLORS.AS, value: 5 },
    { id: 'as2', name: 'Japan', color: COLORS.AS, value: 4 },
    { id: 'as3', name: 'India', color: COLORS.AS, value: 3 },

    // South America (Need 2)
    { id: 'sa1', name: 'Brazil', color: COLORS.SA, value: 3 },
    { id: 'sa2', name: 'Argentina', color: COLORS.SA, value: 2 },

    // Africa (Need 2)
    { id: 'af1', name: 'Nigeria', color: COLORS.AF, value: 2 },
    { id: 'af2', name: 'South Africa', color: COLORS.AF, value: 2 },

    // Oceania (Need 2)
    { id: 'oc1', name: 'Australia', color: COLORS.OC, value: 2 },
    { id: 'oc2', name: 'New Zealand', color: COLORS.OC, value: 1 },

    // Middle East (Need 2)
    { id: 'me1', name: 'Saudi Arabia', color: COLORS.ME, value: 3 },
    { id: 'me2', name: 'UAE', color: COLORS.ME, value: 3 },

    // Tech Giants (Utilities - Need 2)
    { id: 'ut1', name: 'Silicon Valley', color: COLORS.UT, value: 2 },
    { id: 'ut2', name: 'Shenzhen Tech Hub', color: COLORS.UT, value: 2 },

    // Logistics (Railroads - Need 4)
    { id: 'rr1', name: 'Panama Canal', color: COLORS.RR, value: 2 },
    { id: 'rr2', name: 'Suez Canal', color: COLORS.RR, value: 2 },
    { id: 'rr3', name: 'Strait of Malacca', color: COLORS.RR, value: 2 },
    { id: 'rr4', name: 'Strait of Hormuz', color: COLORS.RR, value: 2 },
];

export const ACTIONS = [
    { id: 'deal_breaker', name: 'Hostile Takeover', count: 2, value: 5, description: 'Steal a complete set from any player.' },
    { id: 'just_say_no', name: 'Veto Power', count: 3, value: 4, description: 'Cancel any action card played against you.' },
    { id: 'debt_collector', name: 'IMF Loan Default', count: 3, value: 3, description: 'Force any player to pay you 5M.' },
    { id: 'birthday', name: 'Foreign Aid Request', count: 3, value: 2, description: 'All players pay you 2M.' },
    { id: 'double_rent', name: 'Hyperinflation', count: 2, value: 1, description: 'Double the rent (Tribute) owed.' },
    { id: 'go', name: 'UN Summit', count: 10, value: 1, description: 'Draw 2 extra cards.' },
    { id: 'sly_deal', name: 'Diplomatic Pressure', count: 3, value: 3, description: 'Steal a property from any player (cannot be part of a full set).' },
    { id: 'forced_deal', name: 'Trade War', count: 3, value: 3, description: 'Swap a property with another player (cannot be part of a full set).' },
];

// Helper to generate specific card instances
export const generateDeck = () => {
    let deck = [];
    let idCounter = 0;

    // 1. Add Properties
    PROPERTIES.forEach(p => {
        deck.push({ ...p, type: CARD_TYPES.PROPERTY, uniqueId: `prop_${idCounter++}` });
    });

    // 2. Add Actions
    ACTIONS.forEach(a => {
        for (let i = 0; i < a.count; i++) {
            deck.push({ ...a, type: CARD_TYPES.ACTION, uniqueId: `action_${a.id}_${i}` });
        }
    });

    // 3. Add Money (Influence)
    const moneyDist = [
        { val: 10, count: 1 }, // 10M
        { val: 5, count: 2 },  // 5M
        { val: 4, count: 3 },  // 4M
        { val: 3, count: 3 },  // 3M
        { val: 2, count: 5 },  // 2M
        { val: 1, count: 6 },  // 1M
    ];

    moneyDist.forEach(m => {
        for (let i = 0; i < m.count; i++) {
            deck.push({
                id: `money_${m.val}`,
                name: `${m.val}B Influence`,
                value: m.val,
                type: CARD_TYPES.MONEY,
                uniqueId: `money_${idCounter++}`
            });
        }
    });

    return shuffle(deck);
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
