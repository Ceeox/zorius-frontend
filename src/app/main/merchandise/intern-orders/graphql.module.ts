import { Injectable } from '@angular/core';
import { Query, Mutation, gql } from 'apollo-angular';
import ObjectID from 'bson-objectid';
import { User } from 'src/services/user.service';


export interface Response {
  listInternMerch: InternMerchandiseConnection;
}

export interface CountMerchResponse {
  countInternMerch: number
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
  id: ObjectID;
  articleNumber: number;
  merchandiseId: number;
  merchandiseName: String;
  cost: number;
  orderer: User;
  projectLeader: String;
  status: InternMerchandiseStatus;
  count: number;
  createdDate: Date;
  updatedDate: Date;
  purchasedOn: Date;

  postage?: number;
  arivedOn?: Date;
  url?: String;
  serialNumber?: String[];
  invoiceNumber?: String;
  shop?: String;
  useCase?: String;
}

export interface Orderer {
  firstname?: String;
  lastname?: String;
  username: String;
}

export enum InternMerchandiseStatus {
  Ordered,
  Delivered,
  Stored,
  Used,
}

export interface NewInternMerchandise {
  merchandiseName: String;
  count: number;
  url?: String;
  purchasedOn: Date;
  articleNumber?: String,
  postage?: number;
  useCase: String;
  cost: number;
}

export interface UpdateInternMerchandise {
  arivedOn?: Date;
  articleNumber?: String;
  cost?: number;
  count?: number;
  invoiceNumber?: number;
  location?: String;
  merchandiseId?: number;
  merchandiseName?: String;
  orderer?: ObjectID;
  postage?: number;
  projectLeader?: String;
  purchasedOn?: Date;
  serialNumber?: String[];
  shop?: String;
  url?: String;
  useCase?: String;
}

@Injectable({
  providedIn: 'root',
})
export class CountInternMerchandiseGQL extends Query<CountMerchResponse> {
  document = gql`query countInternMerchandise {
      countInternMerch
    }`;
}

@Injectable({
  providedIn: 'root',
})
export class InternOrderTableDataGQL extends Query<Response> {
  document = gql`
    query listInternMerch($first: Int, $last: Int, $after: String, $before: String) {
      listInternMerch(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            orderer {
              username
              firstname
              lastname
            }
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

@Injectable({
  providedIn: 'root',
})
export class UpdateInternMerchGQL extends Mutation {
  document = gql`
    mutation newMerchandiseIntern($id: ObjectId!, $update: InternMerchandiseUpdate!) {
      newInternOrder(id: $id, update: $update) {
        id
      }
    }`;
}