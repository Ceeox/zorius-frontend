import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TimeRecordCommand, WorkReport } from 'src/models/work-reports';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface TimeRecordEvent {
  workReportId: string;
  command: TimeRecordCommand;
}

@Component({
  selector: 'app-work-report-table',
  templateUrl: './work-report-table.component.html',
  styleUrls: ['./work-report-table.component.scss'],
})
export class WorkReportTableComponent implements OnInit, OnChanges {
  @Input() workReports: WorkReport[];
  @Input() disableStartStop: boolean = true;
  @Input() filter: string = '';
  @Output() newTimeRecordEvent = new EventEmitter<TimeRecordEvent>();
  dataSource: MatTableDataSource<WorkReport>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'start-stop',
    'description',
    'customer',
    'project',
    'invoiced',
    'duration',
    'edit',
  ];
  constructor() {
    this.dataSource = new MatTableDataSource(this.workReports);
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'workReports') {
        this.dataSource.data = changes[propName].currentValue;
      }
      if (propName === 'disableStartStop') {
        this.disableStartStop = changes[propName].currentValue;
      }
      if (propName === 'filter') {
        this.dataSource.filter = changes[propName].currentValue
          .trim()
          .toLowerCase();
      }
    }
  }

  getDisplayedColumns(): string[] {
    return this.displayedColumns.filter((dC) => {
      if (dC === 'start-stop' && this.disableStartStop) {
        return;
      } else {
        return dC;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  startTimeRecord(workReportId: string) {
    this.newTimeRecordEvent.emit({
      workReportId,
      command: TimeRecordCommand.Start,
    });
  }

  stopTimeRecord(workReportId: string) {
    this.newTimeRecordEvent.emit({
      workReportId,
      command: TimeRecordCommand.End,
    });
  }

  getDuration(edge: WorkReport): Date {
    let durMillisecs = 0;
    edge.timeRecords.forEach((tr) => {
      if (!tr.end) {
        durMillisecs +=
          new Date(Date.now()).getTime() - new Date(tr.start).getTime();
      } else {
        durMillisecs +=
          new Date(tr.end).getTime() - new Date(tr.start).getTime();
      }
    });
    return new Date(durMillisecs / 1000 / 60);
  }

  isTimeRecordActive(workReport: WorkReport): boolean {
    let active = false;
    workReport.timeRecords.filter((tr) => {
      if (!tr.end) {
        active = true;
      }
    });
    return active;
  }
}
