import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { gql, Mutation, Query } from 'apollo-angular';
import { Observable } from 'rxjs';
import { delay, first, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import {
  GetUserByIdResp,
  ListUsers,
  UpdateUserResp,
  User,
} from 'src/models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GetUserByIdGQL extends Query<GetUserByIdResp> {
  document = gql`
    query getUserById($id: String!) {
      getUserById(id: $id) {
        id
        email
        firstname
        lastname
        createdAt
        updatedAt
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ListUsersGQL extends Query<ListUsers> {
  document = gql`
    query listUsers($first: Int, $last: Int, $after: String, $before: String) {
      listUsers(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            email
            firstname
            lastname
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
export class UpdateUserGQL extends Mutation<UpdateUserResp> {
  document = gql`
    mutation updateUser(
      $id: String!
      $firstname: String
      $lastname: String
      $username: String
    ) {
      updateUser(
        userId: $id
        userUpdate: {
          firstname: $firstname
          lastname: $lastname
          username: $username
        }
      ) {
        id
        email
        firstname
        lastname
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
  self: Observable<User>;

  constructor(
    private getUserGQL: GetUserByIdGQL,
    private listUsersGQL: ListUsersGQL,
    private updateUsersGQL: UpdateUserGQL,
    private authService: AuthService,
    private router: Router
  ) {
    let userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.self = this.getUserById(userId).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getSelf(): Observable<User> {
    return this.self;
  }

  getUserById(id: string): Observable<User> {
    return this.getUserGQL.fetch({ id }).pipe(
      map((res) => {
        console.log(res.data.getUserById);
        return res.data.getUserById;
      }),
      first(),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  listUsers(
    first?: number,
    last?: number,
    after?: String,
    before?: String
  ): Observable<ListUsers> {
    return this.listUsersGQL
      .fetch({
        first,
        last,
        after,
        before,
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

  updateUser(
    username?: string,
    firstname?: string,
    lastname?: string
  ): Observable<User> {
    return this.getSelf().pipe(
      map((res) => {
        let user: User;
        this.updateUsersGQL
          .mutate({
            id: res.id,
            username,
            firstname,
            lastname,
          })
          .subscribe((res) => {
            user = res.data.updateUser;
          });
        return user;
      })
    );
  }
}
