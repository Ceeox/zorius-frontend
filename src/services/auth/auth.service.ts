import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Apollo, Query, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';

import { validate as uuidValidate } from 'uuid';
import { UserService } from '../user/user.service';

export interface Login {
  token: string;
}
export interface LoginResult {
  login: Login;
}

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Query<LoginResult> {
  document = gql`
    query login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;
}

export interface Claim {
  sub: string;
  id: string;
  exp: number;
  nbf: number;
  iat: number;
  iss: string;
}

export function getToken(): string {
  return localStorage.getItem('token');
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  claim?: Claim;

  constructor(
    private userService: UserService,
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private router: Router,
    private snackBar: MatSnackBar,
    private jwtHelper: JwtHelperService
  ) {
    if (this._isTokenPresent()) {
      this.claim = this._decodeToken();
    } else {
      this.snackBar.open('You have been loged out. Please login again.', null, {
        duration: 5000,
      });
    }
  }

  public login(email: string, password: string) {
    this.loginGQL
      .fetch({
        email: email,
        password: password,
      })
      .subscribe(
        ({ data }) => {
          const token = data.login.token;
          localStorage.setItem('token', token);

          this.claim = this._decodeToken();

          this.router.navigate(['/home']);
        },
        (error) => {
          this.snackBar.open(error, null, {
            duration: 5000,
          });
        }
      );
  }

  public logout() {
    this._resetLoginData();
    this.apollo.client.resetStore();
    this.router.navigate(['/home']);
  }

  public getUserId(): string | null {
    if (this.claim && uuidValidate(this.claim.id)) {
      return this.claim.id;
    } else {
      return null;
    }
  }

  user(): Observable<User> {
    if (this.getUserId) {
      return this.userService.users({ ids: [this.getUserId()] }).pipe(
        map((user) => {
          return user.users.edges[0].node;
        })
      );
    }
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return this._isTokenValid();
  }

  private _isTokenValid(): boolean {
    if (this.claim) {
      let now = (Date.now() / 1000) | 0;
      return now >= this.claim.nbf && now <= this.claim.exp;
    } else {
      return false;
    }
  }

  private _resetLoginData() {
    this.apollo.client.resetStore();
    localStorage.removeItem('token');
    this.claim = null;
  }

  private _decodeToken(): Claim {
    let token = this._getToken();
    return this.jwtHelper.decodeToken(token);
  }

  private _getToken(): string {
    return localStorage.getItem('token');
  }

  private _isTokenPresent(): boolean {
    return localStorage.getItem('token') !== undefined;
  }
}
