import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileState, SelectEvent } from '@progress/kendo-angular-upload';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { ExcelDateToJSDate } from '../../UtilityFunctions/ExcelImport';
import { ConvertNameToIds } from '../../UtilityFunctions/ConvertStringsToIds';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { UploadModule } from '@progress/kendo-angular-upload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileProcessingState } from '../../Interfaces/Interfaces';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [UploadModule, CommonModule, FormsModule],
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.css']
})
export class ExcelImportComponent {
  @Input() isVisible = false;
  @Output() excelImportResponseEmitter = new EventEmitter<void>();

  fileList: FileProcessingState[] = [];
  dropdownOptionsMapObject: any = {};
  showErrorDetails = false;

  constructor(
    private httpService: HttpAPIClientService,
    private toastr: ToastrService,
    private lookupService: LookupServiceService
  ) { }

  ngOnInit(): void {
    this.lookupService.dropdownOptions$.subscribe((data) => {
      this.dropdownOptionsMapObject = data?.optionsMap || {};
    });
  }

  onFilesSelected(event: SelectEvent): void {
    const selected = event.files.map(f => f.rawFile).filter(Boolean) as File[];

    selected.forEach(file => {
      const fileState: FileProcessingState = {
        file,
        name: file.name,
        size: this.formatFileSize(file.size),
        progress: 0,
        parsedRows: [],
        headers: [],
        validationErrors: [],
        isReady: false
      };

      this.fileList.push(fileState);
      this.parseFile(fileState);
    });
  }

  parseFile(fileState: FileProcessingState) {
    const reader = new FileReader();
    const isCSV = fileState.name.toLowerCase().endsWith('.csv');

    reader.onload = (e: any) => {
      const content = e.target.result;
      let rows: any[][] = [];

      if (isCSV) {
        const lines = content.split(/\r?\n/).filter((l: any) => l.trim() !== '');
        rows = lines.map(this.parseCSVLine);
      } else {
        const wb = XLSX.read(content, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      }


      fileState.headers = rows[0];
      fileState.parsedRows = [];

      const totalRows = rows.length - 1;

      rows.slice(1).forEach((row, index) => {
        setTimeout(() => {
          if (row.every(cell => !cell || cell.trim?.() === '')) return;
          const mapped = this.mapRowToObject(row, isCSV);
          if (mapped) {
            fileState.parsedRows.push(mapped);
            // if (fileState.previewRows.length < 5) {
            //   fileState.previewRows.push(
            //     fileState.headers.reduce((obj: any, key, i) => {
            //       obj[key] = row[i];
            //       return obj;
            //     }, {})
            //   );
            // }
          } else {
            fileState.validationErrors.push(`Row ${index + 2}: Mapping failed.`);
          }
          fileState.progress = Math.round(((index + 1) / totalRows) * 100);
        }, 1000);
      });

      fileState.isReady = true;
    };

    if (isCSV) {
      reader.readAsText(fileState.file);
    } else {
      reader.readAsBinaryString(fileState.file);
    }
  }

  mapRowToObject(row: any[], isCSV: boolean): any {
    try {
      // Validate length of row (should have exactly 10 columns as per CSV)
      if (row.length < 10) return null;
      return {
        resourceName: row[0],
        designation: this.dropdownOptionsMapObject['designations']?.[0].get(row[1]),
        reportingTo: row[2],
        billable: row[3]?.toLowerCase() === 'yes',
        technologySkill: ConvertNameToIds(this.dropdownOptionsMapObject['skills']?.[0], row[4]),
        projectAllocation: ConvertNameToIds(this.dropdownOptionsMapObject['projects']?.[0], row[5]),
        location: this.dropdownOptionsMapObject['locations']?.[0].get(row[6]),
        emailId: row[7],
        cteDoj: isCSV ? row[8] : ExcelDateToJSDate(row[8]),
        remarks: row[9]
      };
    } catch (err) {
      console.error('Error mapping row:', row, err);
      return null;
    }
  }


  onManualUpload(): void {
    const allData = this.fileList.flatMap(f => f.parsedRows);
    if (allData.length === 0) {
      this.toastr.error('No valid data to import', 'Import Error');
      return;
    }

    this.httpService.ImportExcelData(allData).subscribe({
      next: (res) => {
        if (res?.success) {
          this.toastr.success('Data imported successfully', 'Import');
          this.OnButtonClick(false);
        } else {
          this.toastr.error('Backend rejected import', 'Import Failed');
        }
      },
      error: () => {
        this.toastr.error('Failed to import data', 'Import Error');
      }
    });
  }

  parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }


  OnButtonClick(isVisible: boolean) {
    this.isVisible = isVisible;
    if (!isVisible) {
      this.resetModal();
      this.excelImportResponseEmitter.emit();
    }
  }

  OnRemoveClick(fileName: string) {
    this.fileList.filter(filesState => filesState.name == fileName);
  }

  toggleErrorDetails() {
    this.showErrorDetails = !this.showErrorDetails;
  }

  resetModal(): void {
    this.fileList = [];
    this.showErrorDetails = false;
  }

  formatFileSize(size: number): string {
    return size < 1024
      ? `${size} B`
      : size < 1024 * 1024
        ? `${(size / 1024).toFixed(1)} KB`
        : `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
}
