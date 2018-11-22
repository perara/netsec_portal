import { TestBed } from '@angular/core/testing';

import { AppCommunicatorService } from './app-communicator.service';

describe('AppCommunicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppCommunicatorService = TestBed.get(AppCommunicatorService);
    expect(service).toBeTruthy();
  });
});
