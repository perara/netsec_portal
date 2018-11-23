import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcapUploaderComponent } from './pcap-uploader.component';

describe('PcapUploaderComponent', () => {
  let component: PcapUploaderComponent;
  let fixture: ComponentFixture<PcapUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcapUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcapUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
