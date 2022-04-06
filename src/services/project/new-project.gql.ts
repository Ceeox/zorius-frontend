import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { Project } from 'src/models/project';

export interface NewProjectResult {
  newProject: Project;
}

@Injectable({
  providedIn: 'root',
})
export class NewProjectGQL extends Mutation<NewProjectResult> {
  document = gql`
    mutation newProject($customerId: UUID!, $name: String!, $note: String) {
      newProject(new: { customerId: $customerId, name: $name, note: $note }) {
        id
        name
        note
      }
    }
  `;
}
