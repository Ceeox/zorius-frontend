import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import ObjectID from 'bson-objectid';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { POLLING_INTERVAL } from 'src/app/app.component';
import { PageInfo } from './intern-merch.service';

export interface ListAllProjectsResp {
  listProjects: ProjectResponseConnection;
}

export interface ProjectResponseConnection {
  edges: ProjectResponseEdge[];
  pageInfo: PageInfo;
}

export interface ProjectResponseEdge {
  cursor: String;
  node: ProjectResponse;
}

export interface ProjectResponse {
  id: ObjectID,
  name: string,
  idenifier: string,
  note: string,
}

@Injectable({
  providedIn: 'root',
})
export class ListAllProjectsGQL extends Query<ListAllProjectsResp> {
  document = gql`
  query listProjects {
    listProjects {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          id
          description
          name
          note
        }
        cursor
      }
    }
  }`;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private listAllProjectsGQL: ListAllProjectsGQL
  ) { }

  listProjects(): Observable<ProjectResponseEdge[]> {
    return this.listAllProjectsGQL.watch({
      fetchPolicy: 'network-only',
      pollInterval: POLLING_INTERVAL,
    }).valueChanges.pipe(
      map(res => {
        return res.data.listProjects.edges;
      }),
      catchError((e, c) => {
        console.error("listCustomersError: " + e);
        return c;
      })
    );
  }
}
