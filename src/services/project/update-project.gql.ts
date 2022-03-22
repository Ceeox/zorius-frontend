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
