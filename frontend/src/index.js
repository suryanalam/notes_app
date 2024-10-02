import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/main.css";

import App from "./App";
import { CommonProvider } from "./contexts/CommonContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CommonProvider>
        <App />
      </CommonProvider>
    </BrowserRouter>
  </React.StrictMode>
);
