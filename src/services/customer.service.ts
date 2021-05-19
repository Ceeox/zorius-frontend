import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import ObjectID from 'bson-objectid';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { POLLING_INTERVAL } from 'src/app/app.component';
import { PageInfo } from './intern-merch.service';

export interface ListAllCustomersResp {
  listCustomers: CustomerResponseConnection;
}

export interface CustomerResponseConnection {
  edges: CustomerResponseEdge[];
  pageInfo: PageInfo;
}

export interface CustomerResponseEdge {
  cursor: String;
  node: CustomerResponse;
}

export interface CustomerResponse {
  id: ObjectID,
  name: string,
  idenifier: string,
  note: string,
}

@Injectable({
  providedIn: 'root',
})
export class ListAllCustomersGQL extends Query<ListAllCustomersResp> {
  document = gql`
  query listCustomers {
    listCustomers {
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
        }
        cursor
      }
    }
  }`;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private listAllCustomersGQL: ListAllCustomersGQL
  ) { }

  listCustomers(): Observable<CustomerResponseEdge[]> {
    return this.listAllCustomersGQL.watch({
      fetchPolicy: 'cache-and-network',
      pollInterval: POLLING_INTERVAL,
    }).valueChanges.pipe(
      map(res => {
        return res.data.listCustomers.edges;
      }),
      catchError((e, c) => {
        console.error("listCustomersError: " + e);
        return c;
      })
    );
  }

}
