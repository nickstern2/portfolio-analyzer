import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import type { Holding, HoldingInput } from "../types/holding";
import HoldingForm from "./HoldingForm";

interface HoldingDialogProps {
  open: boolean;
  holding: Holding | null;
  onAdd: (holding: HoldingInput) => void;
  onUpdate: (holding: Holding) => void;
  onClose: () => void;
}

const HoldingDialog = ({
  open,
  holding,
  onAdd,
  onUpdate,
  onClose,
}: HoldingDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    aria-labelledby="holding-dialog-title"
  >
    <DialogTitle id="holding-dialog-title">
      {holding ? "Edit holding" : "Add holding"}
    </DialogTitle>
    <DialogContent sx={{ p: 0 }}>
      <HoldingForm
        holding={holding}
        onAdd={(newHolding) => {
          onAdd(newHolding);
          onClose();
        }}
        onUpdate={(updatedHolding) => {
          onUpdate(updatedHolding);
          onClose();
        }}
        onCancel={onClose}
      />
    </DialogContent>
  </Dialog>
);

export default HoldingDialog;
