import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap-icons/font/bootstrap-icons.css";
import './firebase';

const rootElement = document.getElementById('root');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
