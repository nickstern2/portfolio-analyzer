import React from "react";
import type { Holding } from "../types/holding";

interface HoldingsTableProps {
  holdings: Holding[];
  onEdit: (holding: Holding) => void;
  test?: any;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings, onEdit }) => {
  const totalValue = holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );

  return (
    <div className="table-scroll">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name</th>
            <th>Value</th>
            <th>Weight</th>
            <th>Actions</th>
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
              <td>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onEdit(holding)}
                  aria-label={`Edit ${holding.ticker}`}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total Portfolio Value</td>
            <td>${totalValue.toLocaleString()}</td>
            <td>{totalValue > 0 ? "100.0%" : "0.0%"}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default HoldingsTable;
