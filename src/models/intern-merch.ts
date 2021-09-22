import ObjectID from 'bson-objectid';
import { PageInfo } from './page-info';
import { User } from './user';

export interface ListInternMerch {
  listInternMerch: InternMerchandiseConnection;
}

export interface GetInternMerchById {
  getInternMerchById: InternMerchandise;
}

export interface CountMerchResponse {
  countInternMerch: number;
}

export interface DeleteInternMerch {
  deleteInternMerch: boolean;
}

export interface NewInternMerch {
  newInternMerch: InternMerchandise;
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
  id: string;
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
  articleNumber?: String;
  postage?: number;
  useCase: String;
  cost: number;
  ordererId: string;
  projectLeaderId: string;
  shop: string;
}

export interface UpdateInternMerchandise {
  articleNumber?: String;
  cost?: number;
  count?: number;
  invoiceNumber?: number;
  merchandiseId?: number;
  merchandiseName?: String;
  ordererId?: string;
  postage?: number;
  projectLeaderId?: string;
  serialNumber?: String[];
  shop?: String;
  url?: String;
  useCase?: String;
  status?: string;
}
