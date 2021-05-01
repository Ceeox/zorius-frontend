import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { User, UserEdge, UserService } from "src/services/user.service";
import { InternMerchandise, UpdateInternMerchandise } from "../graphql.module";
import { UpdateDialogData } from "../intern-orders.component";

@Component({
    selector: 'update-dialog',
    templateUrl: 'update-dialog.html',
    styleUrls: ['./update-dialog.scss'],
})
export class UpdateDialog implements OnInit {
    ordererControl = new FormControl();
    projectLeaderControl = new FormControl();
    userOptions: Observable<UserEdge[]>;
    filteredUsers: Observable<UserEdge[]>;

    constructor(
        public dialogRef: MatDialogRef<UpdateDialog>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: UpdateDialogData,
    ) {
    }

    ngOnInit(): void {
        this.userOptions = this.userService.listAllUsers();
        this.ordererControl.valueChanges
            .pipe(
                startWith(''),
                map(val => this._filter(val))
            );
    }

    displayFn(user: User): string {
        var name = "";
        if (user && user.firstname && user.lastname) {
            name = user.firstname + " " + user.lastname;
        }
        if (user && user.username) {
            name = user.username;
        }
        return name;
    }

    private _filter(name: string) {
        const filterValue = name.toLowerCase();
        console.log("in filter");

        this.userOptions = this.userOptions.pipe(
            map(users => {
                return users.filter(user => this.displayFn(user.node)
                    .toLocaleLowerCase()
                    .includes(filterValue));
            })
        );
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
