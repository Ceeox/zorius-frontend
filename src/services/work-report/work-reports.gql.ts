import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { ListWorkReport } from 'src/models/work-reports';

@Injectable({
  providedIn: 'root',
})
export class ListWorkReportGQL extends Query<ListWorkReport> {
  document = gql`
    query workReports(
      $ids: [UUID!]
      $start_date: NaiveDate
      $end_date: NaiveDate
      $first: Int
      $last: Int
      $after: String
      $before: String
    ) {
      workReports(
        options: {
          ids: $ids
          start_date: $start_date
          end_date: $end_date
          first: $first
          last: $last
          after: $after
          before: $before
        }
      ) {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
            id
            owner {
              id
              email
              name
              createdAt
              updatedAt
              deletedAt
            }
            customer {
              id
              name
              identifier
              note
              createdAt
              updatedAt
              deletedAt
            }
            project {
              id
              name
              note
              createdAt
              updatedAt
              deletedAt
            }
            timeRecords {
              start
              end
            }
            description
            invoiced
            createdAt
            updatedAt
          }
        }
      }
    }
  `;
}
