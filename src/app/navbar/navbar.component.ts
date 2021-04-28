import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { User, UserService } from 'src/services/user.service';
import { Observable } from 'rxjs';
import { subscribe } from 'graphql';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  avatarUrl: Observable<string>;
  userName: Observable<string>;

  constructor(
    public authService: AuthService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
  }

  isLogedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  private getAvatarUrl(): Observable<string> {
    return this.userService.getUser().pipe(
      map((user) => {
        console.log("user avatarUrl: " + user.avatarUrl);
        return user.avatarUrl;
      })
    );
  }

  private getUserName(): Observable<string> {
    return this.userService.getUser().pipe(
      map((user) => { return user.firstname + " " + user.lastname; })
    );
  }
}
