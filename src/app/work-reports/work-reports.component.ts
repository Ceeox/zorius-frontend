import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable, Subscription } from 'rxjs';
import { delay, map, retryWhen, startWith, take } from 'rxjs/operators';
import { Edge } from 'src/models/page-info';
import { WorkReport } from 'src/models/work-reports';
import { AuthService } from 'src/services/auth/auth.service';
import { WorkReportService } from 'src/services/work-report/work-report.service';
import { ListWorkReportGQL } from 'src/services/work-report/work-reports.gql';
import { RETRY_DELAY, RETRY_COUNT } from '../graphql.module';

export interface User {
  name: string;
}

@Component({
  selector: 'app-work-reports',
  templateUrl: './work-reports.component.html',
  styleUrls: ['./work-reports.component.scss'],
})
export class WorkReportsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'customer',
    'project',
    'description',
    'invoiced',
  ];
  workReports$: Observable<Edge<WorkReport>[]> = new Observable();

  workReportsSub$: Subscription | undefined;

  range = new FormGroup({
    start: new FormControl(this.getLastWeek()),
    end: new FormControl(new Date()),
  });

  constructor(private listWorkReportGQL: ListWorkReportGQL) {
    this.loadWorkReports();
  }

  ngOnInit() {
    this.range.valueChanges.pipe(
      map(() => {
        this.loadWorkReports();
      })
    );
  }

  ngOnDestroy(): void {
    this.workReportsSub$?.unsubscribe();
  }

  loadWorkReports() {
    this.workReports$ = this.listWorkReportGQL
      .watch(
        {
          startDate: this.range.get('start').value,
          endDate: this.range.get('end').value,
        },
        {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
          pollInterval: 60000,
        }
      )
      .valueChanges.pipe(
        map((res) => {
          return res.data.workReports.edges;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  getLastWeek(): Date {
    let date = new Date();
    let lastDate = date.getDate() - (date.getDay() - 1) - 6;
    return new Date(date.setDate(lastDate));
  }
}
