import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnDestroy {
  user: Observable<User>;
  updateUserForm = this.fb.group({
    name: [''],
  });

  user$: Subscription | undefined;
  updateUser$: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.user = this.authService.user().pipe(
      map((res) => {
        return res;
      })
    );
  }

  ngOnDestroy(): void {
    this.updateUser$?.unsubscribe();
    this.user$?.unsubscribe();
  }

  updateForm(name?: string) {
    this.updateUserForm.patchValue({
      name,
    });
  }

  onSubmit() {
    this.user$ = this.user.subscribe((user) => {
      this.updateUser$ = this.userService
        .updateUser(user.id, { name: this.updateUserForm.get('name').value })
        .subscribe((res) => {
          this.updateForm(res.name);
        });
    });
  }
}
