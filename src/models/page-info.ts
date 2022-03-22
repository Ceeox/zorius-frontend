export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  startCursor: number;
  endCursor: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
