import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { WorkReport } from 'src/models/work-reports';

@Injectable({
  providedIn: 'root',
})
export class UpdateWorkReportGQL extends Mutation<WorkReport> {
  document = gql`
    mutation updateWorkReport(
      $customerId: UUID
      $description: String
      $id: UUID!
      $invoiced: Boolean
      $projectId: UUID
      $timeRecordUpdate: TimeRecordUpdate
    ) {
      updateWorkReport(
        update: {
          customerId: $customerId
          description: $description
          id: $id
          invoiced: $invoiced
          projectId: $projectId
          timeRecordUpdate: $timeRecordUpdate
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
        timeRecords {
          id
          start
          end
        }
        description
        invoiced
        createdAt
        updatedAt
      }
    }
  `;
}
