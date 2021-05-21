import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { gql, Mutation, Query } from "apollo-angular";
import { ObjectID } from "mongodb";
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from "rxjs/operators";
import { FETCH_POLICY, POLLING_INTERVAL, RETRY_COUNT, RETRY_DELAY } from "src/app/graphql.module";
import { GetUserById, ListUsers, User } from "src/models/user";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class GetUserByIdGQL extends Query<GetUserById> {
  document = gql`
    query getUserById($id: ObjectId!) {
        getUserById(id: $id) {
            id
            email
            username
            firstname
            lastname
            createdAt
            avatarUrl
        }
    }`;
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
                username
                firstname
                lastname
                updated
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
      }`;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateUserGQL extends Mutation<User> {
  document = gql`
    mutation updateUser($id: ObjectId!, $firstname: String, $lastname: String, $username: String) {
      updateUser(
        userId: $id,
        userUpdate: { firstname: $firstname, lastname: $lastname, username: $username}
      ) {
        id
        email
        username
        firstname
        lastname
        createdAt
        updated
      }
    }`;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  self: Observable<User>;

  constructor(
    private getUserGQL: GetUserByIdGQL,
    private listUsersGQL: ListUsersGQL,
    private authService: AuthService,
    private router: Router
  ) {
    let userId = this.authService.getUserId();
    if (userId === null) {
      this.router.navigate(['/login']);
      return;
    }
    this.self = this.getUserById(userId).pipe(
      map(res => { return res; })
    );
  }

  public getSelf(): Observable<User> {
    return this.self;
  }

  getUserById(id: ObjectID): Observable<User> {
    console.log(ObjectID.toString())
    return this.getUserGQL.fetch({ id: id }).pipe(
      map(res => {
        return res.data.getUserById;
      }),
      retryWhen(errors => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  listUsers(first?: number, last?: number, after?: String, before?: String): Observable<ListUsers> {
    return this.listUsersGQL.watch({
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
}