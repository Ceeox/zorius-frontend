import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Edge } from 'src/models/page-info';
import { User } from 'src/models/user';
import { UsersGQL } from 'src/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$: Observable<Edge<User>[]>;
  displayedColumns: string[] = ['name', 'email', 'isAdmin', 'edit', 'disable'];

  constructor(private users: UsersGQL) {
    this.users$ = this.users
      .watch(
        {},
        {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
        }
      )
      .valueChanges.pipe(
        map((result) => {
          return result.data.users.edges;
        })
      );
  }

  ngOnInit(): void {}
}
