import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
  selector: 'app-work-reports',
  templateUrl: './work-reports.component.html',
  styleUrls: ['./work-reports.component.scss'],
})
export class WorkReportsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
