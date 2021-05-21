import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';
import { ObjectID } from 'mongodb';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, POLLING_INTERVAL, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import { Customer, ListCustomers } from 'src/models/customer';

@Injectable({
  providedIn: 'root',
})
export class NewCustomerGQL extends Mutation<Customer> {
  document = gql`
  mutation newCustomer($name: String!, $identifier: String!, $note: String, $projectIds: [ObjectId!]!) {
    newCustomer(new: {name: $name, identifier: $identifier, note: $note, projectIds: $projectIds}) {
      id
      name
      identifier
      note
      projects {
        id
        name
        description
        note
      }
      creator {
        id
        email
        username
        firstname
        lastname
        updated
        createdAt
      }
    }
  }`;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateCustomerGQL extends Mutation<Customer> {
  document = gql`
    mutation updateCustomer($id: ObjectId!, $userId: ObjectId!, $name: String!, $identifier: String!, $note: String) {
      updateCustomer(id: $id, update: {creator: $userId, name: $name, identifier: $identifier, note: $note}) {
        id
        name
        identifier
        note
        projects {
          id
          name
          description
          note
        }
        creator {
          id
          email
          username
          firstname
          lastname
          updated
          createdAt
        }
      }
    }`;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteCustomerGQL extends Mutation<boolean> {
  document = gql`
    mutation deleteCustomer($id: ObjectId!) {
      deleteCustomer(id: $id)
    }`;
}

@Injectable({
  providedIn: 'root',
})
export class ListCustomersGQL extends Query<ListCustomers> {
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
          projects {
            id
            name
          }
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
    private newCustomerGQL: NewCustomerGQL,
    private updateCustomerGQL: UpdateCustomerGQL,
    private deleteCustomerGQL: DeleteCustomerGQL,
    private listCustomersGQL: ListCustomersGQL,
  ) { }

  newCustomer(name: String, identifier: String, note: String, projectIds: [ObjectID]): Observable<Customer> {
    return this.newCustomerGQL.mutate({
      name,
      identifier,
      note,
      projectIds,
    }).pipe(
      map(res => {
        return res.data;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  updateCustomer(id: ObjectID, userId: ObjectID, name?: String, identifier?: String, note?: String): Observable<Customer> {
    return this.updateCustomerGQL.mutate({
      id, userId, name, identifier, note
    }).pipe(
      map(res => {
        return res.data;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    )
  }

  listCustomers(first?: number, last?: number, after?: String, before?: String): Observable<ListCustomers> {
    return this.listCustomersGQL.watch({
      first,
      last,
      after,
      before,
    }, {
      fetchPolicy: FETCH_POLICY,
      pollInterval: POLLING_INTERVAL,
    }).valueChanges.pipe(
      map(res => {
        return res.data;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  deleteCustomer(id: ObjectID) {
    return this.deleteCustomerGQL.mutate({ id }).subscribe();
  }
}
