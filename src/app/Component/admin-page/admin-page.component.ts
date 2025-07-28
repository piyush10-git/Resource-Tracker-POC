import { Component } from '@angular/core';
import { ModalPopUpComponent } from '../modal-pop-up/modal-pop-up.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [ReactiveFormsModule, ModalPopUpComponent, NgSelectModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

  constructor() { }

  adminForm: FormGroup = new FormGroup({
    employeeId: new FormControl<number | null>(null),
    employeeName: new FormControl<string>(''),
    designation: new FormControl<number | null>(null),
    location: new FormControl<number | null>(null),
    skills: new FormControl<number[] | null>(null),
    project: new FormControl<number[] | null>(null),
    reportingTo: new FormControl<string>(''),
    billable: new FormControl<string>(''),
    ctedoj: new FormControl<string>(''),
    remarks: new FormControl<string>(''),
  });

  OnSubmitClick() {
    // Handle form submission logic here
    console.log('Form submitted');
  }

}
