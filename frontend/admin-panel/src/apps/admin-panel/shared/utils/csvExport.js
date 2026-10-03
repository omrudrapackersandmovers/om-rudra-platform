/**
 * Universal CSV Export Helper for Admin Panel
 * Handles escaping, UTF-8 BOM for MS Excel compatibility, and auto-download.
 */
export function exportToCsv(filename, columns, data) {
  if (!data || !data.length) {
    alert("No records available to export.");
    return;
  }

  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    // Escape double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerRow = columns.map((col) => escapeCell(col.header)).join(",");
  const dataRows = data.map((row) =>
    columns.map((col) => escapeCell(col.accessor(row))).join(",")
  );

  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
