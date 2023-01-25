const builder = require('esbuild');
const { readFileSync, writeFileSync, existsSync, rmSync, cpSync } = require('fs');
const path = require('path');

const exitFile = 'bin/index.js';
const rebaseScript = 'rebaseScript.sh';

builder.build({
  entryPoints: ['./src/index.ts', './src/rebase.ts'],
  outdir: 'bin',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: false,
  target: 'node16',
  plugins: []
})
.then(() => {
  const code = readFileSync(exitFile);
  writeFileSync(exitFile, '#! /usr/bin/env node\n' + code);

  if (existsSync(path.join('bin', rebaseScript))) rmSync(path.join('bin', rebaseScript));
  cpSync(path.join('src', rebaseScript), path.join('bin', rebaseScript));
})
.catch(() => process.exit(1))