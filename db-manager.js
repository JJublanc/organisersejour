#!/usr/bin/env node

/**
 * Wrapper script for frontend/scripts/db-manager.js
 * This allows running the script from the root directory
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the path to the actual script
const scriptPath = path.join(__dirname, 'frontend', 'scripts', 'db-manager.js');

// Forward all arguments to the actual script
const args = process.argv.slice(2);

// Set the working directory to the frontend directory
const options = {
  stdio: 'inherit', // This will pipe stdin/stdout/stderr to the parent process
  cwd: path.join(__dirname, 'frontend') // Set working directory to frontend
};

// Spawn the actual script with all arguments
const child = spawn('node', [scriptPath, ...args], options);

// Handle exit
child.on('exit', (code) => {
  process.exit(code);
});