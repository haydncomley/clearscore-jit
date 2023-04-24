const builder = require('esbuild');
const { readFileSync, writeFileSync, existsSync, rmSync, cpSync } = require('fs');
const path = require('path');

const exitFile = 'bin/index.js';
const rebaseScript = 'rebaseScript.sh';

builder.build({
  entryPoints: ['./src/index.ts', './src/lib/core/rebase.ts'],
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

  if (existsSync(path.join('bin/lib/core', rebaseScript))) rmSync(path.join('bin/lib/core', rebaseScript));
  cpSync(path.join('src/lib/core', rebaseScript), path.join('bin/lib/core', rebaseScript));
})
.catch(() => process.exit(1))