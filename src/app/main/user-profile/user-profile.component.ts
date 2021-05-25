import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/models/user';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  self: Observable<User>
  updateUserForm = this.fb.group({
    username: [''],
    firstname: [''],
    lastname: ['']
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.self = this.userService.getSelf().pipe(
      map(res => {
        this.updateUserForm.patchValue({
          username: res.username,
          firstname: res.firstname,
          lastname: res.lastname,
        })
        return res;
      })
    );
  }

  onSubmit() {
  }

}
