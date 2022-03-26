import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from 'src/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  emailInput?: string;
  passwordInput?: string;

  constructor(
    private _last_location: Location,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  cancelClicked() {
    this._last_location.back();
  }

  loginClicked() {
    if (this.emailInput === null || this.passwordInput === null) {
      this._snackBar.open('Bitte E-Mail und Passwort eingeben!', null, {
        duration: 5000,
      });
      return;
    }

    this.authService.login(this.emailInput, this.passwordInput);
  }
}
