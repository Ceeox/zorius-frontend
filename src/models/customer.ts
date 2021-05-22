

import ObjectID from "bson-objectid";
import { PageInfo } from "./page-info";
import { Project } from "./project";

export interface ListCustomers {
    listCustomers: CustomerConnection;
}

export interface NewCustomer {
    newCustomer: Customer;
}

export interface CustomerConnection {
    edges: CustomerEdge[];
    pageInfo: PageInfo;
}

export interface CustomerEdge {
    cursor: String;
    node: Customer;
}

export interface Customer {
    id: ObjectID,
    name: string,
    idenifier: string,
    note: string,
    projects: Project[];
}