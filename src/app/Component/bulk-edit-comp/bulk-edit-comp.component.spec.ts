import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEditCompComponent } from './bulk-edit-comp.component';

describe('BulkEditCompComponent', () => {
  let component: BulkEditCompComponent;
  let fixture: ComponentFixture<BulkEditCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEditCompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkEditCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
