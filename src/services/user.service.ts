import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { gql, Query } from "apollo-angular";
import ObjectID from "bson-objectid";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

export interface User {
    id: ObjectID;
    email: string;
    username: string;
    firstname?: string;
    lastname?: string;
    lastUpdated: Date;
    createdAt: Date;
    avatarUrl?: string;
}
export interface UserResponse {
    getUser: User;
}

@Injectable({
    providedIn: 'root',
})
export class GetUserGQL extends Query<UserResponse> {
    document = gql`
    query getUser($userId: ObjectId) {
      getUser(userId: $userId) {
        id
        email
        username
        firstname
        lastname
        lastUpdated
        createdAt
        avatarUrl
      }
    }`;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    user: Observable<User>;

    constructor(private getUserGQL: GetUserGQL,
        private authService: AuthService,
        private router: Router
    ) {
        let userId = this.authService.getUserId();
        if (userId === null) {
            this.router.navigate(['/login']);
            return;
        }
        this.user = this.getUserGQL.watch({
            userId: userId,
        }, {
            fetchPolicy: 'network-only'
        }).valueChanges.pipe(
            map((data) => {
                return data.data.getUser;
            })
        );
    }

    public getUser(): Observable<User> {
        return this.user;
    }
}