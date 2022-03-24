import { Connection } from './page-info';
import { Customer } from './customer';
import { Project } from './project';
import { User } from './user';

export interface WorkReport {
  id: string;
  owner: User;
  timeRecords: TimeRecord[];
  invoiced: boolean;
  description: string;
  projects?: Project[];
  customer: Customer;
  createdAt: Date;
}

export interface TimeRecord {
  id: string;
  start: Date;
  end?: Date;
}

export interface NewWorkReport {
  customerId: string;
  projectId: string;
  description: String;
  invoiced: boolean;
}

export interface UpdateWorkReport {
  id: string;
  forUserId?: string;
  customer?: string;
  project?: string;
  description?: string;
  invoiced?: boolean;
  timeRecordUpdate?: TimeRecordUpdate;
}

export interface TimeRecordUpdate {
  id: string;
  command?: TimeRecordCommand;
  updateStart?: Date;
  updateEnd?: Date;
}

export enum TimeRecordCommand {
  Start,
  End,
}

export interface ListWorkReport {
  workReports: Connection<WorkReport>;
}
