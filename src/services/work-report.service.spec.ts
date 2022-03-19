/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkReportService } from './work-report.service';

describe('Service: WorkReports', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [WorkReportService],
    teardown: { destroyAfterEach: false }
});
  });

  it('should ...', inject([WorkReportService], (service: WorkReportService) => {
    expect(service).toBeTruthy();
  }));
});
