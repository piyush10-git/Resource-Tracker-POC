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
import { UploadModule } from '@progress/kendo-angular-upload';
import { CommonModule } from '@angular/common';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { BulkEditCompComponent } from '../bulk-edit-comp/bulk-edit-comp.component';
import { ExcelImportComponent } from '../excel-import/excel-import.component';

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
    UploadModule, CommonModule, BulkEditCompComponent, ExcelImportComponent],
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
    importDataModal: false,
    createUserModal: false,
  };

  isBulkEditVisible: boolean = false;

  detailsResource!: any;

  gridData: any[] = [];
  constructor(private httpAPIClientService: HttpAPIClientService, private toastr: ToastrService, private appStateService: AppStateServiceService, private navogationService: NavigationService, private lookupService: LookupServiceService) { }

  deleteModalContent!: string;

  OnBulkEditClick() {
    if (this.selectedKeys.length < 2) {
      this.toastr.warning('Please Select Resources', 'Bulk Edit');
      this.isBulkEditVisible = false;
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
    }
  }

  GetAllResourcesData() {
    this.loading = true;
    this.httpAPIClientService.GetResources().subscribe({
      next: (gridData: any) => {
        this.gridData = gridData;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => { this.loading = false; }
    });
  }
  // dropdownOptionsMapObject: any = {};

  ngOnInit() {
    this.selectedKeys = this.appStateService.GetData('selectedKeys') || [];
    this.GetAllResourcesData();
  }

  EditResource(event: any, empId: number) {
    event.stopPropagation();
    this.navogationService.NavigateToTab(`/Edit/${empId}`);
  }

  ShowDetail(event: any, resource: any) {
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

      this.httpAPIClientService.DeleteMultipleResource(this.selectedKeys).subscribe({
        next: (response: any) => {
          this.GetAllResourcesData();
          this.toastr.success('Deleted successfully', 'Delete');
          this.selectedKeys = [];
          this.appStateService.SetData('selectedKeys', this.selectedKeys);
          this.modalState.deleteModalVisible = false;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
    else {
      this.modalState.deleteModalVisible = false;
    }
  }

  OnImportDataClick() {
    this.modalState.importDataModal = !this.modalState.importDataModal;
  }
  HandleDataImportEmitter() {
    this.GetAllResourcesData();
    this.modalState.importDataModal = false;
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

    // console.log(this.selectedKeys);
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
}
