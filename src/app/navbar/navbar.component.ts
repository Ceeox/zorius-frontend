import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { Observable } from 'rxjs';
import { ThemeSwitchService } from 'src/services/theme-switch.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  avatarUrl: Observable<string>;
  userName: Observable<string>;

  isDarkMode: boolean;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private themeSwitch: ThemeSwitchService
  ) {
    this.isDarkMode = this.themeSwitch.prefersColorSchemeDark();
  }

  ngOnInit(): void {}

  storeThemeMode(): void {
    if (this.isDarkMode) {
      this.themeSwitch.selectDarkTheme();
    } else {
      this.themeSwitch.selectLightTheme();
    }
  }

  isLogedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  private getAvatarUrl(): Observable<string> {
    return this.userService.getSelf().pipe(
      map((user) => {
        console.log('user avatarUrl: ' + user.avatarUrl);
        return user.avatarUrl;
      })
    );
  }

  private getUserName(): Observable<string> {
    return this.userService.getSelf().pipe(
      map((user) => {
        return user.firstname + ' ' + user.lastname;
      })
    );
  }
}
