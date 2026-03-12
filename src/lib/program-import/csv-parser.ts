import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system/legacy';
import { REQUIRED_COLUMNS } from './constants';
import type { ImportError } from './types';

export interface RawParseResult {
  rows: Record<string, string>[];
  errors: ImportError[];
}

/**
 * Read a CSV file URI (from expo-document-picker) and parse with papaparse.
 * Returns normalized row objects and any structural parse errors.
 */
export async function parseCsvFile(fileUri: string): Promise<RawParseResult> {
  const content = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const errors: ImportError[] = [];

  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) =>
      header.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  // Collect papaparse errors
  for (const err of result.errors) {
    errors.push({
      row: (err.row ?? 0) + 2, // +2: header=1, 0-indexed→1-indexed
      message: `CSV parse error: ${err.message}`,
      severity: 'error',
    });
  }

  // Validate required columns exist
  const headers = result.meta.fields ?? [];
  for (const col of REQUIRED_COLUMNS) {
    if (!headers.includes(col)) {
      errors.push({
        row: 0,
        column: col,
        message: `Missing required column: "${col}"`,
        severity: 'error',
      });
    }
  }

  return { rows: result.data, errors };
}
