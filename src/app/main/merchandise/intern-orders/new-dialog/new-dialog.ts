import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NewInternMerchandise } from "../graphql.module";


@Component({
    selector: 'new-dialog',
    templateUrl: 'new-dialog.html',
    styleUrls: ['./new-dialog.scss'],
})
export class NewDialog {
    constructor(
        public dialogRef: MatDialogRef<NewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: NewInternMerchandise) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
