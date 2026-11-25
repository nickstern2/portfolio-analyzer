import { useState } from "react";
import HoldingForm from "./components/HoldingForm";
import HoldingsTable from "./components/HoldingsTable";
import { useHoldings } from "./hooks/useHoldings";
import type { Holding } from "./types/holding";
import "./App.css";

function App() {
  const { holdings, storageError, addHolding, updateHolding } = useHoldings();
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  const handleUpdate = (holding: Holding) => {
    updateHolding(holding);
    setEditingHolding(null);
  };

  return (
    <main className="portfolio-app">
      <h1>Portfolio Analyzer</h1>
      {storageError && (
        <p className="storage-error" role="alert">
          {storageError}
        </p>
      )}
      <section className="holdings-panel">
        <h2>Portfolio Holdings</h2>
        <HoldingForm
          key={editingHolding?.id ?? "new"}
          holding={editingHolding}
          onAdd={addHolding}
          onUpdate={handleUpdate}
          onCancel={() => setEditingHolding(null)}
        />
        <HoldingsTable
          holdings={holdings}
          onEdit={setEditingHolding}
        />
      </section>
    </main>
  );
}

export default App;
