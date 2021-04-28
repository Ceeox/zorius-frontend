import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, Query, gql } from 'apollo-angular';
import { doesNotReject } from 'assert';
import ObjectID from 'bson-objectid';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';



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
  token: string;
  loggedIn: boolean = false;
  tokenExpiresAt?: Date;



  constructor(
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private router: Router,
    private cookieService: CookieService
  ) {
    let token = this.cookieService.get("token");
    if (!this.validToken(token)) {
      this.router.navigate(['/login']);
      return;
    }
    this.token = token;
    this.loggedIn = true;
  }

  getUserId(): ObjectID | null {
    let id = this.cookieService.get("userId");
    if (id == null || id == "") {
      return null;
    }
    return new ObjectID(id);
  }

  private validToken(token: string): boolean {
    return token !== null && token.length > 0;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(email: string, password: string) {
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

  getToken(): string {
    return this.token;
  }
}