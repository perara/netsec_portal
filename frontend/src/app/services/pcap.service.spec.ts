import { TestBed } from '@angular/core/testing';

import { PcapService } from './pcap.service';

describe('PcapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PcapService = TestBed.get(PcapService);
    expect(service).toBeTruthy();
  });
});
