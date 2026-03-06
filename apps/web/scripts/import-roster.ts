/**
 * Import roster from CSV to Supabase
 *
 * Usage:
 *   npx tsx apps/web/scripts/import-roster.ts [path-to-csv]
 *
 * CSV format (with header row):
 *   name,power,kills,deads,tier,role,notes
 *
 * Or minimal format:
 *   name,power
 *
 * Environment:
 *   NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY - Anon key (RLS allows inserts for leaders)
 *   OR SUPABASE_SERVICE_ROLE_KEY - Service role key (bypasses RLS)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Normalize rank to R1-R5 format
function normalizeRank(rank: string): string | null {
  if (!rank) return null;
  const trimmed = rank.trim();
  // Already in R format
  if (/^R[1-5]$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  // Plain number 1-5
  if (/^[1-5]$/.test(trimmed)) {
    return `R${trimmed}`;
  }
  // Unknown format, return as-is
  return trimmed;
}

interface RosterRow {
  governor_id?: number;
  name: string;
  power: number;
  kills?: number;
  alliance?: string;
  deads?: number;
  tier?: string;
  role?: string;
  notes?: string;
}

function parseCSV(content: string): RosterRow[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }

 const header = lines[0]
  .split(',')
  .map((h) => h.trim().toLowerCase());

const governorIdx = header.indexOf('governor id');
  
 const nameIdx =
  header.indexOf('name') !== -1
    ? header.indexOf('name')
    : header.indexOf('governor name');
  const powerIdx = header.indexOf('power');

  if (nameIdx === -1) {
    throw new Error('CSV must have a "name" column');
  }



  
const allianceIdx = header.indexOf('alliance');

  
const killsIdx = header.findIndex(h =>
  h.replace(/\s+/g, ' ').trim() === 'kp' ||
  h.replace(/\s+/g, ' ').trim() === 'total kp' ||
  h.includes('kill')
);
  const deadsIdx = header.indexOf('deads');
  const tierIdx = header.indexOf('tier');
  // Support both 'role' and 'rank' column names
  const roleIdx = header.indexOf('role') !== -1 ? header.indexOf('role') : header.indexOf('rank');
  const notesIdx = header.indexOf('notes');

console.log('NAME INDEX:', nameIdx);
console.log('KILLS INDEX:', killsIdx);
  const rows: RosterRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields
const values = line.split(',').map(v => v.trim());

    const name = values[nameIdx];
    if (!name) continue;

    const row: RosterRow = {
      name,
      power: powerIdx !== -1 ? parseInt(values[powerIdx], 10) || 0 : 0,
    };

    if (killsIdx !== -1 && values[killsIdx]) {
      row.kills = parseInt(values[killsIdx].replace(/[^0-9]/g, ''), 10) || 0;
    }
    if (deadsIdx !== -1 && values[deadsIdx]) {
      row.deads = parseInt(values[deadsIdx], 10) || 0;
    }
if (allianceIdx !== -1 && values[allianceIdx]) {
  row.alliance = values[allianceIdx];
}
    if (governorIdx !== -1 && values[governorIdx]) {
  row.governor_id = parseInt(values[governorIdx], 10);
}
    if (tierIdx !== -1 && values[tierIdx]) {
      row.tier = values[tierIdx];
    }
    if (roleIdx !== -1 && values[roleIdx]) {
      row.role = normalizeRank(values[roleIdx]) || undefined;
    }
    if (notesIdx !== -1 && values[notesIdx]) {
      row.notes = values[notesIdx];
    }

    rows.push(row);
  }

  return rows;
}

async function importRoster(csvPath: string) {
  console.log(`Reading CSV from: ${csvPath}`);

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  console.log(`Parsed ${rows.length} roster entries`);

  // remove invalid IDs
  const validRows = rows.filter(r => r.governor_id !== null && r.governor_id !== undefined);

  // normalize IDs to numbers first
  const normalizedRows = validRows.map(r => ({
    ...r,
    governor_id: Number(r.governor_id)
  }));

  // dedupe by governor_id
  const uniqueRows = [...new Map(
    normalizedRows.map(r => [r.governor_id, r])
  ).values()];

  console.log(`After dedupe: ${uniqueRows.length} unique governors`);

  const { data, error } = await supabase
    .from('alliance_roster')
    .upsert(
      uniqueRows.map((row) => ({
        governor_id: row.governor_id,
        name: row.name,
        power: row.power,
        kills: row.kills ?? 0,
        alliance: row.alliance ?? null,
        deads: row.deads ?? 0,
        tier: row.tier ?? null,
        role: row.role ?? null,
        notes: row.notes ?? null,
        is_active: true,
      })),
      { onConflict: 'alliance_roster_governor_id_unique' }
    )
    .select();

  if (error) {
    console.error('Error importing roster:', error);
    process.exit(1);
  }

  console.log(`Successfully imported/updated ${data?.length || 0} roster entries`);

  // Show summary by power
  const sorted = uniqueRows.sort((a, b) => b.power - a.power);

  console.log('\nTop 10 by power:');
  sorted.slice(0, 10).forEach((row, i) => {
    const powerM = (row.power / 1000000).toFixed(1);
    console.log(`  ${i + 1}. ${row.name}: ${powerM}M`);
  });
}

// Main
const csvPath = process.argv[2] || path.join(__dirname, '../data/roster.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  console.error('\nUsage: npx tsx apps/web/scripts/import-roster.ts [path-to-csv]');
  console.error('\nDefault location: apps/web/data/roster.csv');
  process.exit(1);
}

importRoster(csvPath);
