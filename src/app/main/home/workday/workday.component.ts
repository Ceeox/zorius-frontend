import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { GetWorkdayGQL, TimeRecord, WorkDay, WorkdayPauseGQL, WorkDayResumeGQL, WorkDayStartGQL } from './graphql.module';

enum WorkdayState {
  Start = "start",
  Pause = "pause",
  Resume = "resume",
}

enum ControlText {
  Start = "Starte dein Arbeitstag",
  Pause = "Mache eine Pause",
  Resume = "Beende deine Pause",
}

@Component({
  selector: 'app-workday',
  templateUrl: './workday.component.html',
  styleUrls: ['./workday.component.scss']
})
export class WorkdayComponent implements OnInit {
  contolButtonState: WorkdayState = WorkdayState.Start;
  controlText: ControlText = ControlText.Start;
  startedTime: number = 0;
  time: string = "00:00:00";
  TRRunning: boolean = false;
  interval: NodeJS.Timeout | null;
  workday: WorkDay | null;
  timeRecordsSource = new MatTableDataSource<TimeRecord>();
  displayedColumns: string[] = ['position', 'started', 'ended', 'duration'];
  currentWorkdayState = WorkdayState.Start;

  isLoadingResults = true;
  isRateLimitReached = false;
  startWorkdayGQL: any;

  constructor(
    private getWorkdayGQL: GetWorkdayGQL,
    private workDayStartGQL: WorkDayStartGQL,
    private workdayPauseGQL: WorkdayPauseGQL,
    private workDayResumeGQL: WorkDayResumeGQL,
  ) {

  }

  ngOnInit(): void {
    this.getWorkday();
  }

  formatToHHmm(date: string): string {
    if (date == null) {
      return "00:00";
    }
    return (moment(new Date(date))).format("HH:mm");
  }

  isTRRunning(): boolean {
    let res = false;
    this.workday.timeRecords.find((tr) => {
      if (tr.isRunning === true) {
        res = true;
      }
    });
    return res;
  }

  isWorkdayResumable(): boolean {
    return this.workday.timeRecords.length >= 0;
  }

  getRunningTR(): TimeRecord {
    let tr = null;
    this.workday.timeRecords.find((_tr) => {
      if (_tr.isRunning)
        tr = _tr;
    });
    return tr;
  }

  getWorkday() {
    let today = (moment(Date.now())).format("YYYY-MM-DD");
    this.getWorkdayGQL.watch({
      date: today
    }, {
      fetchPolicy: 'network-only'
    }).valueChanges.subscribe(({ data }) => {
      this.isLoadingResults = false;
      this.workday = data.getWorkday;
      if (this.isWorkdayResumable() && this.isTRRunning()) {
        this.switchControlState(WorkdayState.Pause);
      } else {
        this.switchControlState(WorkdayState.Resume);
      }
      this.timeRecordsSource.data = this.workday.timeRecords;
    }, err => {
      this.isRateLimitReached = true;
      console.log(err);
    });
  }

  updateWorkdayData(data: WorkDay) {
    this.workday = data;
    this.timeRecordsSource.data = data.timeRecords;
  }

  switchControlState(nextState: WorkdayState) {
    this.currentWorkdayState = nextState;

    switch (this.currentWorkdayState) {
      case WorkdayState.Start: {
        this.contolButtonState = WorkdayState.Start;
        this.controlText = ControlText.Start;
      } break;
      case WorkdayState.Pause: {
        this.contolButtonState = WorkdayState.Pause;
        this.controlText = ControlText.Pause;
      } break;
      case WorkdayState.Resume: {
        this.contolButtonState = WorkdayState.Resume;
        this.controlText = ControlText.Resume;
      } break;
    }
  }

  enableTimer() {
    this.startedTime = new Date(this.getRunningTR().started).getTime();
    this.interval = setInterval(() => {
      let dur = moment.duration(Date.now() - this.startedTime, "milliseconds");
      this.time = moment.utc(dur.as("milliseconds")).format("HH:mm:ss");
    }, 1000);
  }

  startWorkday() {
    this.workDayStartGQL.mutate({}).subscribe(({ data }) => {
      this.updateWorkdayData(data.workdayStart);
      this.TRRunning = true;
      this.enableTimer();
    }, err => {
      this.isRateLimitReached = true;
      console.log(err);
    });
  }

  pauseWorkday() {
    this.workdayPauseGQL.mutate({}).subscribe(({ data }) => {
      this.updateWorkdayData(data.workdayPause);
      this.TRRunning = false;
      this.switchControlState(WorkdayState.Resume);
      this.startedTime = 0;
      clearTimeout(this.interval);
      this.time = "00:00:00";
    }, err => {
      this.isRateLimitReached = true;
      console.log(err);
    });
  }

  resumeWorkday() {
    this.workDayResumeGQL.mutate({}).subscribe(({ data }) => {
      this.updateWorkdayData(data.workdayResume);
      this.TRRunning = true;
      this.switchControlState(WorkdayState.Pause);
      this.enableTimer();
    }, err => {
      this.isRateLimitReached = true;
      console.log(err);
    });

  }

  controlButtonClicked() {
    switch (this.currentWorkdayState) {
      case WorkdayState.Start: {
        this.switchControlState(WorkdayState.Pause);
        this.pauseWorkday();
      } break;
      case WorkdayState.Pause: {
        this.pauseWorkday();
        this.switchControlState(WorkdayState.Resume);
      } break;
      case WorkdayState.Resume: {
        this.resumeWorkday();
        this.switchControlState(WorkdayState.Pause);
      } break;
    }
  }

  getTRDuration(tr: TimeRecord): string {
    if (tr.ended === null) {
      return "running";
    } else {
      var dur = moment.duration(tr.duration, "seconds");
      var durStr = moment.utc(dur.as("milliseconds")).format("HH:mm");
      return durStr;
    }
  }
}
