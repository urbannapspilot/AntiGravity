import React from 'react';
import Card from './Card';

const Hand = ({ hand, onPlayCard, isCurrentPlayer }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-48 flex items-end justify-center pb-4 pointer-events-none z-50 px-4">
            <div className="flex -space-x-12 hover:-space-x-4 transition-all duration-500 ease-out pointer-events-auto overflow-x-auto max-w-full px-12 pb-4 pt-12 items-end">
                {hand.map((card, idx) => (
                    <div
                        key={card.uniqueId}
                        className="transform transition-transform hover:z-50 hover:scale-110 origin-bottom"
                        style={{
                            transform: `rotate(${(idx - hand.length / 2) * 5}deg) translateY(${Math.abs((idx - hand.length / 2) * 5)}px)`
                        }}
                    >
                        <Card
                            card={card}
                            onClick={() => onPlayCard(card)}
                            isPlayable={isCurrentPlayer}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Hand;
