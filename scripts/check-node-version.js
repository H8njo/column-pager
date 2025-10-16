#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const requiredVersion = packageJson.engines.node;
const currentVersion = process.version;

function compareVersions(required, current) {
  // Remove 'v' prefix from current version
  current = current.replace('v', '');

  // Extract minimum version from required (e.g., ">=22.14.0" -> "22.14.0")
  const minVersion = required.replace(/[><=~^]/g, '').trim();

  const [currentMajor, currentMinor, currentPatch] = current.split('.').map(Number);
  const [minMajor, minMinor, minPatch] = minVersion.split('.').map(Number);

  if (currentMajor > minMajor) return true;
  if (currentMajor < minMajor) return false;

  if (currentMinor > minMinor) return true;
  if (currentMinor < minMinor) return false;

  return currentPatch >= minPatch;
}

if (!compareVersions(requiredVersion, currentVersion)) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Node.js version mismatch!');
  console.error('');
  console.error('  Required: \x1b[32m%s\x1b[0m', requiredVersion);
  console.error('  Current:  \x1b[31m%s\x1b[0m', currentVersion);
  console.error('');
  console.error('\x1b[33m%s\x1b[0m', '💡 To fix this:');
  console.error('');
  console.error('  \x1b[36m%s\x1b[0m', '# If using nvm:');
  console.error('  $ \x1b[32mnvm use\x1b[0m');
  console.error('');
  console.error('  \x1b[36m%s\x1b[0m', '# Or install the required version:');
  console.error('  $ \x1b[32mnvm install 22.14.0\x1b[0m');
  console.error('  $ \x1b[32mnvm use 22.14.0\x1b[0m');
  console.error('');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✅ Node.js version check passed!');
