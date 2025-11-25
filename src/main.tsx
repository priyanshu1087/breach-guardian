import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Mouse glow effect tracker
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
  document.body.classList.add('mouse-active');
});

createRoot(document.getElementById("root")!).render(<App />);
