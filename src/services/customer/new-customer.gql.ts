import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { Customer } from 'src/models/customer';

export interface NewCustomerResult {
  newCustomer: Customer;
}

@Injectable({
  providedIn: 'root',
})
export class NewCustomerGQL extends Mutation<NewCustomerResult> {
  document = gql`
    mutation newCustomer(
      $name: String!
      $identifier: String!
      $note: String
      $projectIds: [UUID!]
    ) {
      newCustomer(
        new: {
          name: $name
          identifier: $identifier
          note: $note
          projectIds: $projectIds
        }
      ) {
        id
        name
        identifier
        note
        projects {
          id
          name
          note
          createdAt
          updatedAt
          deletedAt
        }
        createdAt
        updatedAt
      }
    }
  `;
}
