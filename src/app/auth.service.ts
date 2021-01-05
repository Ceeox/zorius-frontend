import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, Query, gql } from 'apollo-angular';
import { doesNotReject } from 'assert';
import ObjectID from 'bson-objectid';
import { resolve } from 'dns';
import { CookieService } from 'ngx-cookie-service';

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

export interface Login {
  token: string;
  expiresAt: Date;
  userId: ObjectID;
}
export interface LoginResponse {
  login: Login;
}

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Query<LoginResponse> {
  document = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      expiresAt
      userId
    }
  }`;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static getToken() {
    throw new Error('Method not implemented.');
  }
  token: string;
  loggedIn: boolean = false;
  tokenExpiresAt?: Date;

  user?: User = null;

  constructor(
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private getUserGQL: GetUserGQL,
    private router: Router,
    private cookieService: CookieService
  ) {
    let token = this.cookieService.get("token");
    let userId = this.cookieService.get("userId");
    if (!this.validToken(token)) {
      this.router.navigate(['/login']);
    }
    this.token = token;
    this.loggedIn = true;
    this.loadUser(new ObjectID(userId));
    console.log(this.user);
  }

  validToken(token: string): boolean {
    return token !== null && token.length > 0;
  }

  public isAuthenticated(): boolean {
    return this.loggedIn;
  }

  public login(email: string, password: string) {
    let userId = null;
    this.loginGQL.watch({
      email: email,
      password: password,
    }, {
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({ data }) => {
      this.token = data.login.token;
      userId = data.login.userId;
      this.tokenExpiresAt = data.login.expiresAt;
      this.loggedIn = true;


      this.cookieService.set("token", this.token, data.login.expiresAt);
      this.cookieService.set("userId", userId, data.login.expiresAt);
      localStorage.setItem("token", this.token);

      this.loadUser(userId);

      this.router.navigate(['/home']);
    },
      err => {
        console.log(err);
      }
    );
  }

  public logout() {
    this.cookieService.deleteAll();
    this.loggedIn = false;
    this.apollo.client.resetStore();
    //localStorage.removeItem("token");
    this.router.navigate(['/']);
  }

  public getUser(): User {
    return this.user;
  }

  loadUser(userId: ObjectID) {
    this.getUserGQL.watch({
      userId: userId,
    }, {
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({ data }) => {
      this.user = data.getUser;
    });
  }

  getToken(): string {
    return this.token;
  }
}