import type { Holding } from "../types/holding";

const STORAGE_KEY = "portfolio-analyzer-holdings";

const initialHoldings: Holding[] = [
  { id: "1", ticker: "VTI", name: "Total Stock Market", value: 50000 },
  { id: "2", ticker: "VO", name: "Mid-Cap ETF", value: 20000 },
  { id: "3", ticker: "EFA", name: "International Equity", value: 25000 },
  { id: "4", ticker: "BND", name: "Total Bond Market", value: 15000 },
];

function isHolding(value: unknown): value is Holding {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const holding = value as Record<string, unknown>;
  return (
    typeof holding.id === "string" &&
    typeof holding.ticker === "string" &&
    typeof holding.name === "string" &&
    typeof holding.value === "number" &&
    Number.isFinite(holding.value) &&
    holding.value >= 0
  );
}

export function loadHoldingsFromStorage(): {
  holdings: Holding[];
  storageError: string | null;
} {
  try {
    const savedHoldings = window.localStorage.getItem(STORAGE_KEY);
    if (savedHoldings === null) {
      return { holdings: initialHoldings, storageError: null };
    }

    const parsed: unknown = JSON.parse(savedHoldings);
    if (Array.isArray(parsed) && parsed.every(isHolding)) {
      return { holdings: parsed, storageError: null };
    }

    console.error("Saved holdings have an invalid format.");
    return {
      holdings: initialHoldings,
      storageError:
        "Saved holdings could not be loaded because the stored data is invalid.",
    };
  } catch (error) {
    console.error("Unable to load holdings from local storage.", error);
    return {
      holdings: initialHoldings,
      storageError:
        "Saved holdings could not be loaded; showing the example holdings instead.",
    };
  }
}

export function saveHoldingsToStorage(holdings: Holding[]): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    return null;
  } catch (error) {
    console.error("Unable to save holdings to local storage.", error);
    return "Your changes are shown but could not be saved in this browser.";
  }
}
