import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { WorkReport } from 'src/models/work-reports';

@Injectable({
  providedIn: 'root',
})
export class NewWorkReportGQL extends Mutation<WorkReport> {
  document = gql`
    mutation newWorkReport(
      $customerId: String!
      $projectId: String!
      $description: String!
      $invoiced: Boolean!
    ) {
      newWorkReport(
        data: {
          customerId: $customerId
          description: $description
          projectId: $projectId
          invoiced: $invoiced
        }
      ) {
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
        description
        invoiced
        createdAt
        updatedAt
      }
    }
  `;
}
