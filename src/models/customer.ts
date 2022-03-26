import { Project } from './project';

export interface Customer {
  id: string;
  name: string;
  identifier: string;
  note: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateCustomer {
  name?: string;
  identifier?: string;
  note?: string;
  projects?: string[];
}

export interface NewCustomer {
  name: string;
  identifier: string;
  note?: string;
}

export interface ListCustomerOptions {
  ids?: string[];
  first?: number;
  last?: number;
  after?: String;
  before?: String;
}
