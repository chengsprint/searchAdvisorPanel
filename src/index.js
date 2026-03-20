// SearchAdvisor Runtime - Entry Point
// This file bootstraps the application

// Import core bundles
import './00-polyfill.js';
import './01-style.js';
import './02-react-bundle.js';

// Import and execute main app
import { initApp } from './app/legacy-main.js';

// Initialize the app
initApp();
