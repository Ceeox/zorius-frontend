import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, retryWhen, delay, take } from 'rxjs/operators';
import { RETRY_DELAY, RETRY_COUNT } from 'src/app/graphql.module';
import { Edge } from 'src/models/page-info';
import { WorkReport } from 'src/models/work-reports';
import { AuthService } from 'src/services/auth/auth.service';
import { ListWorkReportGQL } from 'src/services/work-report/work-report.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'start-stop',
    'customer',
    'project',
    'description',
    'invoiced',
  ];
  workReports$: Observable<Edge<WorkReport>[]> = new Observable();

  constructor(
    private snackBar: MatSnackBar,
    public authService: AuthService,
    private listWorkReportGQL: ListWorkReportGQL
  ) {}

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

  newWorkReport() {
    this.snackBar.open('Not yet implemented', undefined, {
      duration: 5000,
    });
  }

  startTimeRecord() {
    this.snackBar.open('Not yet implemented', undefined, {
      duration: 5000,
    });
  }
}
