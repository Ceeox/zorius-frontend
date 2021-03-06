import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { Project } from 'src/models/project';

export interface UpdateProjectResult {
  updateProject: Project;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateProjectGQL extends Mutation<Project> {
  document = gql`
    mutation updateProject($id: UUID!, $name: String, $note: String) {
      updateProject(id: $id, update: { name: $name, note: $note }) {
        id
        name
        note
      }
    }
  `;
}
