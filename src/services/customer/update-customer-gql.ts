import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { Customer } from 'src/models/customer';

export interface UpdateCustomerResult {
  updateCustomer: Customer;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateCustomerGQL extends Mutation<UpdateCustomerResult> {
  document = gql`
    mutation updateCustomer(
      $id: String!
      $userId: String!
      $name: String!
      $identifier: String!
      $note: String
    ) {
      updateCustomer(
        id: $id
        update: { identifier: $identifier, name: $name, note: $note }
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
