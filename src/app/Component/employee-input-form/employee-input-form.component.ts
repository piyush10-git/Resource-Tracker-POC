import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Resource } from '../../Interfaces/Interfaces';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertResourceToRequest, ConvertResponseToResource } from '../../UtilityFunctions/UtilityFunction';
import { ModalPopUpComponent } from '../modal-pop-up/modal-pop-up.component';
import { emailExistsValidator } from '../Custom Validators/validators';
import { AppStateServiceService } from '../../Services/app-state-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalPopUpComponent],
  templateUrl: './employee-input-form.component.html',
  styleUrl: './employee-input-form.component.css'
})
export class EmployeeInputFormComponent {
  constructor(private httpApiClient: HttpAPIClientService, private router: Router, private activatedRoute: ActivatedRoute, private appStateService: AppStateServiceService, private toastr: ToastrService) { }

  displayModal: boolean = false;
  isEditMode = false;
  empId!: number;
  emailValidationLoading: boolean = false;
  currentMode!: string;

  modalState: any = {
    header: '',
    content: '',
    positiveContent: '',
    negativeContent: '',
  }

  intialEditState!: any;

  employeeForm: FormGroup = new FormGroup({
    resourceName: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    cteDoj: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),

    designation: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    billable: new FormControl('', [Validators.required]),

    technologySkill: new FormControl('', [Validators.required]),
    projectAllocation: new FormControl('', Validators.required),

    remarks: new FormControl(''),
  })

  ModalResponseMap: any;

  ngOnInit() {

    this.ModalResponseMap = {
      AddResetMode: {
        positive: this.ResetForm.bind(this),
        negative: this.ResetModal.bind(this),
      },
      EditResetMode: {
        positive: this.ResetForm.bind(this),
        negative: this.ResetModal.bind(this),
      },
      AddMode: {
        positive: this.OnFormSubmit.bind(this),
        negative: this.ResetModal.bind(this),
      },
      EditMode: {
        positive: this.OnFormSubmit.bind(this),
        negative: this.ResetModal.bind(this),
      },
    };

    const unsavedData = this.appStateService.GetData('Input-Form');
    if (unsavedData) {
      console.log(unsavedData);
      this.employeeForm.patchValue(unsavedData);
    }

    this.empId = +this.activatedRoute.snapshot.paramMap.get('empId')!;
    if (this.empId) {
      console.log(this.empId);

      this.isEditMode = true;
      this.httpApiClient.GetResourceById(this.empId).subscribe((response: any) => {
        console.log(response);
        if (response?.success) {
          let data = ConvertResponseToResource(response.data);
          this.employeeForm.patchValue(data);
          this.intialEditState = { ...data };
          this.employeeForm.controls['emailId'].addAsyncValidators(
            emailExistsValidator(
              this.httpApiClient,
              this.toastr,
              () => this.isEditMode,
              () => this.intialEditState.emailId,
              (isLoading: boolean) => this.emailValidationLoading = isLoading
            )
           
          );
           
          this.employeeForm.controls['emailId'].updateValueAndValidity({ onlySelf: true });
        }
      })
    } else {
      this.isEditMode = false;
      this.employeeForm.controls['emailId'].addAsyncValidators(
        emailExistsValidator(
          this.httpApiClient,
          this.toastr,
          () => this.isEditMode,
          () => '',
          (isLoading: boolean) => this.emailValidationLoading = isLoading
        )
      );
      this.employeeForm.controls['emailId'].updateValueAndValidity({ onlySelf: true });
    }
  }

  ngOnDestroy() {
    if (this.isEditMode) {
      this.appStateService.DeleteData('Input-Form');
    } else {
      this.appStateService.SetData('Input-Form', this.employeeForm.value);
    }

  }

  OnFormSubmit = () => {
    let requestBody = ConvertResourceToRequest(this.employeeForm.value);

    if (!this.isEditMode) {
      // Edit Mode
      console.log(requestBody);
      this.httpApiClient.CreateResource(requestBody).subscribe((response: any) => {
        console.log(response);
        if (response?.success) {
          this.toastr.success('Resource Added successfully', 'Add');
          console.log(response);
          this.employeeForm.reset();
          this.router.navigate(['/Resource-Grid']);
        }
      });
    } else {
      // Add Mode
      requestBody['empId'] = this.empId;
      console.log(requestBody);
      this.httpApiClient.UpdateResource(requestBody).subscribe((response: any) => {
        console.log(response);
        if (response?.success) {
          this.toastr.success('Resource updated successfully', 'Update');
          this.employeeForm.reset();
          this.router.navigate(['/Resource-Grid']);
        }
      });
    }
  }


  ResetForm = () => {
    if (this.isEditMode) {
      this.employeeForm.patchValue(this.intialEditState);
    } else {
      this.employeeForm.reset();
    }
  }

  HandleModalEvent(modalResponse: { caller: string, value: boolean }) {
    console.log(modalResponse.caller);
    if (modalResponse.value) {
      this.ModalResponseMap[modalResponse.caller].positive();
    } else {
      this.ModalResponseMap[modalResponse.caller].negative();
    }
    this.ResetModal();
    // this.displayModal = false;
  }

  getValidation(controlName: string, Validators: Array<string>) {
    let formControl = this.employeeForm.controls?.[controlName];
    if (!formControl.dirty && !formControl.touched) {
      return false;
    }
    for (let validator of Validators) {
      if (formControl?.errors?.[validator]) {
        return true;
      }
    }
    return false;
  }

  modalContext!: any;

  ResetModal = () => {
    this.displayModal = false;
  }

modalContextMap: any = {
  AddResetMode: {
    content: 'Do you want to clear the form and discard all changes?',
    positiveBtnContent: 'Clear Form',
    negativeBtnContent: 'Cancel',
    header: 'Confirm Action',
    caller: 'AddResetMode',
  },
  EditResetMode: {
    content: 'Do you want to reset the changes made to the form?',
    positiveBtnContent: 'Reset Changes',
    negativeBtnContent: 'Cancel',
    header: 'Confirm Action',
    caller: 'EditResetMode',
  },
  AddMode: {
    content: 'Are you sure you want to submit this form?',
    positiveBtnContent: 'Submit',
    negativeBtnContent: 'Cancel',
    header: 'Confirm Submission',
    caller: 'AddMode',
  },
  EditMode: {
    content: 'Do you want to update the resource details with the changes made?',
    positiveBtnContent: 'Update',
    negativeBtnContent: 'Cancel',
    header: 'Confirm Update',
    caller: 'EditMode',
  }
};


  // SetModalValues(mode: string) {
  //   this.modalState.header = this.headerMap[mode];
  // }

  // GetModalHeader() {
  //   return this.isEditMode ? "Are you sure you want to reset changes?" : "Are you sure you want to clear the form?";
  // }

  // GetModalContent() {
  //   return '';
  //   return this.isEditMode ? "All unsaved updates will be discarded and the original values will be restored." : "All entered information will be lost.";
  // }

  GetPositiveContent() {
    return this.isEditMode ? "Yes, discard changes" : "Yes, reset";
  }

  GetStylesClass() {
    let style = "btn primary";
    style += (this.employeeForm.valid ? "" : " disable");
    return style;
  }

  OnResetClick() {
    this.displayModal = true;
    const currentMode = this.isEditMode ? 'EditResetMode' : 'AddResetMode';
    this.modalContext = this.modalContextMap[currentMode];
  }

  OnSubmitClick() {
    if (!this.employeeForm.valid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.displayModal = true;
    const currentMode = this.isEditMode ? 'EditMode' : 'AddMode';
    this.modalContext = this.modalContextMap[currentMode];
  }

} 