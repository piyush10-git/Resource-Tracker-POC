import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-bulk-edit-comp',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './bulk-edit-comp.component.html',
  styleUrl: './bulk-edit-comp.component.css'
})
export class BulkEditCompComponent {
  @Input() isVisible: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() selectedResources: number[] = [];

  @Output() bulkEditResponseEmmiter: EventEmitter<any> = new EventEmitter<any>();

  isPreviewVisible: boolean = false;

  dropdownOptionsArrayObject: any;
  dropdownOptionsMapObject: any;

  constructor(private httpApiClient: HttpAPIClientService, private lookupService: LookupServiceService) { }

  ngOnInit() {
    this.lookupService.dropdownOptions$.subscribe((data: { dropdownOptionsArray: any, optionsMap: any }) => {
      if (data) {
        console.log('Dropdown options received:', data);
        // Assign the received data to the component properties
        this.dropdownOptionsArrayObject = data.dropdownOptionsArray;
        this.dropdownOptionsMapObject = data.optionsMap;
      }
    });
  }

  bulkEditForm: FormGroup = new FormGroup({
    designation: new FormControl<number | null>(null),
    location: new FormControl<number | null>(null),
    skills: new FormControl<number[] | null>(null),
    project: new FormControl<number[] | null>(null),
    reportingTo: new FormControl<string>(''),
    billable: new FormControl<string>(''),
    ctedoj: new FormControl<string>(''),
    remarks: new FormControl<string>(''),
  })

  fieldsEnabled: any = {
    designation: true,
    location: true,
    skills: true,
    project: true,
    reportingTo: true,
    billable: true,
    ctedoj: true,
    remarks: true,
  };

  applyBulkEdit() {
    const formValues = this.bulkEditForm.value;
    const selectedResourceIds = this.selectedResources;
    console.log('Applying bulk edit with values:', formValues, 'for resources:', selectedResourceIds);

    // Prepare the payload for the API call
    const payload = {
      resourceIds: selectedResourceIds,
      // feildsToEdit: {
      //   DesignationId: this.fieldsEnabled.designation ? formValues.designation : null,
      //   LocationId: this.fieldsEnabled.location ? formValues.location : null,
      //   SkillIds: this.fieldsEnabled.skills ? formValues.skills : null,
      //   ProjectIds: this.fieldsEnabled.project ? formValues.project : null,
      //   ReportingTo: this.fieldsEnabled.reportingTo ? formValues.reportingTo : null,
      //   billBillableable: this.fieldsEnabled.biilable ? formValues.billable : null,
      //   CteDoj: this.fieldsEnabled.ctedoj ? formValues.ctedoj !== '' ? formValues.ctedoj : null,
      //   Remarks: this.fieldsEnabled.remarks ? formValues.remarks : null,
      // }
      feildsToEdit: {
        DesignationId: formValues.designation,
        LocationId: formValues.location,
        SkillIds: formValues.skills,
        ProjectIds: formValues.project,
        ReportingTo: formValues.reportingTo,
        billBillableable: formValues.billable,
        CteDoj: formValues.ctedoj !== '' ? formValues.ctedoj : null,
        Remarks: formValues.ctedoj !== '' ? formValues.remarks : null,
      }
    };

    console.log(payload);
    

    // Call the API to apply bulk edit
    this.httpApiClient.BulkEditResources(payload).subscribe((response: any) => {
      if (response.success) {
        console.log('Bulk edit successful', response);
        this.isVisible = false; // Hide the bulk edit component
        this.bulkEditForm.reset(); // Reset the form
        this.fieldsEnabled = {
          designation: false,
          location: false,
          skills: false,
          project: false,
          reportingTo: false,
          billable: false,
          ctedoj: false,
          remarks: false,
        }; // Reset field enable states
        // Handle success, e.g., close the modal, refresh data, etc.
        this.bulkEditResponseEmmiter.emit({success: true, message: response.message});
      } else {
        console.error('Bulk edit failed', response);
        this.bulkEditResponseEmmiter.emit({success: false, message: response.message});
      }
    });
  }
}
