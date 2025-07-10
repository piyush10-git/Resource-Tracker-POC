import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Resource } from '../../Interfaces/Interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.css'
})
export class DetailsModalComponent {
  @Input() resource!: any;
  @Input() isVisible: boolean = false;
  @Output('modal-event') modalEventEmitter = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  ngOnChange() {
    console.log(this.resource);
  }

  OnButtonClick(value: boolean) {
    this.modalEventEmitter.emit(value);
  }

  OnEditClicked() {
    this.router.navigate([`/Edit/${this.resource?.empId}`]);
  }
}
