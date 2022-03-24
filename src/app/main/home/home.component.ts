import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map, retryWhen, delay, take } from 'rxjs/operators';
import { NewWorkReportComponent } from 'src/app/dialogs/new-work-report/new-work-report.component';
import { RETRY_DELAY, RETRY_COUNT } from 'src/app/graphql.module';
import { Edge } from 'src/models/page-info';
import {
  NewWorkReport,
  TimeRecordCommand,
  WorkReport,
} from 'src/models/work-reports';
import { AuthService } from 'src/services/auth/auth.service';
import { NewWorkReportGQL } from 'src/services/work-report/new-work-report.gql';
import { UpdateWorkReportGQL } from 'src/services/work-report/update-work-report.gql';
import { ListWorkReportGQL } from 'src/services/work-report/work-reports.gql';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'start-stop',
    'customer',
    'project',
    'description',
    'invoiced',
    'duration',
  ];
  workReports$: Observable<Edge<WorkReport>[]> = new Observable();

  newWorkReportSub$?: Subscription;
  dialogSub$?: Subscription;

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
    this.dialogSub$?.unsubscribe();
  }

  ngOnInit(): void {}

  todaysWorkReports() {
    this.workReports$ = this.listWorkReportGQL
      .watch(
        {
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
          pollInterval: 10000,
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

  getDuration(edge: Edge<WorkReport>): Date {
    let durMillisecs = 0;
    edge.node.timeRecords.forEach((tr) => {
      if (!tr.end) {
        durMillisecs +=
          new Date(Date.now()).getTime() - new Date(tr.start).getTime();
      } else {
        durMillisecs +=
          new Date(tr.end).getTime() - new Date(tr.start).getTime();
      }
    });
    return new Date(durMillisecs / 1000 / 60);
  }

  isTimeRecordActive(edge: Edge<WorkReport>): boolean {
    let active = false;
    edge.node.timeRecords.filter((tr) => {
      if (!tr.end) {
        active = true;
      }
    });
    return active;
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
            }),
            retryWhen((errors) =>
              errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
            )
          )
          .subscribe();
      });
  }

  startTimeRecord(workReportId: string) {
    this.updateWorkReportGQL
      .mutate({
        id: workReportId,
        timeRecordUpdate: {
          command: TimeRecordCommand.Start,
        },
      })
      .subscribe();
  }

  stopTimeRecord(workReportId: string) {
    this.updateWorkReportGQL
      .mutate({
        id: workReportId,
        timeRecordUpdate: {
          command: TimeRecordCommand.End,
        },
      })
      .subscribe();
  }
}
