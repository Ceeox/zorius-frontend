import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewWorkReportComponent } from 'src/app/dialogs/new-work-report/new-work-report.component';

import { Edge } from 'src/models/page-info';
import {
  NewWorkReport,
  UpdateWorkReport,
  WorkReport,
} from 'src/models/work-reports';
import { AuthService } from 'src/services/auth/auth.service';
import { NewWorkReportGQL } from 'src/services/work-report/new-work-report.gql';
import { UpdateWorkReportGQL } from 'src/services/work-report/update-work-report.gql';
import { ListWorkReportGQL } from 'src/services/work-report/work-reports.gql';
import { TimeRecordEvent } from '../components/work-report-table/work-report-table.component';
import { UpdateWorkReportComponent } from '../dialogs/update-work-report/update-work-report.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  workReports$: Observable<WorkReport[]> = new Observable();

  newWorkReportSub$?: Subscription;
  updateWorkReportSub$?: Subscription;
  dialogSub$?: Subscription;

  workReports: WorkReport[] = [];
  filter: string = '';

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private listWorkReportGQL: ListWorkReportGQL,
    private newWorkReportGQL: NewWorkReportGQL,
    private updateWorkReportGQL: UpdateWorkReportGQL
  ) {
    this.todaysWorkReports();
  }
  ngOnDestroy(): void {
    this.newWorkReportSub$?.unsubscribe();
    this.updateWorkReportSub$?.unsubscribe();
    this.dialogSub$?.unsubscribe();
  }

  todaysWorkReports() {
    this.workReports$ = this.listWorkReportGQL
      .watch(
        {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
        {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
          pollInterval: 10000,
          errorPolicy: 'all',
        }
      )
      .valueChanges.pipe(
        map((res) => {
          return res.data.workReports.edges.map((e) => e.node);
        })
      );
    this.workReports$.subscribe((result) => (this.workReports = result));
  }

  newWorkReport() {
    const dialogRef = this.dialog.open(NewWorkReportComponent);

    this.dialogSub$ = dialogRef
      .afterClosed()
      .subscribe((result?: NewWorkReport) => {
        if (!result) return;

        this.newWorkReportSub$ = this.newWorkReportGQL
          .mutate(result)
          .pipe(
            map((res) => {
              return res.data;
            })
          )
          .subscribe(() => this.todaysWorkReports());
      });
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

  updateWorkReport(edge: Edge<WorkReport>) {
    const dialogRef = this.dialog.open(UpdateWorkReportComponent, {
      data: edge.node,
    });

    this.dialogSub$ = dialogRef
      .afterClosed()
      .subscribe((result?: UpdateWorkReport) => {
        if (!result) return;

        this.updateWorkReportSub$ = this.updateWorkReportGQL
          .mutate(result)
          .pipe(
            map((res) => {
              return res.data;
            })
          )
          .subscribe();
      });
  }

  setFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
  }
}
