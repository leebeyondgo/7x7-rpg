import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [health, setHealth] = useState(100);
  const [food, setFood] = useState(100);
  const [gold, setGold] = useState(0);
  const [turn, setTurn] = useState(0);

  const consumeTurn = () => {
    setTurn(t => t + 1);
    setFood(f => {
      if (f > 0) {
        return f - 1;
      }
      setHealth(h => Math.max(h - 1, 0));
      return 0;
    });
  };

  return (
    <GameContext.Provider value={{
      health,
      food,
      gold,
      turn,
      setHealth,
      setFood,
      setGold,
      consumeTurn,
    }}>
      {children}
    </GameContext.Provider>
  );
}
