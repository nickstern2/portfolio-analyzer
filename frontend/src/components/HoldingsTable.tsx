import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Holding } from "../types/holding";
import { formatCurrency } from "../utils/formatCurrency";

interface HoldingsTableProps {
  holdings: Holding[];
  onEdit: (holding: Holding) => void;
  onDelete: (holdingId: string) => void;
}

type HoldingRow = Holding & { weight: number };

const HoldingsTable = ({
  holdings,
  onEdit,
  onDelete,
}: HoldingsTableProps) => {
  const [holdingToDelete, setHoldingToDelete] = useState<Holding | null>(null);
  const totalValue = holdings.reduce(
    (total, holding) => total + holding.value,
    0,
  );
  const rows = useMemo<HoldingRow[]>(
    () =>
      holdings.map((holding) => ({
        ...holding,
        weight: totalValue > 0 ? (holding.value / totalValue) * 100 : 0,
      })),
    [holdings, totalValue],
  );
  const columns = useMemo<GridColDef<HoldingRow>[]>(
    () => [
      {
        field: "ticker",
        headerName: "Ticker",
        minWidth: 100,
        flex: 0.6,
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 180,
        flex: 1.5,
      },
      {
        field: "value",
        headerName: "Value",
        type: "number",
        minWidth: 140,
        flex: 0.8,
        renderCell: ({ row }) => formatCurrency(row.value),
      },
      {
        field: "weight",
        headerName: "Weight",
        type: "number",
        minWidth: 110,
        flex: 0.6,
        renderCell: ({ row }) => `${row.weight.toFixed(1)}%`,
      },
      {
        field: "actions",
        headerName: "Actions",
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        minWidth: 100,
        width: 110,
        renderCell: ({ row }) => (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title={`Edit ${row.ticker}`}>
              <IconButton
                size="small"
                aria-label={`Edit ${row.ticker}`}
                onClick={() => onEdit(row)}
              >
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Delete ${row.ticker}`}>
              <IconButton
                size="small"
                color="error"
                aria-label={`Delete ${row.ticker}`}
                onClick={() => setHoldingToDelete(row)}
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onEdit],
  );

  const confirmDelete = () => {
    if (holdingToDelete) {
      onDelete(holdingToDelete.id);
      setHoldingToDelete(null);
    }
  };

  return (
    <>
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          density="comfortable"
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          localeText={{
            noRowsLabel: "No holdings yet. Add one using the form above.",
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "action.hover",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            justifyContent: "space-between",
            borderTop: 1,
            borderColor: "divider",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total portfolio value
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatCurrency(totalValue)} ·{" "}
            {totalValue > 0 ? "100.0%" : "0.0%"}
          </Typography>
        </Stack>
      </Paper>

      <Dialog
        open={holdingToDelete !== null}
        onClose={() => setHoldingToDelete(null)}
        aria-labelledby="delete-holding-title"
        aria-describedby="delete-holding-description"
      >
        <DialogTitle id="delete-holding-title">
          Delete {holdingToDelete?.ticker}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-holding-description">
            This will remove {holdingToDelete?.name} from your portfolio. This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setHoldingToDelete(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete holding
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HoldingsTable;
