import * as XLSX from 'xlsx';

export function onFileChange(event: any): any[] | undefined {
    let data: any[] = [];
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Cannot use multiple files');
      return;
    }

    const file: File = target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Assume you want the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert to array of objects
      data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data);
    };

    reader.readAsBinaryString(file);

    return data;
  }