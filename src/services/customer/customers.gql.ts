import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Customer } from 'src/models/customer';
import { Connection } from 'src/models/page-info';

export interface Customers {
  customers: Connection<Customer>;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersGQL extends Query<Customers> {
  document = gql`
    query customers {
      customers {
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
        edges {
          node {
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
            deletedAt
          }
          cursor
        }
      }
    }
  `;
}
