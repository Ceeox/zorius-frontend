
import { ObjectID } from "mongodb";
import { PageInfo } from "./page-info";

export interface ListProjects {
    listProjects: ProjectConnection;
}

export interface ProjectConnection {
    edges: ProjectEdge[];
    pageInfo: PageInfo;
}

export interface ProjectEdge {
    cursor: String;
    node: Project;
}

export interface Project {
    id: ObjectID,
    name: string,
    idenifier: string,
    note: string,
}

export interface NewProject {
    description: string,
    name: string,
    note?: string,
}