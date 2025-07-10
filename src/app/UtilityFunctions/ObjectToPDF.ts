import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { elementAt } from "rxjs";

export function DownloadPdf(data: Array<any>): void {
    if (data.length === 0) return;

    const doc = new jsPDF();

    let columns: string[] = Object.keys(data[0]);
    const rows = data.map((obj: any) => {
        return columns.map(key => obj[key]);
    });
    columns = columns.map((element: string) => element.toUpperCase())


    autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 20,
        styles: { fontSize: 5 },
    });

    if (data.length > 1) {
        doc.save('resource-data.pdf');
    } else {
        const id = data[0]?.empId || 'single-record';
        doc.save(`${id}-details.pdf`);
    }
}
