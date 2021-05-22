import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';
import { ObjectID } from 'bson-objectid';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, POLLING_INTERVAL, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import { ListWorkReport, WorkReport } from 'src/models/work-reports';

@Injectable({
  providedIn: 'root',
})
export class NewWorkReportGQL extends Mutation<WorkReport> {
  document = gql`
    mutation newWorkReport($customerId: ObjectId!, $description: String!, $projectId: ObjectId!) {
      newWorkReport(new: {customerId: $customerId, description: $description, projectId: $projectId}) {
        id
        status
        times {
          started
          ended
        }
        invoiced
        tripInfo {
          toCustomerStarted
          toCustomerArrived
          fromCustomerStarted
          fromCustomerArrived
        }
        description
        project {
          id
          description
          name
        }
        customer {
          id
          name
          identifier
          note
        }
      }
    }`;
}

@Injectable({
  providedIn: 'root',
})
export class ListWorkReportGQL extends Query<ListWorkReport> {
  document = gql`
  query listWorkReports($first: Int, $last: Int, $after: String, $before: String) {
    listWorkReports(first: $first, last: $last, after: $after, before: $before) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          id
          status
          times {
            started
            ended
          }
          invoiced
          tripInfo {
            toCustomerStarted
            toCustomerArrived
            fromCustomerStarted
            fromCustomerArrived
          }
          description
          project {
            id
            name
            description
            note
          }
          customer {
            id
            creator {
              id
              email
              username
              firstname
              lastname
              updated
              createdAt
            }
            projects {
              id
              name
            }
            name
            note
          }
        }
        cursor
      }
    }
  }`;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteWorkReportGQL extends Mutation<boolean> {
  document = gql`
    mutation deleteWorkReport($id: ObjectId!) {
      deleteWorkReport(id: $id)
    }`;
}

@Injectable({
  providedIn: 'root'
})
export class WorkReportService {

  constructor(
    private newWorkReportGQL: NewWorkReportGQL,
    private listWorkReportGQL: ListWorkReportGQL,
    private deleteWorkReportGQL: DeleteWorkReportGQL,
  ) { }

  newWorkReport(
    customerId: ObjectID,
    description: String,
    projectId: ObjectID,
    fromCustomerArrived?: Date,
    fromCustomerStarted?: Date,
    toCustomerArrived?: Date,
    toCustomerStarted?: Date,
  ): Observable<WorkReport> {
    return this.newWorkReportGQL.mutate({
      customerId,
      description,
      projectId,
      fromCustomerArrived,
      fromCustomerStarted,
      toCustomerArrived,
      toCustomerStarted,
    }).pipe(
      map(res => {
        return res.data;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );;
  }

  listWorkReports(first?: number, last?: number, after?: String, before?: String): Observable<ListWorkReport> {
    return this.listWorkReportGQL.watch({
      first,
      last,
      after,
      before,
    }, {
      nextFetchPolicy: FETCH_POLICY,
      pollInterval: POLLING_INTERVAL,
    }).valueChanges.pipe(
      map(res => {
        return res.data;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  updateWorkReport(id: ObjectID) {
    console.log("nto implemented");
  }

  deleteWorkReport(id: ObjectID) {
    return this.deleteWorkReportGQL.mutate({ id }).subscribe();
  }
}
