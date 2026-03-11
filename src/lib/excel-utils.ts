import * as XLSX from "xlsx";

export function exportToExcel(data: any[], fileName: string, sheetName: string = "Sheet1") {
    // 1. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Set Column Widths Auto-Calculation
    const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(
            key.length,
            ...data.map(obj => obj[key]?.toString().length || 0)
        ) + 2
    }));
    worksheet['!cols'] = colWidths;

    // 3. Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Generate binary data
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // 5. Save using Blob
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
