import { Customer } from './customer';

export interface Project {
  id: string;
  name: string;
  note: string;
  customer: Customer;
}

export interface NewProject {
  customerId: string;
  name: string;
  note?: string;
}

export interface UpdateProject {
  name?: string;
  note?: string;
}
