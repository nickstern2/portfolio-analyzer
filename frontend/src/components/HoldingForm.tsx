import React, { useState, type FormEvent } from "react";
import type { Holding, HoldingInput } from "../types/holding";

interface HoldingFormProps {
  holding: Holding | null;
  onAdd: (holding: HoldingInput) => void;
  onUpdate: (holding: Holding) => void;
  onCancel: () => void;
}

const emptyDraft = { ticker: "", name: "", value: "" };

const HoldingForm: React.FC<HoldingFormProps> = ({
  holding,
  onAdd,
  onUpdate,
  onCancel,
}) => {
  const [draft, setDraft] = useState(() =>
    holding
      ? {
          ticker: holding.ticker,
          name: holding.name,
          value: String(holding.value),
        }
      : emptyDraft,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setDraft(emptyDraft);
    setFormError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ticker = draft.ticker.trim().toUpperCase();
    const name = draft.name.trim();
    const value = Number(draft.value);

    if (
      !ticker ||
      !name ||
      draft.value.trim() === "" ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      setFormError("Enter a ticker, name, and a valid non-negative value.");
      return;
    }

    if (holding) {
      onUpdate({ id: holding.id, ticker, name, value });
    } else {
      onAdd({ ticker, name, value });
      resetForm();
    }
  };

  return (
    <form className="holding-form" onSubmit={handleSubmit}>
      <div className="holding-field">
        <label htmlFor="holding-ticker">Ticker</label>
        <input
          id="holding-ticker"
          autoComplete="off"
          required
          value={draft.ticker}
          onChange={(event) =>
            setDraft({ ...draft, ticker: event.target.value })
          }
        />
      </div>
      <div className="holding-field">
        <label htmlFor="holding-name">Name</label>
        <input
          id="holding-name"
          required
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </div>
      <div className="holding-field">
        <label htmlFor="holding-value">Value</label>
        <input
          id="holding-value"
          type="number"
          min="0"
          step="0.01"
          required
          value={draft.value}
          onChange={(event) =>
            setDraft({ ...draft, value: event.target.value })
          }
        />
      </div>
      <div className="holding-form-actions">
        <button type="submit">{holding ? "Save changes" : "Add holding"}</button>
        {holding && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}
    </form>
  );
};

export default HoldingForm;
