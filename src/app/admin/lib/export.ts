'use client';

export type ExportFormat = 'csv' | 'xlsx';

type ExportRowsOptions = {
  rows: Record<string, unknown>[];
  filename: string;
  format: ExportFormat;
};

function downloadFile(filename: string, data: BlobPart, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function exportRows({ rows, filename, format }: ExportRowsOptions) {
  if (!rows.length) {
    throw new Error('No data available for export.');
  }

  const XLSX = await import('xlsx');
  const worksheet = XLSX.utils.json_to_sheet(rows);

  if (format === 'csv') {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile(`${filename}.csv`, csv, 'text/csv;charset=utf-8;');
    return;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  downloadFile(
    `${filename}.xlsx`,
    buffer,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

