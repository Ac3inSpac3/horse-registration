// scripts/env.js

// Detects if the site is running under GitHub Pages or locally
export const BASE_PATH = window.location.pathname.includes("/horse-registration/")
    ? "/horse-registration"
    : "";
