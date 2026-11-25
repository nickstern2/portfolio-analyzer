import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AppTheme from "./AppTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppTheme>
      <App />
    </AppTheme>
  </StrictMode>,
);
