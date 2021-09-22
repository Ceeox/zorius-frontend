import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this._snackBar.open(
        'Bitte melde dich an, um diesen Bereich zu sehen!',
        null,
        {
          duration: 5000,
        }
      );
      return false;
    }
    return true;
  }
}
