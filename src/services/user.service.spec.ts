/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserService } from './user.service';

describe('Service: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [UserService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
