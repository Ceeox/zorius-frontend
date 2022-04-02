import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';

export interface DeleteProjectResult {
  deleteProject: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteProjectGQL extends Mutation<DeleteProjectResult> {
  document = gql`
    mutation deleteProject($id: UUID!) {
      deleteProject(id: $id)
    }
  `;
}
