import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import type { Holding } from "../types/holding";
import { formatCurrency } from "../utils/formatCurrency";

interface PortfolioOverviewProps {
  holdings: Holding[];
}

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

const seriesId = "portfolio-allocation";

const PortfolioOverview = ({ holdings }: PortfolioOverviewProps) => {
  const [activeHoldingId, setActiveHoldingId] = useState<string | null>(null);
  const totalValue = holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );
  const chartHoldings = holdings
    .map((holding, index) => ({ holding, index }))
    .filter(({ holding }) => holding.value > 0);
  const activeChartIndex = chartHoldings.findIndex(
    ({ holding }) => holding.id === activeHoldingId,
  );
  const activeIndex = holdings.findIndex(
    (holding) => holding.id === activeHoldingId,
  );
  const activeHolding = activeIndex >= 0 ? holdings[activeIndex] : null;
  const activeWeight =
    activeHolding && totalValue > 0
      ? (activeHolding.value / totalValue) * 100
      : 0;
  const largestHolding = holdings.reduce<Holding | null>(
    (largest, holding) =>
      largest === null || holding.value > largest.value ? holding : largest,
    null,
  );

  const handleHighlightChange = (item: {
    dataIndex?: number;
  } | null) => {
    setActiveHoldingId(
      item?.dataIndex === undefined
        ? null
        : chartHoldings[item.dataIndex]?.holding.id ?? null,
    );
  };

  return (
    <Stack component="section" aria-label="Portfolio overview" spacing={2.5}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <MetricCard
          label="Total portfolio value"
          value={formatCurrency(totalValue)}
        />
        <MetricCard label="Holdings" value={String(holdings.length)} />
        <MetricCard
          label="Largest holding"
          value={largestHolding?.ticker ?? "—"}
          detail={
            largestHolding ? formatCurrency(largestHolding.value) : undefined
          }
        />
      </Box>

      <Card
        component="section"
        variant="outlined"
        aria-labelledby="allocation-heading"
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
        <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: 3 } }}>
          <Typography
            id="allocation-heading"
            component="h2"
            variant="h6"
            sx={{ mb: 2 }}
          >
            Allocation by holding
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "240px minmax(0, 1fr)",
              },
              alignItems: "center",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "min(100%, 240px)",
                aspectRatio: "1",
                justifySelf: "center",
              }}
            >
              {totalValue > 0 ? (
                <PieChart
                  width={240}
                  height={240}
                  hideLegend
                  skipAnimation
                  series={[
                    {
                      id: seriesId,
                      data: chartHoldings.map(({ holding, index }) => ({
                        id: holding.id,
                        value: holding.value,
                        label: holding.ticker,
                        color: chartColors[index % chartColors.length],
                      })),
                      innerRadius: 78,
                      outerRadius: 108,
                      paddingAngle: 1,
                      cornerRadius: 2,
                      highlightScope: {
                        highlight: "item",
                        fade: "global",
                      },
                      valueFormatter: (item) => formatCurrency(item.value),
                    },
                  ]}
                  highlightedItem={
                    activeChartIndex >= 0
                      ? { seriesId, dataIndex: activeChartIndex }
                      : null
                  }
                  onHighlightChange={(item) => {
                    if (item) {
                      handleHighlightChange(item);
                    }
                  }}
                  margin={0}
                />
              ) : (
                <Box
                  aria-label="No allocation values"
                  sx={{
                    width: 216,
                    height: 216,
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    border: 32,
                    borderStyle: "solid",
                    borderColor: "divider",
                    borderRadius: "50%",
                    mx: "auto",
                    mt: 1.5,
                  }}
                />
              )}
              <Stack
                spacing={0.25}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 156,
                  height: 156,
                  boxSizing: "border-box",
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1.5,
                  textAlign: "center",
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {activeHolding?.ticker ?? "Total value"}
                </Typography>
                <Typography
                  variant="h6"
                  component="strong"
                  noWrap
                  sx={{
                    maxWidth: "100%",
                    fontSize: "clamp(0.875rem, 3.5vw, 1.25rem)",
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(activeHolding?.value ?? totalValue)}
                </Typography>
                {activeHolding && (
                  <>
                    <Typography variant="caption">
                      {activeWeight.toFixed(1)}% of portfolio
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {activeHolding.name}
                    </Typography>
                  </>
                )}
              </Stack>
            </Box>

            <List disablePadding>
              {holdings.map((holding, index) => {
                const weight =
                  totalValue > 0 ? (holding.value / totalValue) * 100 : 0;
                const isActive = activeHoldingId === holding.id;

                return (
                  <ListItem key={holding.id} disablePadding>
                    <ListItemButton
                      selected={isActive}
                      onMouseEnter={() => setActiveHoldingId(holding.id)}
                      onFocus={() => setActiveHoldingId(holding.id)}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "16px minmax(0, 1fr) auto",
                        gap: 1.5,
                        borderBottom: 1,
                        borderColor: "divider",
                        "&:last-child": { borderBottom: 0 },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor:
                              chartColors[index % chartColors.length],
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                          >
                            {holding.ticker}
                          </Typography>
                        }
                        secondary={holding.name}
                        slotProps={{
                          secondary: {
                            noWrap: true,
                            variant: "caption",
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {weight.toFixed(1)}%
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          {totalValue === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5 }}
            >
              Add a value to a holding to see its portfolio allocation.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
}

const MetricCard = ({ label, value, detail }: MetricCardProps) => (
  <Card variant="outlined">
    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: 2.5 } }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
      >
        {value}
      </Typography>
      {detail && (
        <Typography variant="body2" color="text.secondary">
          {detail}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default PortfolioOverview;
