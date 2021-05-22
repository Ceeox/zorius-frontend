
import ObjectID from "bson-objectid";
import { Customer } from "./customer";
import { PageInfo } from "./page-info";
import { Project } from "./project";

export interface WorkReport {
    id: ObjectID,
    status: WorkReportStatus,
    times: WorkReportTimes[],
    invoiced: boolean,
    description: string,
    projects: Project[],
    customer: Customer,
    createdAt: Date,
    tripInfo: TripInfo
}

export interface TripInfo {
    fromCustomerArrived: Date,
    fromCustomerStarted: Date,
    toCustomerArrived: Date,
    toCustomerStarted: Date,
}

export interface WorkReportTimes {
    started: Date,
    ended: Date,
}

export enum WorkReportStatus {
    FINISHED,
    PAUSED,
    RUNNING
}

export interface NewWorkReport {
    customerId: ObjectID,
    projectId: ObjectID,
    description: String,

    fromCustomerArrived?: Date,
    fromCustomerStarted?: Date,
    toCustomerArrived?: Date,
    toCustomerStarted?: Date,
}

export interface UpdateWorkReport {
    customerId: ObjectID,
    description: String,
    invoiced: boolean,
    projectId: ObjectID,
    status: WorkReportStatus

    fromCustomerArrived: Date,
    fromCustomerStarted: Date,
    toCustomerArrived: Date,
    toCustomerStarted: Date,
}

export interface ListWorkReport {
    listProjects: WorkReportConnection;
}

export interface WorkReportConnection {
    edges: WorkReportEdge[];
    pageInfo: PageInfo;
}

export interface WorkReportEdge {
    cursor: String;
    node: WorkReport;
}