/**
 * Utility to export an array of JSON objects to a CSV file in the browser.
 *
 * @param {Array<Object>} data - The array of objects to export.
 * @param {Array<{header: string, key: string | function}>} columns - The column definitions. 
 *                                      key can be a string (property name) or a function (row => value).
 * @param {string} filename - The desired output filename without extension (e.g., 'session_history').
 */
export const downloadCsv = (data, columns, filename = 'export') => {
    if (!data || !data.length) {
        console.warn("No data provided for CSV export.");
        return;
    }

    // 1. Generate Header Row
    const headerRow = columns.map(col => `"${col.header.replace(/"/g, '""')}"`).join(',');

    // 2. Generate Data Rows
    const dataRows = data.map(row => {
        return columns.map(col => {
            let value = typeof col.key === 'function' ? col.key(row) : row[col.key];

            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            } else {
                value = String(value);
            }

            // Escape quotes by doubling them up for CSV formatting, then wrap field in quotes
            return `"${value.replace(/"/g, '""')}"`;
        }).join(',');
    });

    // 3. Assemble full CSV string
    const csvContent = [headerRow, ...dataRows].join('\n');

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);

    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
