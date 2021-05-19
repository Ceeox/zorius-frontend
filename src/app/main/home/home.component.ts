import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }
}
