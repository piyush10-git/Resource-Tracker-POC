import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiResoponse } from '../../Interfaces/Interfaces';

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

  @Output() bulkEditResponseEmmiter = new EventEmitter<any>();
  @Output() bulkEditModalToggleEmmiter = new EventEmitter<void>();

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
    reportingToId: new FormControl<number | null>(null),
    billable: new FormControl<string | null>(null),
    ctedoj: new FormControl<string>(''),
    remarks: new FormControl<string>(''),
  })

  ApplyBulkEdit() {
    const formValues = this.bulkEditForm.value;
    const selectedResourceIds = this.selectedResources;
    console.log('Applying bulk edit with values:', formValues, 'for resources:', selectedResourceIds);

    // Prepare the payload for the API call
    const payload = {
      resourceIds: selectedResourceIds,
      feildsToEdit: {
        DesignationId: formValues.designation,
        LocationId: formValues.location,
        SkillIds: formValues.skills,
        ProjectIds: formValues.project,
        reportingToId: formValues.reportingToId,
        billable: formValues.billable ? formValues.billable == 'Yes' : null,
        CteDoj: formValues.ctedoj !== '' ? formValues.ctedoj : null,
        Remarks: formValues.ctedoj !== '' ? formValues.remarks : null,
      }
    };

    console.log(payload);
    // Call the API to apply bulk edit
    this.httpApiClient.BulkEditResources(payload).subscribe({
      next: (response: ApiResoponse) => {
        if (response.success) {
          console.log('Bulk edit successful', response);
          this.isVisible = false;
          this.bulkEditForm.reset();
        }
        this.bulkEditResponseEmmiter.emit({ success: true, message: response.message });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  OnCancelClick() {
    this.bulkEditModalToggleEmmiter.emit();
  }
}
