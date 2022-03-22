import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Edge } from 'src/models/page-info';
import { WorkReport } from 'src/models/work-reports';
import { WorkReportService } from 'src/services/work-report/work-report.service';

export interface User {
  name: string;
}

@Component({
  selector: 'app-work-reports',
  templateUrl: './work-reports.component.html',
  styleUrls: ['./work-reports.component.scss'],
})
export class WorkReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'customer',
    'project',
    'description',
    'invoiced',
  ];
  workReports$: Observable<Edge<WorkReport>[]> = new Observable();

  range = new FormGroup({
    start: new FormControl(this.getLastWeek()),
    end: new FormControl(new Date()),
  });

  constructor(private workReportService: WorkReportService) {
    this.loadWorkReports();
    console.log();
  }

  ngOnInit() {
    this.range.valueChanges.pipe(
      map(() => {
        this.loadWorkReports();
      })
    );
  }

  loadWorkReports() {
    this.workReports$ = this.workReportService
      .workReports({
        startDate: this.range.get('start').value,
        endDate: this.range.get('end').value,
      })
      .pipe(
        map((workReports) => {
          console.log(JSON.stringify(workReports.workReports.edges, null, 2));
          return workReports.workReports.edges;
        })
      );
  }

  getLastWeek(): Date {
    let date = new Date();
    let lastDate = date.getDate() - (date.getDay() - 1) - 6;
    return new Date(date.setDate(lastDate));
  }
}
