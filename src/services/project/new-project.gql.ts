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
