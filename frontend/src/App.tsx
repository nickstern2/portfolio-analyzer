import HoldingsTable from "./components/HoldingsTable";

const holdings = [
  { id: "1", ticker: "VTI", name: "Total Stock Market", value: 50000 },
  { id: "2", ticker: "VO", name: "Mid-Cap ETF", value: 20000 },
  { id: "3", ticker: "EFA", name: "International Equity", value: 25000 },
  { id: "4", ticker: "BND", name: "Total Bond Market", value: 15000 },
];

function App() {
  return (
    <main>
      <h1>Portfolio Analyzer</h1>
      <HoldingsTable holdings={holdings} />
    </main>
  );
}

export default App;
