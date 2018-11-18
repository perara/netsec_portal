import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcapAnalyzerComponent } from './pcap-analyzer.component';

describe('PcapAnalyzerComponent', () => {
  let component: PcapAnalyzerComponent;
  let fixture: ComponentFixture<PcapAnalyzerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcapAnalyzerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcapAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
