import "@turnkey/react-wallet-kit/styles.css";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "odometer/themes/odometer-theme-default.css";

createRoot(document.getElementById("root")!).render(<App />);
