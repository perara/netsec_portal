import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAnalysisToolsComponent } from './settings-analysis-tools.component';

describe('SettingsAnalysisToolsComponent', () => {
  let component: SettingsAnalysisToolsComponent;
  let fixture: ComponentFixture<SettingsAnalysisToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsAnalysisToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAnalysisToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
