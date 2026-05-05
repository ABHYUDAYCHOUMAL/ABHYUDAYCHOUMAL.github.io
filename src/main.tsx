import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Note: StrictMode intentionally disabled.
// React-Three-Fiber's <Canvas> doesn't handle StrictMode's double-mount
// well in dev — each remount leaks a WebGL context, and after a few you
// hit the browser's per-page context cap and get "Context Lost" errors
// (the canvas goes blank/white). Production builds don't double-mount,
// so this only matters in dev. Tradeoff: we lose StrictMode's double-
// effect bug-finding warnings.
createRoot(document.getElementById("root")!).render(<App />);