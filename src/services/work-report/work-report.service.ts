import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import { ListWorkReport, WorkReport } from 'src/models/work-reports';
import { NewWorkReportGQL } from './new-work-report.gql';
import { ListWorkReportGQL } from './work-reports.gql';

@Injectable({
  providedIn: 'root',
})
export class DeleteWorkReportGQL extends Mutation<boolean> {
  document = gql`
    mutation deleteWorkReport($id: string!) {
      deleteWorkReport(id: $id)
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class WorkReportService {
  constructor(
    private newWorkReportGQL: NewWorkReportGQL,
    private listWorkReportGQL: ListWorkReportGQL,
    private deleteWorkReportGQL: DeleteWorkReportGQL
  ) {}

  newWorkReport(
    customerId: string,
    description: String,
    projectId: string
  ): Observable<WorkReport> {
    return this.newWorkReportGQL
      .mutate({
        customerId,
        description,
        projectId,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  workReports(options: {
    ids?: string[];
    startDate?: Date;
    endDate?: Date;
    first?: number;
    last?: number;
    after?: String;
    before?: String;
  }): Observable<ListWorkReport> {
    return this.listWorkReportGQL
      .watch(options, {
        nextFetchPolicy: FETCH_POLICY,
      })
      .valueChanges.pipe(
        map((res) => {
          return res.data;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  updateWorkReport(id: string) {
    console.log('not implemented');
  }

  deleteWorkReport(id: string) {
    return this.deleteWorkReportGQL.mutate({ id }).subscribe();
  }
}
