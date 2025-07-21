import { Component } from '@angular/core';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { ParseGetAllResourcesResponse } from '../../UtilityFunctions/MapingFunctions';
import { ModalPopUpComponent } from '../modal-pop-up/modal-pop-up.component';
import { FormsModule } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import {
  KENDO_GRID,
  KENDO_GRID_EXCEL_EXPORT,
  KENDO_GRID_PDF_EXPORT,
} from "@progress/kendo-angular-grid";
import { KENDO_TOOLBAR } from "@progress/kendo-angular-toolbar";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { process } from "@progress/kendo-data-query";
import { DetailsModalComponent } from '../details-modal/details-modal.component';
import { DownloadPdf } from '../../UtilityFunctions/ObjectToPDF';
import { ToastrService } from 'ngx-toastr';
import { AppStateServiceService } from '../../Services/app-state-service.service';
import { NavigationService } from '../../Services/navigation.service';
import { SelectEvent } from '@progress/kendo-angular-upload';
import * as XLSX from 'xlsx';
import { UploadModule } from '@progress/kendo-angular-upload';
import { CommonModule } from '@angular/common';
import { ConvertNameToIds } from '../../UtilityFunctions/ConvertStringsToIds';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { BulkEditCompComponent } from '../bulk-edit-comp/bulk-edit-comp.component';

@Component({
  selector: 'app-new-grid',
  standalone: true,
  imports: [FormsModule,
    KENDO_GRID_EXCEL_EXPORT,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID,
    KENDO_TOOLBAR,
    KENDO_LABELS,
    KENDO_INPUTS,
    ModalPopUpComponent,
    DetailsModalComponent,
    UploadModule, CommonModule, BulkEditCompComponent],
  templateUrl: './new-grid.component.html',
  styleUrl: './new-grid.component.css'
})
export class NewGridComponent {
  loading: boolean = false;
  requireSelectOrCtrlKeys: boolean = false;
  selectedKeys: any = [];

  deleteModalContext!: any;

  modalState: any = {
    deleteModalVisible: false,
    detailsModalVisible: false,
  };

  isBulkEditVisible: boolean = false;

  detailsResource!: any;

  gridData: any[] = [];
  constructor(private httpAPIClientService: HttpAPIClientService, private toastr: ToastrService, private appStateService: AppStateServiceService, private navogationService: NavigationService, private lookupService: LookupServiceService) { }

  deleteModalContent!: string;

  OnBulkEditClick() {
    if (this.selectedKeys.length < 2) { 
      this.toastr.warning('Please Select Resources', 'Bulk Edit');
      return;
    }
    this.isBulkEditVisible = !this.isBulkEditVisible;
  }

  HandleBulkEditResponse(event: any) {
    if (event.success) {
      this.toastr.success(event.message, 'Bulk Edit');
      this.isBulkEditVisible = false;
      this.GetAllResourcesData();
      this.selectedKeys = [];
      this.appStateService.SetData('selectedKeys', []);
    } else {
      this.toastr.error(event.message, 'Bulk Edit');
      this.isBulkEditVisible = false;
    }
  }

  GetAllResourcesData() {
    this.loading = true;
    this.httpAPIClientService.GetResources().subscribe((response: any) => {
      console.log(response);
      if (response?.success) {
        this.gridData = ParseGetAllResourcesResponse(response?.data);
        console.log(this.gridData);
        this.loading = false;
        // this.gridData = (ConvertResponseToResourceresponse.data as Array<Resource>);
      }
    });
  }
  dropdownOptionsMapObject: any = {};

  ngOnInit() {
    this.selectedKeys = this.appStateService.GetData('selectedKeys') || [];
    this.lookupService.dropdownOptions$.subscribe((data: { dropdownOptionsArray: any, optionsMap: any }) => {
      if (data) {
        this.dropdownOptionsMapObject = data.optionsMap;
      }
    });
    this.GetAllResourcesData();
  }

  EditResource(event: any, empId: number) {
    event.stopPropagation();
    // this.router.navigate([`/Edit/${empId}`]);
    this.navogationService.NavigateToTab(`/Edit/${empId}`);
  }

  ShowDetail(event: any, resource: any) {
    // console.log(resource);
    event.stopPropagation();
    this.detailsResource = resource;
    this.modalState.detailsModalVisible = true;
  }

  DownloadPDF(event: any, resource: any) {
    event.stopPropagation();
    DownloadPdf([resource]);
  }

  DownloadMultiSelectedPDF() {
    if (this.selectedKeys.length == 0) {
      this.toastr.warning('Please Select Resources', 'PDF');
    }
    const data = this.gridData.filter((rowData: any) => this.selectedKeys.includes(rowData?.empId));
    DownloadPdf(data);
    this.selectedKeys = [];
  }

  OnDeleteClick() {
    const length = this.selectedKeys.length;
    if (length == 0) {
      this.toastr.warning('Please Select Resources', 'Delete');
      return;
    }

    this.modalState.deleteModalVisible = true;
    const deleteModalContent = length > 1 ? `Are you sure you want to delete ${length} resources?` : 'Are you sure you want to delete the selected resource?';
    this.deleteModalContext = {
      content: deleteModalContent,
      positiveBtnContent: 'Yes',
      negativeBtnContent: 'No',
      header: '',
      caller: 'Resource-Grid',
    }

  }

  HandleDetailsModalEvent(value: boolean) {
    if (value) return;
    this.modalState.detailsModalVisible = false;
  }

  HandleModalEvent(modalResponse: { caller: string, value: boolean }) {
    if (modalResponse.value) {
      this.httpAPIClientService.DeleteMultipleResource(this.selectedKeys).subscribe((response: any) => {
        console.log('Deleted successfuly');
        this.GetAllResourcesData();
        this.toastr.success('Deleted successfully', 'Delete');
        this.selectedKeys = [];
        this.appStateService.SetData('selectedKeys', this.selectedKeys);
        this.modalState.deleteModalVisible = false;
      })
    }
    else {
      this.modalState.deleteModalVisible = false;
    }
  }

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridData, {
        sort: [{ field: "empId", dir: "asc" }],
      }).data,
    };
    console.log(result);

    return result;
  }

  onSelectionChange(event: any): void {
    const newLySelectedRows = event.selectedRows.map((row: any) => row.dataItem.empId);
    const newLyDeSelectedRows: Array<number> = event.deselectedRows.map((row: any) => row.dataItem.empId);

    this.selectedKeys = this.selectedKeys.filter((empId: number) => !newLyDeSelectedRows.includes(empId));

    newLySelectedRows.forEach((newLySelectedId: number) => {
      if (!this.selectedKeys.includes(newLySelectedId)) {
        this.selectedKeys.push(newLySelectedId);
      }
    })

    console.log(this.selectedKeys);
    // Update the app state service with the selected keys
    this.appStateService.SetData('selectedKeys', this.selectedKeys);
    // console.log("Selected Rows Data:", event.selectedRows.map((row: any) => row.dataItem));
  }

  OnAddResourceClick() {
    // this.router.navigate(['/Add']);
    this.navogationService.NavigateToTab('/Add');
  }

  GetDeleteTitle() {
    return 'Delete';
    return this.selectedKeys.length > 1 ? "Delete Multiple" : "Delete";
  }

  headers = ['empId', 'resourceName', 'designation', 'projectAllocation', 'technologySkill', 'location', 'emailId'];

  ExcelImport(event: SelectEvent): void {
    const file = event.files[0].rawFile;
    const reader = new FileReader();

    if (!file) {
      this.toastr.error('No file selected', 'Import Error');
      return;
    }

    const isCSV = file.name.toLowerCase().endsWith('.csv');

    reader.onload = (e: any) => {
      const content = e.target.result;
      const data: any[] = [];

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];

          if (char === '"' && insideQuotes && nextChar === '"') {
            current += '"';
            i++; // skip the next quote
          } else if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }

        result.push(current.trim());
        return result;
      };

      const mapRowToObject = (row: string[]): any => {
        if (row.length < 10) return null;

        return {
          resourceName: row[0],
          designation: this.dropdownOptionsMapObject['designations'][0].get(row[1]),
          reportingTo: row[2],
          billable: row[3].toLowerCase() === 'yes',
          technologySkill: ConvertNameToIds(this.dropdownOptionsMapObject['skills'][0], row[4]),
          projectAllocation: ConvertNameToIds(this.dropdownOptionsMapObject['projects'][0], row[5]),
          location: this.dropdownOptionsMapObject['locations'][0].get(row[6]),
          emailId: row[7],
          cteDoj: row[8],
          remarks: row[9]
        };
      };

      if (isCSV) {
        const lines = content.split(/\r?\n/).filter((l: any) => l.trim() !== '');
        const headers = parseCSVLine(lines[0]);

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length === headers.length) {
            const mapped = mapRowToObject(row);
            if (mapped) data.push(mapped);
          }
        }

        finalizeImport(data);
      } else {
        const wb = XLSX.read(content, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        for (let i = 1; i < raw.length; i++) {
          const row = raw[i];
          const mapped = mapRowToObject(row);
          if (mapped) data.push(mapped);
        }

        finalizeImport(data);
      }
    };

    const finalizeImport = (data: any[]) => {
      console.log('Imported structured data:', data);
      this.httpAPIClientService.ImportExcelData(data).subscribe((response: any) => {
        if (response?.success) {
          this.toastr.success('Data imported successfully', 'Import');
          this.GetAllResourcesData();
        } else {
          this.toastr.error('Failed to import data', 'Import Error');
        }
      }, (error) => {
        console.error('Import error:', error);
        this.toastr.error('Failed to import data', 'Import Error');
      })
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }


}
