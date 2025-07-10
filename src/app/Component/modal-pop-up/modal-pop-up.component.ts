import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-pop-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-pop-up.component.html',
  styleUrl: './modal-pop-up.component.css'
})
export class ModalPopUpComponent {
  // @Input() isVisible: boolean = false;
  // @Input('content') modalContent: string = '';
  // @Input('positive-content') positiveBtnContent: string = '';
  // @Input('negative-content') negativeBtnContent: string = '';
  // @Input('modal-header') modalHeader: string = '';
  // @Input('initiator') initiator: string = '';

  // @Output('modal-event-handler') modalEventEmitter = new EventEmitter<boolean>();

  // OnButtonClick(value: boolean) {
  //   this.modalEventEmitter.emit(value);
  // }

  @Input() isVisible: boolean = false;
  @Input('context') modalContext: any = {
    content: '',
    positiveBtnContent: '',
    negativeBtnContent: '',
    header: '',
    caller: '',
  };
  // @Input('content') modalContent: string = '';
  // @Input('positive-content') positiveBtnContent: string = '';
  // @Input('negative-content') negativeBtnContent: string = '';
  // @Input('modal-header') modalHeader: string = '';

  @Output('modal-event-handler') modalEventEmitter = new EventEmitter<{caller: string, value: boolean}>();

  OnButtonClick(value: boolean) {
    this.modalEventEmitter.emit({caller: this.modalContext.caller, value});
  }
}
