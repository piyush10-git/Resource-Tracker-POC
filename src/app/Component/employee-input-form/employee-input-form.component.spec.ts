import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInputFormComponent } from './employee-input-form.component';

describe('EmployeeInputFormComponent', () => {
  let component: EmployeeInputFormComponent;
  let fixture: ComponentFixture<EmployeeInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeInputFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
