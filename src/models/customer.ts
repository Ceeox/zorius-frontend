import { Project } from './project';

export interface Customer {
  id: string;
  name: string;
  idenifier: string;
  note: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateCustomer {
  name?: string;
  idenifier?: string;
  note?: string;
  projects?: string[];
}

export interface NewCustomer {
  name: string;
  idenifier: string;
  note?: string;
  projects: Project[];
}

export interface ListCustomerOptions {
  ids?: string[];
  first?: number;
  last?: number;
  after?: String;
  before?: String;
}
