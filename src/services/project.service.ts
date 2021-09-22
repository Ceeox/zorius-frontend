import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';

import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import {
  FETCH_POLICY,
  POLLING_INTERVAL,
  RETRY_COUNT,
  RETRY_DELAY,
} from 'src/app/graphql.module';
import { ListProjects, Project } from 'src/models/project';

@Injectable({
  providedIn: 'root',
})
export class ListProjectsGQL extends Query<ListProjects> {
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
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class NewProjectGQL extends Mutation<Project> {
  document = gql`
    mutation updateProject(
      $id: string!
      $description: String
      $name: String
      $note: String
    ) {
      updateProject(
        id: $id
        update: { description: $description, name: $name, note: $note }
      ) {
        id
        description
        name
        note
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateProjectGQL extends Mutation<Project> {
  document = gql`
    mutation newProject($description: String!, $name: String!, $note: String) {
      newProject(new: { description: $description, name: $name, note: $note }) {
        id
        description
        name
        note
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteProjectGQL extends Mutation<boolean> {
  document = gql`
    mutation deleteProject($id: string!) {
      deleteProject(id: $id)
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private listAllProjectsGQL: ListProjectsGQL,
    private newProjectGQL: NewProjectGQL,
    private updateProjectsGQL: UpdateProjectGQL,
    private deleteProjectsGQL: DeleteProjectGQL
  ) {}

  newProject(
    description: string,
    name: string,
    note?: string
  ): Observable<Project> {
    return this.newProjectGQL.mutate({ description, name, note }).pipe(
      map((res) => {
        return res.data;
      }),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  updateProject(
    id: string,
    description: String,
    name: String,
    note: String
  ): Observable<Project> {
    return this.updateProjectsGQL.mutate({ id, description, name, note }).pipe(
      map((res) => {
        return res.data;
      }),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  listProjects(
    first?: number,
    last?: number,
    after?: String,
    before?: String
  ): Observable<ListProjects> {
    return this.listAllProjectsGQL
      .watch(
        {
          first,
          last,
          after,
          before,
        },
        {
          fetchPolicy: FETCH_POLICY,
        }
      )
      .valueChanges.pipe(
        map((res) => {
          return res.data;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  deleteProject(id: string) {
    return this.deleteProjectsGQL.mutate({ id }).subscribe();
  }
}
