import { Component, OnInit } from '@angular/core';
import { Observable } from '@apollo/client/utilities';
import { WorkReport } from 'src/models/work-reports';

@Component({
  selector: 'app-list-wr-today',
  templateUrl: './list-wr-today.component.html',
  styleUrls: ['./list-wr-today.component.scss'],
})
export class ListWrTodayComponent implements OnInit {
  workReports: Observable<WorkReport[]>;

  constructor() {}

  ngOnInit() {}
}
