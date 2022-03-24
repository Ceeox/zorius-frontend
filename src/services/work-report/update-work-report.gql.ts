import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { WorkReport } from 'src/models/work-reports';

@Injectable({
  providedIn: 'root',
})
export class UpdateWorkReportGQL extends Mutation<WorkReport> {
  document = gql`
    mutation updateWorkReport(
      $customer: UUID
      $description: String
      $endTimeRecord: Boolean
      $forUserId: UUID
      $id: UUID!
      $invoiced: Boolean
      $project: UUID
      $startTimeRecord: Boolean
      $timeRecordUpdate: TimeRecordUpdate
    ) {
      updateWorkReport(
        update: {
          customer: $customer
          description: $description
          endTimeRecord: $endTimeRecord
          forUserId: $forUserId
          id: $id
          invoiced: $invoiced
          project: $project
          startTimeRecord: $startTimeRecord
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
