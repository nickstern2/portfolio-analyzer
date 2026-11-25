import { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { Add, SaveOutlined } from "@mui/icons-material";
import {
  Controller,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import type { Holding, HoldingInput } from "../types/holding";

interface HoldingFormProps {
  holding: Holding | null;
  onAdd: (holding: HoldingInput) => void;
  onUpdate: (holding: Holding) => void;
  onCancel: () => void;
}

interface HoldingFormValues {
  ticker: string;
  name: string;
  value: string;
}

const emptyValues: HoldingFormValues = { ticker: "", name: "", value: "" };

const HoldingForm = ({
  holding,
  onAdd,
  onUpdate,
  onCancel,
}: HoldingFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HoldingFormValues>({
    defaultValues: holding
      ? {
          ticker: holding.ticker,
          name: holding.name,
          value: String(holding.value),
        }
      : emptyValues,
  });

  useEffect(() => {
    reset(
      holding
        ? {
            ticker: holding.ticker,
            name: holding.name,
            value: String(holding.value),
          }
        : emptyValues,
    );
  }, [holding, reset]);

  const onSubmit: SubmitHandler<HoldingFormValues> = (values) => {
    const updatedHolding = {
      ticker: values.ticker.trim().toUpperCase(),
      name: values.name.trim(),
      value: Number(values.value),
    };

    if (holding) {
      onUpdate({ id: holding.id, ...updatedHolding });
    } else {
      onAdd(updatedHolding);
      reset(emptyValues);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr 1fr" },
            gap: 2,
          }}
        >
          <Controller
            name="ticker"
            control={control}
            rules={{
              required: "Ticker is required.",
              validate: (value) =>
                value.trim().length > 0 || "Ticker is required.",
            }}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                inputRef={ref}
                label="Ticker"
                autoComplete="off"
                error={Boolean(errors.ticker)}
                helperText={errors.ticker?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required.",
              validate: (value) =>
                value.trim().length > 0 || "Name is required.",
            }}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                inputRef={ref}
                label="Name"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="value"
            control={control}
            rules={{
              required: "Value is required.",
              validate: (value) => {
                const amount = Number(value);
                return (
                  (value.trim() !== "" &&
                    Number.isFinite(amount) &&
                    amount >= 0) ||
                  "Enter a valid non-negative value."
                );
              },
            }}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                inputRef={ref}
                label="Value"
                type="number"
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                error={Boolean(errors.value)}
                helperText={errors.value?.message}
                fullWidth
              />
            )}
          />
        </Box>
        {Object.keys(errors).length > 0 && (
          <Alert severity="error">
            Please fix the highlighted fields before saving.
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end" }}
        >
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={holding ? <SaveOutlined /> : <Add />}
          >
            {holding ? "Save changes" : "Add holding"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HoldingForm;
