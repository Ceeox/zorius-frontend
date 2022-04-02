import { Component, OnInit } from '@angular/core';
import {
  Theme,
  ThemeSwitchService,
} from 'src/services/theme-switch/theme-switch.service';

export const SNACKBAR_TIMEOUT = 5000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zorius';

  constructor() {}
}
