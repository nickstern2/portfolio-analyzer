import { useState } from "react";
import { Add } from "@mui/icons-material";
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import HoldingDialog from "./components/HoldingDialog";
import HoldingsTable from "./components/HoldingsTable";
import PortfolioOverview from "./components/PortfolioOverview";
import { useHoldings } from "./hooks/useHoldings";
import type { Holding } from "./types/holding";

function App() {
  const {
    holdings,
    storageError,
    addHolding,
    updateHolding,
    deleteHolding,
  } = useHoldings();
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [holdingDialogOpen, setHoldingDialogOpen] = useState(false);

  const openAddDialog = () => {
    setEditingHolding(null);
    setHoldingDialogOpen(true);
  };

  const openEditDialog = (holding: Holding) => {
    setEditingHolding(holding);
    setHoldingDialogOpen(true);
  };

  const closeHoldingDialog = () => {
    setHoldingDialogOpen(false);
    setEditingHolding(null);
  };

  const handleDelete = (holdingId: string) => {
    deleteHolding(holdingId);
    setEditingHolding((current) =>
      current?.id === holdingId ? null : current,
    );
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
      <Stack spacing={4}>
        <Typography
          component="h1"
          variant="h3"
          sx={{ fontWeight: 700 }}
        >
          Portfolio Analyzer
        </Typography>
        {storageError && (
          <Alert severity="warning" role="alert">
            {storageError}
          </Alert>
        )}
        <PortfolioOverview holdings={holdings} />
        <Paper
          component="section"
          variant="outlined"
          sx={{ p: { xs: 2, sm: 3 } }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Typography component="h2" variant="h5">
                Portfolio Holdings
              </Typography>
              <Button
                onClick={openAddDialog}
                variant="contained"
                startIcon={<Add />}
                sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
              >
                Add holding
              </Button>
            </Stack>
            <HoldingsTable
              holdings={holdings}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          </Stack>
        </Paper>
        <HoldingDialog
          open={holdingDialogOpen}
          holding={editingHolding}
          onAdd={addHolding}
          onUpdate={updateHolding}
          onClose={closeHoldingDialog}
        />
      </Stack>
    </Container>
  );
}

export default App;
