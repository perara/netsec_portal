import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForensicsComponent } from './forensics.component';

describe('ForensicsComponent', () => {
  let component: ForensicsComponent;
  let fixture: ComponentFixture<ForensicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForensicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForensicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
