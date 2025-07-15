import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "@/router";
import { LinkProvider } from "@/context/LinkContext";
import "./index.css";
import { DialogProvider } from "./context/DialogContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LinkProvider>
      <DialogProvider>
        <Router />
      </DialogProvider>
    </LinkProvider>
  </React.StrictMode>
);
