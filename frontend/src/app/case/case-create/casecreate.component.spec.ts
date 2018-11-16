import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCreateComponent } from './case-create.component';

describe('CaseCreateComponent', () => {
  let component: CaseCreateComponent;
  let fixture: ComponentFixture<CaseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
