import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Connection } from 'src/models/page-info';
import { Project } from 'src/models/project';

export interface ListProjects {
  projects: Connection<Project>;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsGQL extends Query<ListProjects> {
  document = gql`
    query projects {
      projects {
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
    }
  `;
}
