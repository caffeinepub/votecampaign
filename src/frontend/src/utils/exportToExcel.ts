import * as XLSX from "xlsx";

/** Convert ICP bigint nanosecond timestamp to a human-readable string */
function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { formatTimestamp };

/**
 * Download a single-sheet .xlsx file.
 */
export function exportSheet(
  filename: string,
  sheetName: string,
  rows: Record<string, unknown>[],
): void {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

/**
 * Download a multi-sheet .xlsx file.
 */
export function exportMultiSheet(
  filename: string,
  sheets: { name: string; rows: Record<string, unknown>[] }[],
): void {
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const ws = XLSX.utils.json_to_sheet(sheet.rows);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  }
  XLSX.writeFile(wb, filename);
}
