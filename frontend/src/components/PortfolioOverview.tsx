import { useState } from "react";
import type { Holding } from "../types/holding";

interface PortfolioOverviewProps {
  holdings: Holding[];
}

const chartRadius = 52;
const chartCircumference = 2 * Math.PI * chartRadius;
const chartColors = [
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#16a34a",
  "#db2777",
  "#ca8a04",
  "#2563eb",
  "#4f46e5",
];

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const PortfolioOverview = ({ holdings }: PortfolioOverviewProps) => {
  const [activeHoldingId, setActiveHoldingId] = useState<string | null>(null);
  const totalValue = holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );
  const activeHolding =
    holdings.find((holding) => holding.id === activeHoldingId) ?? null;
  const activeWeight =
    activeHolding && totalValue > 0
      ? (activeHolding.value / totalValue) * 100
      : 0;
  const largestHolding = holdings.reduce<Holding | null>(
    (largest, holding) =>
      largest === null || holding.value > largest.value ? holding : largest,
    null,
  );

  let chartOffset = 0;

  return (
    <section className="portfolio-overview" aria-label="Portfolio overview">
      <div className="overview-metrics">
        <article className="metric-card">
          <h2>Total portfolio value</h2>
          <p className="metric-value">{formatCurrency(totalValue)}</p>
        </article>
        <article className="metric-card">
          <h2>Holdings</h2>
          <p className="metric-value">{holdings.length}</p>
        </article>
        <article className="metric-card">
          <h2>Largest holding</h2>
          {largestHolding ? (
            <>
              <p className="metric-value">{largestHolding.ticker}</p>
              <p className="metric-detail">
                {formatCurrency(largestHolding.value)}
              </p>
            </>
          ) : (
            <p className="metric-value">—</p>
          )}
        </article>
      </div>

      <section className="allocation-card" aria-labelledby="allocation-heading">
        <h2 id="allocation-heading">Allocation by holding</h2>
        <div
          className="allocation-layout"
          onMouseLeave={() => setActiveHoldingId(null)}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (
              !(nextTarget instanceof Node) ||
              !event.currentTarget.contains(nextTarget)
            ) {
              setActiveHoldingId(null);
            }
          }}
        >
          <div
            className={`allocation-chart${activeHolding ? " has-active-holding" : ""}`}
          >
            <svg
              viewBox="0 0 140 140"
              role="group"
              aria-label="Portfolio allocation by holding. Focus or hover a segment for details."
            >
              <circle
                className="allocation-chart-track"
                cx="70"
                cy="70"
                r={chartRadius}
              />
              {totalValue > 0 &&
                holdings.map((holding, index) => {
                  if (holding.value === 0) {
                    return null;
                  }

                  const segmentLength =
                    chartCircumference * (holding.value / totalValue);
                  const offset = chartOffset;
                  chartOffset += segmentLength;
                  const weight = (holding.value / totalValue) * 100;
                  const isActive = activeHoldingId === holding.id;

                  return (
                    <circle
                      key={holding.id}
                      className={`allocation-chart-segment${isActive ? " is-active" : ""}`}
                      cx="70"
                      cy="70"
                      r={chartRadius}
                      stroke={chartColors[index % chartColors.length]}
                      strokeDasharray={`${segmentLength} ${chartCircumference - segmentLength}`}
                      strokeDashoffset={-offset}
                      role="img"
                      tabIndex={0}
                      aria-label={`${holding.ticker}, ${holding.name}, ${formatCurrency(holding.value)}, ${weight.toFixed(1)}% of portfolio`}
                      onMouseEnter={() => setActiveHoldingId(holding.id)}
                      onFocus={() => setActiveHoldingId(holding.id)}
                    />
                  );
                })}
            </svg>
            <div className="allocation-chart-center">
              {activeHolding ? (
                <>
                  <span>{activeHolding.ticker}</span>
                  <strong>{formatCurrency(activeHolding.value)}</strong>
                  <small>{activeWeight.toFixed(1)}% of portfolio</small>
                  <span className="allocation-center-name">
                    {activeHolding.name}
                  </span>
                </>
              ) : (
                <>
                  <span>Total value</span>
                  <strong>{formatCurrency(totalValue)}</strong>
                </>
              )}
            </div>
          </div>

          <ul className="allocation-legend">
            {holdings.map((holding, index) => {
              const weight =
                totalValue > 0 ? (holding.value / totalValue) * 100 : 0;
              const isActive = activeHoldingId === holding.id;

              return (
                <li
                  key={holding.id}
                  onMouseEnter={() => setActiveHoldingId(holding.id)}
                >
                  <button
                    type="button"
                    className={`allocation-legend-item${isActive ? " is-active" : ""}`}
                    onFocus={() => setActiveHoldingId(holding.id)}
                  >
                    <span
                      className="allocation-swatch"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                      aria-hidden="true"
                    />
                    <span className="allocation-holding">
                      <strong>{holding.ticker}</strong>
                      <span>{holding.name}</span>
                    </span>
                    <span className="allocation-weight">
                      {weight.toFixed(1)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {totalValue === 0 && (
          <p className="allocation-empty">
            Add a value to a holding to see its portfolio allocation.
          </p>
        )}
      </section>
    </section>
  );
};

export default PortfolioOverview;
