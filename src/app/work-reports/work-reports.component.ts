import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { WorkReport } from 'src/models/work-reports';
import { UpdateWorkReportGQL } from 'src/services/work-report/update-work-report.gql';
import { ListWorkReportGQL } from 'src/services/work-report/work-reports.gql';
import { TimeRecordEvent } from '../components/work-report-table/work-report-table.component';

export interface User {
  name: string;
}

@Component({
  selector: 'app-work-reports',
  templateUrl: './work-reports.component.html',
  styleUrls: ['./work-reports.component.scss'],
})
export class WorkReportsComponent implements OnInit, OnDestroy {
  workReports$: Observable<Edge<WorkReport>[]> = new Observable();
  customers$: Observable<Edge<Customer>[]> = new Observable();

  workReportsSub$: Subscription | undefined;
  customersSub$: Subscription | undefined;

  selectedCustomer?: Customer;
  workReports: WorkReport[] = [];

  dateRange = new FormGroup({
    start: new FormControl(this.getLastWeek()),
    end: new FormControl(new Date()),
  });
  filter: string = '';

  constructor(
    private listWorkReportGQL: ListWorkReportGQL,
    private updateWorkReportGQL: UpdateWorkReportGQL
  ) {
    this.loadWorkReports();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.workReportsSub$?.unsubscribe();
    this.customersSub$?.unsubscribe();
  }

  loadWorkReports(forCustomerId?: string) {
    let start: Date = this.dateRange.get('start').value;
    let end: Date = this.dateRange.get('end').value;
    this.workReports$ = this.listWorkReportGQL
      .watch(
        {
          startDate: this.utcDate(start).toISOString().split('T')[0],
          endDate: this.utcDate(end).toISOString().split('T')[0],
          forCustomerId,
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
        })
      );
    this.workReportsSub$ = this.workReports$.subscribe(
      (result) => (this.workReports = result.map((e) => e.node))
    );
  }

  customerSelected(event: MatSelectChange) {
    this.loadWorkReports(event.value?.id);
  }

  getLastWeek(): Date {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  utcDate(date: Date): Date {
    var now_utc = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );

    return new Date(now_utc);
  }

  onTimeRecord(event: TimeRecordEvent) {
    this.updateWorkReportGQL
      .mutate({
        id: event.workReportId,
        timeRecordUpdate: {
          command: event.command,
        },
      })
      .subscribe();
  }

  setFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
  }
}
