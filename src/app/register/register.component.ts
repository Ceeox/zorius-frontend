import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/services/user/user.service';
import { AuthService } from 'src/services/auth/auth.service';
import { CustomValidators } from '../providers/CustomValidators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  passwordForm: FormGroup = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ]),
    },
    CustomValidators.mustMatch('password', 'confirmPassword')
  );
  nameForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(255),
    ]),
  });

  registerSub$?: Subscription;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.registerSub$?.unsubscribe();
  }

  register() {
    const email = this.emailForm.get('email').value;
    const password = this.passwordForm.get('password').value;
    const name = this.nameForm.get('name').value;
    this.userService.register(email, password, name).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
