import { Customer } from './customer';

export interface Project {
  id: string;
  name: string;
  note: string;
  customer: Customer;
}

export interface NewProject {
  name: string;
  note?: string;
  customerId: string;
}
