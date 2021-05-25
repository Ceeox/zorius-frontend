
import ObjectID from "bson-objectid";
import { PageInfo } from "./page-info";

export interface User {
    id: ObjectID;
    email: string;
    username: string;
    firstname?: string;
    lastname?: string;
    updated: Date;
    createdAt: Date;
    avatarUrl?: string;
}

export interface GetUserByIdResp {
    getUserById: User;
}

export interface ListUsers {
    listUsers: UserConnection;
}

export interface UserConnection {
    edges: UserEdge[];
    pageInfo: PageInfo;
}

export interface UserEdge {
    cursor: String;
    node: User;
}

export interface UpdateUserResp {
    updateUser: User;
}