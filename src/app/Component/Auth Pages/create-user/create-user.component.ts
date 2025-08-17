import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  @Input() userInfo: any;
  @Output() emitter = new EventEmitter<any>();

  OnButtonClick(val: boolean) {

  }

  OnCreateUserClicked() {
    
  }
}
