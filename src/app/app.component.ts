import { Component } from '@angular/core';


export const POLLING_INTERVAL = 10000;
export const SNACKBAR_TIMEOUT = 5000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zorius';
}
