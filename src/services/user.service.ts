import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { gql, Query } from "apollo-angular";
import ObjectID from "bson-objectid";
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { PageInfo } from "./intern-merch.service";

export interface User {
    id: ObjectID;
    email: string;
    username: string;
    firstname?: string;
    lastname?: string;
    updated: Date;
    createdAt: Date;
    avatarUrl?: string;
}
export interface UserResponse {
    getUser: User;
}

export interface UserConnection {
    edges: UserEdge[];
    pageInfo: PageInfo;
}

export interface UserEdge {
    cursor: String;
    node: User;
}

@Injectable({
    providedIn: 'root',
})
export class GetUserGQL extends Query<UserResponse> {
    document = gql`
    query getUserById($userId: ObjectId) {
        getUserById(id: $userId) {
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
export class ListUsersGQL extends Query<UserConnection> {
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
export class ListAllUsersGQL extends Query<UserConnection> {
    document = gql`
      query listUsers {
        listUsers {
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
    providedIn: 'root'
})
export class UserService {
    self: Observable<User>;

    constructor(
        private getUserGQL: GetUserGQL,
        private listUsersGQL: ListUsersGQL,
        private listAllUsersGQL: ListAllUsersGQL,
        private authService: AuthService,
        private router: Router
    ) {
        let userId = this.authService.getUserId();
        if (userId === null) {
            this.router.navigate(['/login']);
            return;
        }
        this.self = this.getUserGQL.watch({
            userId: userId,
        }, {
            fetchPolicy: 'cache-and-network'
        }).valueChanges.pipe(
            map((data) => {
                return data.data.getUser;
            })
        );
    }

    public getSelf(): Observable<User> {
        return this.self;
    }

    getUserById(id: ObjectID): Observable<User> {
        return this.getUserGQL.watch({ id: id }).valueChanges.pipe(
            map(res => {
                return res.data.getUser;
            }),
            catchError((e, c) => {
                console.log(e);
                return c;
            })
        );
    }

    listUsers(first: number, last: number, after: String, before: String): Observable<UserEdge[]> {
        return this.listUsersGQL.watch({
            first: first,
            last: last,
            after: after,
            before: before
        }).valueChanges.pipe(
            map(res => {
                return res.data.edges;
            }),
            catchError((_e, c) => {
                return c;
            })
        );
    }

    listAllUsers(): Observable<UserEdge[]> {
        return this.listAllUsersGQL.watch().valueChanges.pipe(
            map(res => {
                console.log("listUsers: " + res);
                return res.data.edges;
            }),
            catchError(e => {
                console.log(e);
                return [];
            })
        );
    }
}