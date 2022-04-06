import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WorkReportService } from 'src/services/work-report/work-report.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WorkReport } from 'src/models/work-reports';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  workReport$: Observable<WorkReport>;
  workReport?: WorkReport;
  workReportId: string;

  timeRecordsForm = new FormArray([]);
  workReportForm = new FormGroup({
    description: new FormControl('', Validators.required),
    timeRecords: this.timeRecordsForm,
  });

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private workReportService: WorkReportService
  ) {
    this.workReportId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadWorkReport();
  }

  loadWorkReport() {
    this.workReport$ = this.workReportService
      .workReports({ ids: [this.workReportId] })
      .pipe(
        map(
          (result) =>
            result.workReports.edges
              .map((e) => e.node)
              .filter((e) => e.id === this.workReportId)[0]
        )
      );

    this.workReport$.subscribe((workReport) => {
      this.workReport = workReport;
      this.timeRecordsForm.clear();
      workReport.timeRecords.map((tr) => {
        const newGroup = new FormGroup({
          start: new FormControl(tr.start, Validators.required),
          end: new FormControl(tr.end, Validators.required),
        });
        this.timeRecordsForm.push(newGroup);
      });
      this.workReportForm.setValue({
        description: workReport.description,
      });
    });
  }

  back(): void {
    this.location.back();
  }
}
