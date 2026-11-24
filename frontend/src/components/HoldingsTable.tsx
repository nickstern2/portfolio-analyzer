import React from "react";

interface Holding {
  id: string;
  ticker: string;
  name: string;
  value: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const totalValue = holdings.reduce((total, holding) => {
    return total + holding.value;
  }, 0);

  return (
    <div>
      <h2>Portfolio Holdings</h2>

      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Value</th>
            <th>Weight</th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.id}>
              <td>{holding.ticker}</td>
              <td>{holding.name}</td>
              <td>${holding.value.toLocaleString()}</td>
              <td>
                {totalValue > 0
                  ? ((holding.value / totalValue) * 100).toFixed(1)
                  : "0.0"}
                %
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total Portfolio Value</td>
            <td>${totalValue.toLocaleString()}</td>
            <td>{totalValue > 0 ? "100.0%" : "0.0%"}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default HoldingsTable;
