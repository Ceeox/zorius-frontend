import { Injectable } from '@angular/core';
import { Query, Mutation, gql } from 'apollo-angular';
import ObjectID from 'bson-objectid';
import { Observable } from 'rxjs/internal/Observable';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, POLLING_INTERVAL, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import {
    CountMerchResponse,
    DeleteInternMerch,
    GetInternMerchById,
    InternMerchandise,
    ListInternMerch,
    NewInternMerch,
    UpdateInternMerchandise,
    NewInternMerchandise,
} from 'src/models/intern-merch';


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
export class ListInternMerchGQL extends Query<ListInternMerch> {
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
export class NewInternMerchGQL extends Mutation<NewInternMerch> {
    document = gql`
    mutation newInternMerch($new: NewInternMerchandise!) {
        newInternMerch(new: $new) {
        id
        arivedOn
        url
        createdDate
        updatedDate
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
export class UpdateInternMerchGQL extends Mutation<InternMerchandise> {
    document = gql`
    mutation updateInternMerch($id: ObjectId!, $update: InternMerchandiseUpdate!) {
        updateInternMerch(id: $id, update: $update) {
            id
            arivedOn
            url
            createdDate
            updatedDate
            orderer {
                id
                email
                username
                firstname
                lastname
                updated
                createdAt
            }
            count
            merchandiseId
            merchandiseName
            purchasedOn
            serialNumber
            invoiceNumber
            shop
            useCase
            postage
        }
    }`;
}

@Injectable({
    providedIn: 'root',
})
export class DeleteInternMerchGQL extends Mutation<DeleteInternMerch> {
    document = gql`
        mutation deleteInternMerch($id: ObjectId!) {
            deleteInternMerch(id: $id)
        }`;
}

@Injectable({
    providedIn: 'root',
})
export class GetInternMerchByIdGQL extends Query<GetInternMerchById> {
    document = gql`
    query getInternMerchById($id: ObjectId!) {
        getInternMerchById(id: $id) {
            id
            arivedOn
            projectLeader {
              id
              email
              username
              firstname
              lastname
              updated
              createdAt
            }
            url
            createdDate
            updatedDate
            orderer {
              id
              email
              username
              firstname
              lastname
              updated
              createdAt
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
    constructor(
        private listInternMerchGQL: ListInternMerchGQL,
        private newInternMerchGQL: NewInternMerchGQL,
        private countInternMerchGQL: CountInternMerchandiseGQL,
        private updateInternMerchGQL: UpdateInternMerchGQL,
        private getInternMerchByIdGQL: GetInternMerchByIdGQL,
        private deleteInternMerchGQL: DeleteInternMerchGQL,
    ) { }

    countMerch(): Observable<number> {
        return this.countInternMerchGQL.fetch({
        }).pipe(
            map(result => {
                return result.data.countInternMerch;
            }),
            retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
        );
    }

    getInternMerchById(id: ObjectID): Observable<InternMerchandise> {
        return this.getInternMerchByIdGQL.watch({ id }, {
            fetchPolicy: FETCH_POLICY,
            pollInterval: POLLING_INTERVAL,
        }).valueChanges.pipe(
            map(result => {
                return result.data.getInternMerchById;
            }),
            retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
        );
    }

    listInternMerch(first?: number, last?: number, before?: string, after?: string): Observable<ListInternMerch> {
        return this.listInternMerchGQL.watch({
            first: first,
            last: last,
            before: before,
            after: after
        }, {
            fetchPolicy: FETCH_POLICY,
            pollInterval: POLLING_INTERVAL,
        }).valueChanges.pipe(
            map(result => {
                return result.data;
            }),
            retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
        );
    }

    newInternMerch(newMerch: NewInternMerchandise): Observable<InternMerchandise> {
        return this.newInternMerchGQL
            .mutate({
                new: newMerch,
            }).pipe(
                map(result => {
                    return result.data.newInternMerch;
                }),
                retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
            );
    }

    updateInternMerch(id: ObjectID, update: UpdateInternMerchandise): Observable<InternMerchandise> {
        return this.updateInternMerchGQL.mutate({ id, update })
            .pipe(
                map(result => {
                    return result.data;
                }),
                retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
            );
    }

    deleteInternMerch(id: ObjectID): Observable<boolean> {
        return this.deleteInternMerchGQL.mutate({ id })
            .pipe(
                map(result => {
                    return result.data.deleteInternMerch;
                }),
                retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
            );
    }
}