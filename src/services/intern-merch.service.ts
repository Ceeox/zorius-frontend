import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Query, Mutation, gql, Apollo } from 'apollo-angular';
import ObjectID from 'bson-objectid';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { POLLING_INTERVAL, SNACKBAR_TIMEOUT } from 'src/app/app.component';
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
    articleNumber: String;
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
    invoiceNumber?: number;
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
    orderer: ObjectID,
    shop: string,
}

export interface UpdateInternMerchandise {
    arivedOn?: Date;
    articleNumber?: String;
    cost?: number;
    count?: number;
    invoiceNumber?: number;
    merchandiseId?: number;
    merchandiseName?: String;
    orderer?: User;
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

@Injectable({
    providedIn: 'root',
})
export class GetInternMerchByIdGQL extends Query<InternMerchandise> {
    document = gql`
    query getInternMerchById($id: ObjectId!) {
        getInternMerchById(id: $id) {
          id
          arivedOn
          projectLeader
          url
          createdDate
          updatedDate
          orderer {
              id
              email
              username
              firstname
              lastname
          }
          count
          merchandiseId
          merchandiseName
          purchasedOn
          serialNumber
          invoiceNumber
          shop
          useCase
          status
        }
      }`;
}

@Injectable({
    providedIn: 'root'
})
export class InternMerchService {
    token: string;
    loggedIn: boolean = false;
    tokenExpiresAt?: Date;

    constructor(
        private snackBar: MatSnackBar,

        private tableDataGQL: InternOrderTableDataGQL,
        private newInternOrderGQL: NewInternOrderGQL,
        private countInternMerchGQL: CountInternMerchandiseGQL,
        private updateInternMerchGQL: UpdateInternMerchGQL,
        private getInternMerchByIdGQL: GetInternMerchByIdGQL,
    ) { }

    countMerch(): Observable<number> {
        return this.countInternMerchGQL.fetch({
        }).pipe(
            map(result => {
                return result.data.countInternMerch;
            }),
            catchError(err => {
                this.snackBar.open(err)._dismissAfter(SNACKBAR_TIMEOUT);
                return [];
            })
        );
    }

    getInternMerchById(id: ObjectID): Observable<InternMerchandise> {
        return this.getInternMerchByIdGQL.fetch({
            id: id,
        }).pipe(
            map(result => {
                return result.data;
            }),
            catchError(err => {
                this.snackBar.open(err)._dismissAfter(SNACKBAR_TIMEOUT);
                return [];
            })
        );
    }

    listInternMerch(first?: number, last?: number, before?: string, after?: string): Observable<InternMerchandiseEdge[]> {
        return this.tableDataGQL.watch({
            first: first,
            last: last,
            before: before,
            after: after
        }, {
            pollInterval: POLLING_INTERVAL,
        }).valueChanges.pipe(
            map(result => {
                return result.data.listInternMerch.edges;
            }),
            catchError(err => {
                this.snackBar.open(err)._dismissAfter(SNACKBAR_TIMEOUT);
                return [];
            })
        );
    }

    submitNewInternOrder(newOder: NewInternMerchandise) {
        this.newInternOrderGQL
            .mutate({
                newInternOrder: newOder,
            })
            .subscribe();
    }

    submitUpdateInternMerch(id: ObjectID, update: UpdateInternMerchandise) {
        this.updateInternMerchGQL
            .mutate({
                id: id,
                update: update
            })
            .subscribe();
    }
}