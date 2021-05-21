
import { ObjectID } from "mongodb";
import { PageInfo } from "./page-info";
import { User } from "./user";

export interface ListInternMerch {
    listInternMerch: InternMerchandiseConnection;
}

export interface CountMerchResponse {
    countInternMerch: number
}

export interface InternMerchandiseConnection {
    edges: InternMerchandiseEdge[];
    pageInfo: PageInfo;
}

export interface InternMerchandiseEdge {
    cursor: number;
    node: InternMerchandise;
}

export interface InternMerchandise {
    id: ObjectID;
    articleNumber: String;
    merchandiseId: number;
    merchandiseName: String;
    cost: number;
    orderer: User;
    projectLeader: User;
    status: InternMerchandiseStatus;
    count: number;
    createdDate: Date;
    updatedDate: Date;
    purchasedOn: Date;

    postage?: number;
    arivedOn?: Date;
    url?: String;
    serialNumber?: String[];
    invoiceNumber?: number;
    shop?: String;
    useCase?: String;
}

export interface Orderer {
    firstname?: String;
    lastname?: String;
    username: String;
}

export enum InternMerchandiseStatus {
    Ordered,
    Delivered,
    Stored,
    Used,
}

export interface NewInternMerchandise {
    merchandiseName: String;
    count: number;
    url?: String;
    purchasedOn: Date;
    articleNumber?: String,
    postage?: number;
    useCase: String;
    cost: number;
    orderer: ObjectID,
    shop: string,
}

export interface UpdateInternMerchandise {
    arivedOn?: Date;
    articleNumber?: String;
    cost?: number;
    count?: number;
    invoiceNumber?: number;
    merchandiseId?: number;
    merchandiseName?: String;
    orderer?: User;
    postage?: number;
    projectLeader?: String;
    purchasedOn?: Date;
    serialNumber?: String[];
    shop?: String;
    url?: String;
    useCase?: String;
}