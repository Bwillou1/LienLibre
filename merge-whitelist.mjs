#!/usr/bin/env node
// Usage: node merge-whitelist.mjs
// Lit canada_media_domains_direct_whitelist_recommended.txt et l'insère dans ALLOWED_DOMAINS de worker.js.
import fs from 'node:fs';

const workerPath = 'worker.js';
const listPath = 'canada_media_domains_direct_whitelist_recommended.txt';

let worker = fs.readFileSync(workerPath, 'utf8');
const domains = fs.readFileSync(listPath, 'utf8')
  .split(/\r?\n/)
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const match = worker.match(/const\s+ALLOWED_DOMAINS\s*=\s*\[([\s\S]*?)\n\];/);
if (!match) throw new Error('ALLOWED_DOMAINS introuvable dans worker.js');

const current = new Set([...match[1].matchAll(/"([a-zA-Z0-9.-]+)"/g)].map(m => m[1].toLowerCase().replace(/^www\./, '')));
const toAdd = domains.filter(domain => ![...current].some(ex => domain === ex || domain.endsWith('.' + ex)));

if (!toAdd.length) {
  console.log('Aucun nouveau domaine à ajouter.');
  process.exit(0);
}

const insertion = '\n  // Import canada_media_domains.txt — nettoyé/dédoublonné automatiquement\n' +
  '  // À auditer régulièrement pour éviter les domaines expirés ou rachetés.\n' +
  toAdd.map(d => `  "${d}",`).join('\n') + '\n';

worker = worker.replace(match[0], match[0].replace(match[1], match[1].trimEnd() + insertion));
fs.writeFileSync(workerPath, worker);
console.log(`${toAdd.length} domaines ajoutés à ALLOWED_DOMAINS dans worker.js`);
