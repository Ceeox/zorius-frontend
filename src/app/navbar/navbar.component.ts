import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/services/auth/auth.service';
import { Observable } from 'rxjs';
import {
  Theme,
  ThemeSwitchService,
} from 'src/services/theme-switch/theme-switch.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  avatarFilename: Observable<string>;
  userName: Observable<string>;

  isDarkMode: boolean;

  constructor(
    public authService: AuthService,
    private themeSwitch: ThemeSwitchService
  ) {
    this.isDarkMode = this.themeSwitch.prefersDark();
  }

  ngOnInit(): void {}

  switchTheme(): void {
    if (this.isDarkMode) {
      this.themeSwitch.theme = Theme.Dark;
    } else {
      this.themeSwitch.theme = Theme.Light;
    }
  }

  isLogedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  private getAvatarUrl(): Observable<string> {
    return this.authService.user().pipe(
      map((user) => {
        console.log('user avatarFilename: ' + user.avatarFilename);
        return user.avatarFilename;
      })
    );
  }

  private getUserName(): Observable<string> {
    return this.authService.user().pipe(
      map((user) => {
        return user.name;
      })
    );
  }
}
