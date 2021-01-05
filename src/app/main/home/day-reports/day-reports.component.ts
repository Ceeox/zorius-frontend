import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-reports',
  templateUrl: './day-reports.component.html',
  styleUrls: ['./day-reports.component.scss']
})
export class DayReportsComponent implements OnInit {
  panelOpenState: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
