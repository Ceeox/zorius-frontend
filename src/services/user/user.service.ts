import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { delay, first, map, retryWhen, take } from 'rxjs/operators';
import { RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import { ListUserOptions, ListUsers, User, UserUpdate } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersGQL extends Query<ListUsers> {
  document = gql`
    query users(
      $ids: [UUID!]
      $after: String
      $before: String
      $first: Int
      $last: Int
    ) {
      users(
        options: {
          ids: $ids
          after: $after
          before: $before
          first: $first
          last: $last
        }
      ) {
        edges {
          node {
            id
            email
            name
            isAdmin
            updatedAt
            createdAt
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
export class UpdateUserGQL extends Mutation<User> {
  document = gql`
    mutation ($id: UUID!, $name: String, $isAdmin: Boolean) {
      updateUser(userId: $id, userUpdate: { name: $name, isAdmin: $isAdmin }) {
        id
        email
        name
        createdAt
        updatedAt
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private usersGQL: UsersGQL,
    private updateUsersGQL: UpdateUserGQL
  ) {}

  users(options?: ListUserOptions): Observable<ListUsers> {
    return this.usersGQL
      .fetch({
        ids: options.ids,
        after: options.after,
        before: options.before,
        first: options.first,
        last: options.last,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  updateUser(id: string, update: UserUpdate): Observable<User> {
    return this.updateUsersGQL
      .mutate({ id, name: update.name, isAdmin: update.isAdmin })
      .pipe(
        map((result) => {
          return result.data;
        }),
        first(),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }
}
