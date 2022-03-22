import { Connection } from './page-info';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarFilename: string;
  isAdmin: boolean;
}

export interface ListUsers {
  users: Connection<User>;
}

export interface UserUpdate {
  name?: string;
  isAdmin?: boolean;
}

export interface ListUserOptions {
  ids?: string[];
  first?: number;
  last?: number;
  after?: String;
  before?: String;
}
