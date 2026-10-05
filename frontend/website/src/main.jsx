import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/sora'
import './index.css'
import App from './App.jsx'
import { printConsoleGreeting } from './utils/consoleGreeting.js'

printConsoleGreeting();

const application = (
  <StrictMode>
    <App />
  </StrictMode>
)
const root = document.getElementById('root');
// Query-driven forms/search render fresh state; all other routes hydrate their build HTML.
if (root.hasChildNodes() && root.dataset.staticPath === window.location.pathname && !window.location.search) hydrateRoot(root, application);
else {
  document.head.querySelectorAll('[data-static-meta]').forEach(node => node.remove());
  createRoot(root).render(application);
}
