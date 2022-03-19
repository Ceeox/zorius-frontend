/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectService } from './project.service';

describe('Service: Project', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [ProjectService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));
});
