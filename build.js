const builder = require('esbuild');
const { readFileSync, writeFileSync } = require('fs');

const exitFile = 'bin/index.js';

builder.build({
  entryPoints: ['./src/index.ts'],
  outfile: exitFile,
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
})
.catch(() => process.exit(1))