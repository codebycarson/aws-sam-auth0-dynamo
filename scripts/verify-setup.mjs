#!/usr/bin/env node

/**
 * Quick setup verification script
 * Checks that all packages are properly configured and can build
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';

const execAsync = promisify(exec);

const checks = [];
let passed = 0;
let failed = 0;

function check(name, fn) {
  checks.push({ name, fn });
}

async function runChecks() {
  console.log('🔍 Running setup verification...\n');

  for (const { name, fn } of checks) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    console.log('❌ Some checks failed. Please review the errors above.');
    process.exit(1);
  } else {
    console.log('✅ All checks passed! Your setup is ready.');
    process.exit(0);
  }
}

// Define checks
check('Package.json exists', async () => {
  await readFile('package.json', 'utf-8');
});

check('Workspace packages exist', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
  if (!pkg.workspaces || pkg.workspaces.length === 0) {
    throw new Error('No workspaces defined');
  }
});

check('API package configuration', async () => {
  const pkg = JSON.parse(await readFile('packages/api/package.json', 'utf-8'));
  if (!pkg.dependencies || !pkg.dependencies['hono']) {
    throw new Error('Hono dependency missing');
  }
});

check('Auth package configuration', async () => {
  const pkg = JSON.parse(await readFile('packages/auth/package.json', 'utf-8'));
  if (!pkg.dependencies || !pkg.dependencies['jose']) {
    throw new Error('Jose dependency missing');
  }
});

check('DB package configuration', async () => {
  const pkg = JSON.parse(await readFile('packages/db/package.json', 'utf-8'));
  if (!pkg.dependencies || !pkg.dependencies['@supabase/supabase-js']) {
    throw new Error('Supabase dependency missing');
  }
});

check('Environment template exists', async () => {
  await readFile('.env.example', 'utf-8');
});

check('Railway configuration exists', async () => {
  await readFile('railway.json', 'utf-8');
});

check('TypeScript config exists', async () => {
  await readFile('packages/api/tsconfig.json', 'utf-8');
});

check('Dependencies installed', async () => {
  try {
    await readFile('node_modules/.package-lock.json', 'utf-8');
  } catch {
    throw new Error('Run npm install first');
  }
});

check('API package builds', async () => {
  try {
    await execAsync('npm run build --workspace=packages/api', { 
      timeout: 30000 
    });
  } catch (error) {
    throw new Error(`Build failed: ${error.stderr || error.message}`);
  }
});

// Run all checks
runChecks().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
