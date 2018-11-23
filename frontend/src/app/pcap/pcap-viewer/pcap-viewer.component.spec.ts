import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcapViewerComponent } from './pcap-viewer.component';

describe('PcapViewerComponent', () => {
  let component: PcapViewerComponent;
  let fixture: ComponentFixture<PcapViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcapViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
