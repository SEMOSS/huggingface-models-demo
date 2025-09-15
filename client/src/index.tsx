import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Env, InsightProvider } from "@semoss/sdk/react";
import { Router } from "./pages/Router";
import { initializeMobX } from "./stores/mobx-config";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (typeof window !== "undefined") {
  initializeMobX();
}

if (process.env.NODE_ENV !== "production") {
  Env.update({
    MODULE: process.env.MODULE || "",
    ACCESS_KEY: process.env.ACCESS_KEY || "",
    SECRET_KEY: process.env.SECRET_KEY || "",
  });
}

root.render(
  <React.StrictMode>
    <InsightProvider>
      <Router />
    </InsightProvider>
  </React.StrictMode>
);
