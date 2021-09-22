import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewInternMerchandise } from 'src/models/intern-merch';

@Component({
  selector: 'new-intern-merch.dialog',
  templateUrl: 'new-intern-merch.dialog.html',
  styleUrls: ['./new-intern-merch.dialog.scss'],
})
export class NewInternMerchDialog {
  constructor(
    public dialogRef: MatDialogRef<NewInternMerchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NewInternMerchandise
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  saveAndClose() {
    this.dialogRef.close(this.data);
  }
}
