import { Component } from '@angular/core';
import { Resource } from '../../Interfaces/Interfaces';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { ConvertResponseToResourceArray } from '../../UtilityFunctions/UtilityFunction';
import { Router } from '@angular/router';
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
    DetailsModalComponent],
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

  detailsResource!: Resource;

  gridData: Array<Resource> = [];
  constructor(private httpAPIClientService: HttpAPIClientService, private router: Router, private toastr: ToastrService) { }

  deleteModalContent!: string;

  Log(param: any) {
    console.log("Hi");
    alert(param);
  }

  Sort(param: any) {
    console.log(param);
  }

  Filter(param: any) {
    console.log(param);
  }

  GetAllResourcesData() {
    this.loading = true;
    this.httpAPIClientService.GetResources().subscribe((response: any) => {
      console.log(response);
      if (response?.success) {
        this.gridData = ConvertResponseToResourceArray(response?.data);
        console.log(this.gridData);
        this.loading = false;
        // this.gridData = (ConvertResponseToResourceresponse.data as Array<Resource>);
      }
    });
  }

  ngOnInit() {
    this.GetAllResourcesData();
  }

  ngOnChanges() {
    // console.log("Grid Data", this.gridData);
  }

  EditResource(event: any, empId: number) {
    event.stopPropagation();
    this.router.navigate([`/Edit/${empId}`]);
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
    if(this.selectedKeys.length == 0) {
      this.toastr.warning('Please Select Resources', 'PDF');
    }
    const data = this.gridData.filter((rowData: any) => this.selectedKeys.includes(rowData?.empId));
    DownloadPdf(data);
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

  HandleModalEvent(modalResponse: {caller: string, value: boolean}) {
    if (modalResponse.value) {
      this.httpAPIClientService.DeleteMultipleResource(this.selectedKeys).subscribe((response: any) => {
        console.log('Deleted successfuly');
        this.GetAllResourcesData();
        this.toastr.success('Deleted successfully', 'Delete');
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
    // console.log("Selected Rows Data:", event.selectedRows.map((row: any) => row.dataItem));
  }

  OnAddResourceClick() {
    this.router.navigate(['/Add']);
  }

  GetDeleteTitle() {
    return 'Delete';
    return this.selectedKeys.length > 1 ? "Delete Multiple" : "Delete";
  }
}
