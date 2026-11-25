import { useState } from "react";
import {
  loadHoldingsFromStorage,
  saveHoldingsToStorage,
} from "../utils/holdingsStorage";
import type { Holding, HoldingInput } from "../types/holding";

export function useHoldings() {
  const [portfolio, setPortfolio] = useState(loadHoldingsFromStorage);

  const saveHoldings = (holdings: Holding[]) => {
    const storageError = saveHoldingsToStorage(holdings);
    setPortfolio({ holdings, storageError });
  };

  const addHolding = (holding: HoldingInput) => {
    saveHoldings([
      ...portfolio.holdings,
      { ...holding, id: window.crypto.randomUUID() },
    ]);
  };

  const updateHolding = (updatedHolding: Holding) => {
    saveHoldings(
      portfolio.holdings.map((holding) =>
        holding.id === updatedHolding.id ? updatedHolding : holding,
      ),
    );
  };

  return {
    holdings: portfolio.holdings,
    storageError: portfolio.storageError,
    addHolding,
    updateHolding,
  };
}
