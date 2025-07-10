import { TestBed } from '@angular/core/testing';

import { HttpAPIClientService } from './http-api-client.service';

describe('HttpAPIClientService', () => {
  let service: HttpAPIClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAPIClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
