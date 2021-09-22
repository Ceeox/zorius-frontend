import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  self: Observable<User>;
  updateUserForm = this.fb.group({
    firstname: [''],
    lastname: [''],
  });

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.self = this.userService.getSelf().pipe(
      map((res) => {
        return res;
      })
    );
  }

  ngOnInit() {
    this.self.subscribe((res) => {
      this.updateForm(res.firstname, res.lastname);
    });
  }

  updateForm(firstname?: string, lastname?: string) {
    this.updateUserForm.patchValue({
      firstname,
      lastname,
    });
  }

  onSubmit() {
    this.userService
      .updateUser(
        this.updateUserForm.get('firstname').value,
        this.updateUserForm.get('lastname').value
      )
      .subscribe((res) => {
        this.updateForm(res.firstname, res.lastname);
      });
  }
}
