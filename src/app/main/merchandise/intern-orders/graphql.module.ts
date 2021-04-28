import { Injectable } from '@angular/core';
import { Query, Mutation, gql } from 'apollo-angular';


export interface Response {
  listInternMerchandise: InternMerchandiseConnection;
}

export interface InternMerchandiseConnection {
  edges: InternMerchandiseEdge[];
  pageInfo: PageInfo;
}

export interface InternMerchandiseEdge {
  cursor: number;
  node: InternMerchandise;
}

export interface PageInfo {
  startCursor: number;
  endCursor: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface InternMerchandise {
  id: String;
  merchandiseId: number;
  merchandiseName: String;
  cost: number;
  orderer: String;
  status: InternMerchandiseStatus;
  count: number;
}

export enum InternMerchandiseStatus {
  Ordered,
  Delivered,
  Stored,
  Used,
}

@Injectable({
  providedIn: 'root',
})
export class InternOrderTableDataGQL extends Query<Response> {
  document = gql`
    query listInternMerchandise($first: Int, $last: Int, $after: String, $before: String) {
      listInternMerchandise(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            orderer
            count
            cost
            merchandiseId
            merchandiseName
            status
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
      }
    }`;
}

@Injectable({
  providedIn: 'root',
})
export class NewInternOrderGQL extends Mutation {
  document = gql`
    mutation newMerchandiseIntern($newInternOrder: NewInternOrder!) {
      newInternOrder(newInternOrder: $newInternOrder) {
        id
        arivedOn
        projectLeader
        url
        createdDate
        updatedDate
        orderer
        projectLeader
        count
        merchandiseId
        merchandiseName
        purchasedOn
        serialNumber
        invoiceNumber
        shop
        useCase
      }
    }`;
}