import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { FETCH_POLICY, RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import { NewProject, Project, UpdateProject } from 'src/models/project';
import { DeleteProjectGQL } from './delete-project.gql';
import { NewProjectGQL, NewProjectResult } from './new-project.gql';
import { ProjectsGQL, ListProjects } from './projects.gql';
import { UpdateProjectGQL } from './update-project.gql';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private projectsGQL: ProjectsGQL,
    private newProjectGQL: NewProjectGQL,
    private updateProjectsGQL: UpdateProjectGQL,
    private deleteProjectsGQL: DeleteProjectGQL
  ) {}

  newProject(newProject: NewProject): Observable<Project> {
    return this.newProjectGQL.mutate(newProject).pipe(
      map((res) => {
        return res.data.newProject;
      }),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }

  updateProject(id: string, update: UpdateProject): Observable<Project> {
    return this.updateProjectsGQL
      .mutate({ id, name: update.name, note: update.note })
      .pipe(
        map((res) => {
          return res.data;
        }),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  projects(options: {
    ids?: string[];
    first?: number;
    last?: number;
    after?: String;
    before?: String;
  }): Observable<ListProjects> {
    return this.projectsGQL
      .watch(
        {
          options,
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
