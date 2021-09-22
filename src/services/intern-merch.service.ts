import { Injectable } from '@angular/core';
import { Query, Mutation, gql } from 'apollo-angular';

import { Observable } from 'rxjs/internal/Observable';
import { delay, map, retryWhen, take, first } from 'rxjs/operators';
import {
  FETCH_POLICY,
  POLLING_INTERVAL,
  RETRY_COUNT,
  RETRY_DELAY,
} from 'src/app/graphql.module';
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
  document = gql`
    query countInternMerchandise {
      countInternMerch
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ListInternMerchGQL extends Query<ListInternMerch> {
  document = gql`
    query listInternMerch(
      $first: Int
      $last: Int
      $after: String
      $before: String
    ) {
      listInternMerch(
        first: $first
        last: $last
        after: $after
        before: $before
      ) {
        edges {
          node {
            id
            ordererId
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
    }
  `;
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
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateInternMerchGQL extends Mutation<InternMerchandise> {
  document = gql`
    mutation updateInternMerch(
      $id: string!
      $update: InternMerchandiseUpdate!
    ) {
      updateInternMerch(id: $id, update: $update) {
        id
        arivedOn
        url
        createdDate
        updatedDate
        ordererId
        count
        merchandiseId
        merchandiseName
        purchasedOn
        serialNumber
        shop
        useCase
        postage
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteInternMerchGQL extends Mutation<DeleteInternMerch> {
  document = gql`
    mutation deleteInternMerch($id: string!) {
      deleteInternMerch(id: $id)
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class GetInternMerchByIdGQL extends Query<GetInternMerchById> {
  document = gql`
    query getInternMerchById($id: string!) {
      getInternMerchById(id: $id) {
        id
        arivedOn
        projectLeaderId
        url
        createdDate
        updatedDate
        ordererId
        count
        merchandiseId
        merchandiseName
        purchasedOn
        serialNumber
        shop
        useCase
        status
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class InternMerchService {
  constructor(
    private listInternMerchGQL: ListInternMerchGQL,
    private newInternMerchGQL: NewInternMerchGQL,
    private countInternMerchGQL: CountInternMerchandiseGQL,
    private updateInternMerchGQL: UpdateInternMerchGQL,
    private getInternMerchByIdGQL: GetInternMerchByIdGQL,
    private deleteInternMerchGQL: DeleteInternMerchGQL
  ) {}

  countMerch(): Observable<number> {
    return this.countInternMerchGQL.fetch({}).pipe(
      map((result) => {
        return result.data.countInternMerch;
      }),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  getInternMerchById(id: string): Observable<InternMerchandise> {
    return this.getInternMerchByIdGQL.fetch({ id }).pipe(
      map((result) => {
        return result.data.getInternMerchById;
      }),
      first(),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  listInternMerch(
    first?: number,
    last?: number,
    before?: string,
    after?: string
  ): Observable<ListInternMerch> {
    return this.listInternMerchGQL
      .fetch({
        first: first,
        last: last,
        before: before,
        after: after,
      })
      .pipe(
        map((result) => {
          return result.data;
        }),
        take(1),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  newInternMerch(
    newMerch: NewInternMerchandise
  ): Observable<InternMerchandise> {
    return this.newInternMerchGQL
      .mutate({
        new: newMerch,
      })
      .pipe(
        map((result) => {
          return result.data.newInternMerch;
        }),
        first(),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  updateInternMerch(
    id: string,
    update: UpdateInternMerchandise
  ): Observable<InternMerchandise> {
    return this.updateInternMerchGQL.mutate({ id, update }).pipe(
      map((result) => {
        return result.data;
      }),
      first(),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  deleteInternMerch(id: string): Observable<boolean> {
    return this.deleteInternMerchGQL.mutate({ id }).pipe(
      map((result) => {
        return result.data.deleteInternMerch;
      }),
      first(),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }
}
