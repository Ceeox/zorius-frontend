import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  isLogedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  profilePicUrl(): string {
    let user = this.authService.getUser();
    return user == null ? null : user.avatarUrl;
  }
}
