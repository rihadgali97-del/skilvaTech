/**
 * Converts an array of objects to a CSV string.
 * @param {Object[]} rows - Array of flat objects
 * @param {string[]} columns - Keys to include (in order)
 * @param {Object} headers - Optional display labels { key: 'Label' }
 * @returns {string} CSV string
 */
export const toCSV = (rows, columns, headers = {}) => {
  const headerRow = columns
    .map((col) => `"${headers[col] || col}"`)
    .join(',');

  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col] ?? '';
        // Escape quotes and wrap in quotes
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\r\n');
};

/**
 * Sends a CSV file as a download response.
 * @param {Response} res - Express response object
 * @param {string} csv - CSV string content
 * @param {string} filename - Filename for download (without .csv)
 */
export const sendCSV = (res, csv, filename) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
  // BOM for Excel UTF-8 compatibility
  res.send('\uFEFF' + csv);
};