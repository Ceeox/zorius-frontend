import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { WorkReport } from 'src/models/work-reports';
import { CustomersGQL } from 'src/services/customer/customers.gql';
import { ListWorkReportGQL } from 'src/services/work-report/work-reports.gql';

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
  customers$: Observable<Edge<Customer>[]> = new Observable();

  workReportsSub$: Subscription | undefined;
  customersSub$: Subscription | undefined;

  selectedCustomer?: Customer;

  dateRange = new FormGroup({
    start: new FormControl(this.getLastWeek()),
    end: new FormControl(new Date()),
  });
  workReports: WorkReport[] = [];
  filter: string = '';

  constructor(
    private listWorkReportGQL: ListWorkReportGQL,
    private customerGQL: CustomersGQL
  ) {
    this.loadWorkReports();
    this.loadCustomers();
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
    this.workReports$.subscribe(
      (result) => (this.workReports = result.map((e) => e.node))
    );
  }

  loadCustomers() {
    this.customers$ = this.customerGQL
      .watch(
        {},
        {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
          pollInterval: 60000,
        }
      )
      .valueChanges.pipe(
        map((res) => {
          return res.data.customers.edges;
        })
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

  setFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
  }
}
