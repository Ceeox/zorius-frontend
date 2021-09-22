import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetWorkdayGQL,
  TimeRecord,
  WorkDay,
  WorkdayPauseGQL,
  WorkDayResumeGQL,
  WorkDayStartGQL,
} from './graphql.module';

enum WorkdayState {
  Start = 'start',
  Pause = 'pause',
  Resume = 'resume',
}

enum ControlText {
  Start = 'Starte dein Arbeitstag',
  Pause = 'Mache eine Pause',
  Resume = 'Beende deine Pause',
}

@Component({
  selector: 'app-workday',
  templateUrl: './workday.component.html',
  styleUrls: ['./workday.component.scss'],
})
export class WorkdayComponent implements OnInit {
  controlText: ControlText = ControlText.Start;
  currentWorkdayState = WorkdayState.Start;

  startedTime: number = 0;
  time: string = '00:00:00';
  runningTimeRecord: TimeRecord = null;
  timeout: any;

  workday: Observable<WorkDay>;

  timeRecordsSource = new MatTableDataSource<TimeRecord>();
  displayedColumns: string[] = ['position', 'started', 'ended', 'duration'];
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(
    private getWorkdayGQL: GetWorkdayGQL,
    private workDayStartGQL: WorkDayStartGQL,
    private workdayPauseGQL: WorkdayPauseGQL,
    private workDayResumeGQL: WorkDayResumeGQL
  ) {}

  ngOnInit(): void {
    this.getWorkday();
    this.workday.subscribe((wd) => {
      if (wd == null) {
        this.isLoadingResults = false;
        return;
      } else if (this.isWorkdayResumable(wd) && this.isTRRunning(wd)) {
        this.switchControlState(WorkdayState.Pause);
        let runningTR = this.getRunningTR(wd);
        this.enableTimer(runningTR.started);
      } else {
        this.switchControlState(WorkdayState.Resume);
      }
      this.timeRecordsSource.data = wd.timeRecords;
      this.isLoadingResults = false;
    });
  }

  formatToHHmm(date: string): string {
    if (date == null) {
      return '00:00';
    }
    return moment(new Date(date)).format('HH:mm');
  }

  isTRRunning(wd: WorkDay): boolean {
    let res = false;
    wd.timeRecords.find((tr) => {
      res = tr.isRunning;
      return;
    });
    return res;
  }

  getRunningTR(wd: WorkDay): TimeRecord {
    let res = null;
    wd.timeRecords.find((tr) => {
      res = tr;
      return;
    });
    return res;
  }

  isWorkdayResumable(wd: WorkDay): boolean {
    let res = false;
    if (this.workday != null) {
      res = wd.timeRecords.length >= 0;
    }
    return res;
  }

  getWorkday() {
    let today = moment(Date.now()).format('YYYY-MM-DD');
    this.workday = this.getWorkdayGQL
      .watch(
        {
          date: today,
        },
        {
          fetchPolicy: 'network-only',
        }
      )
      .valueChanges.pipe(
        map((data) => {
          return data.data.getWorkday;
        })
      );
  }

  updateWorkdayData(data: WorkDay) {
    this.workday = new Observable((observer) => observer.next(data));
    this.timeRecordsSource.data = data.timeRecords;
  }

  switchControlState(nextState: WorkdayState) {
    this.currentWorkdayState = nextState;

    switch (this.currentWorkdayState) {
      case WorkdayState.Start:
        {
          this.currentWorkdayState = WorkdayState.Start;
          this.controlText = ControlText.Start;
        }
        break;
      case WorkdayState.Pause:
        {
          this.currentWorkdayState = WorkdayState.Pause;
          this.controlText = ControlText.Pause;
        }
        break;
      case WorkdayState.Resume:
        {
          this.currentWorkdayState = WorkdayState.Resume;
          this.controlText = ControlText.Resume;
        }
        break;
    }
  }

  enableTimer(started: Date) {
    console.log('runningTR.started: ' + started);
    this.startedTime = new Date(started).getTime();
    this.timeout = setTimeout(() => {
      let dur = moment.duration(Date.now() - this.startedTime, 'milliseconds');
      this.time = moment.utc(dur.as('milliseconds')).format('HH:mm:ss');
    }, 1000);
  }

  startWorkday() {
    this.isLoadingResults = true;
    this.workDayStartGQL.mutate({}).subscribe(
      ({ data }) => {
        this.updateWorkdayData(data.workdayStart);
        let trLen = data.workdayStart.timeRecords.length;
        this.runningTimeRecord = data.workdayStart.timeRecords[trLen - 1];
        this.enableTimer(this.runningTimeRecord.started);
        this.isLoadingResults = false;
      },
      (err) => {
        this.isRateLimitReached = true;
        console.log(err);
      }
    );
  }

  pauseWorkday() {
    this.isLoadingResults = true;
    this.workdayPauseGQL.mutate({}).subscribe(
      ({ data }) => {
        this.updateWorkdayData(data.workdayPause);
        this.runningTimeRecord = null;
        this.switchControlState(WorkdayState.Resume);
        this.startedTime = 0;
        clearTimeout(this.timeout);
        this.time = '00:00:00';
        this.isLoadingResults = false;
      },
      (err) => {
        this.isRateLimitReached = true;
        console.log(err);
      }
    );
  }

  resumeWorkday() {
    this.isLoadingResults = true;
    this.workDayResumeGQL.mutate({}).subscribe(
      ({ data }) => {
        this.updateWorkdayData(data.workdayResume);
        let trLen = data.workdayResume.timeRecords.length;
        this.runningTimeRecord = data.workdayResume.timeRecords[trLen - 1];
        this.switchControlState(WorkdayState.Pause);
        this.enableTimer(this.runningTimeRecord.started);
        this.isLoadingResults = false;
      },
      (err) => {
        this.isRateLimitReached = true;
        console.log(err);
      }
    );
  }

  controlButtonClicked() {
    switch (this.currentWorkdayState) {
      case WorkdayState.Start:
        {
          this.switchControlState(WorkdayState.Pause);
          this.pauseWorkday();
        }
        break;
      case WorkdayState.Pause:
        {
          this.pauseWorkday();
          this.switchControlState(WorkdayState.Resume);
        }
        break;
      case WorkdayState.Resume:
        {
          this.resumeWorkday();
          this.switchControlState(WorkdayState.Pause);
        }
        break;
    }
  }

  getTRDuration(tr: TimeRecord): string {
    if (tr.ended === null) {
      return 'running';
    } else {
      var dur = moment.duration(tr.duration, 'seconds');
      var durStr = moment.utc(dur.as('milliseconds')).format('HH:mm');
      return durStr;
    }
  }
}
