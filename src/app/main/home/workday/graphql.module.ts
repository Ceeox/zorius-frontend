import { Injectable } from "@angular/core";
import { Query, gql, Mutation } from 'apollo-angular';

export interface TimeRecord {
    id: number,
    isRunning: boolean;
    started: Date;
    ended: Date;
    duration: number;
}

export interface WorkDay {
    date: Date;
    worktimeSecs: number;
    absentReason?: string;
    worktargetSecs: number;
    timeRecords: TimeRecord[];
}


export interface GetWorkDayResponse {
    getWorkday: WorkDay;
}
@Injectable({
    providedIn: 'root',
})
export class GetWorkdayGQL extends Query<GetWorkDayResponse> {
    document = gql`query getWorkday($date: NaiveDate) {
        getWorkday(date: $date) {

            date
            worktimeSecs
            absentReason
            worktargetSecs
            timeRecords {
                id
                isRunning
                started
                ended
                duration
            }
        }
    }`;
}

export interface WorkDayStartResponse {
    workdayStart: WorkDay;
}
@Injectable({
    providedIn: 'root',
})
export class WorkDayStartGQL extends Mutation<WorkDayStartResponse> {
    document = gql`mutation workdayStart {
        workdayStart {
            date
            worktimeSecs
            absentReason
            worktargetSecs
            timeRecords {
                id
                isRunning
                started
                ended
                duration
            }
        }
    }`;
}

export interface WorkdayPauseResponse {
    workdayPause: WorkDay;
}
@Injectable({
    providedIn: 'root',
})
export class WorkdayPauseGQL extends Mutation<WorkdayPauseResponse> {
    document = gql`mutation workdayPause {
        workdayPause {
            date
            worktimeSecs
            absentReason
            worktargetSecs
            timeRecords {
                id
                isRunning
                started
                ended
                duration
            }
        }
    }`;
}

export interface WorkDayResumeResponse {
    workdayResume: WorkDay;
}
@Injectable({
    providedIn: 'root',
})
export class WorkDayResumeGQL extends Mutation<WorkDayResumeResponse> {
    document = gql`mutation workdayResume {
        workdayResume {
            date
            worktimeSecs
            absentReason
            worktargetSecs
            timeRecords {
                id
                isRunning
                started
                ended
                duration
            }
        }
    }`;
}
