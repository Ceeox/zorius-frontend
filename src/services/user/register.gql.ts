import { Injectable } from '@angular/core';
import { Mutation, gql } from 'apollo-angular';
import { User } from 'src/models/user';

export interface RegisterResult {
  register: User;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterGQL extends Mutation<RegisterResult> {
  document = gql`
    mutation register($email: String!, $password: String!, $name: String) {
      register(new: { email: $email, password: $password, name: $name }) {
        id
        email
        isAdmin
        name
        avatarFilename
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;
}
