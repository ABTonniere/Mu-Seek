import { TestBed } from '@angular/core/testing';

import { ServerPOSTService } from './server-post.service';

describe('ServerPOSTService', () => {
  let service: ServerPOSTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerPOSTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
