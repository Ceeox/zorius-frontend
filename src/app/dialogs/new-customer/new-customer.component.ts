import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewCustomer } from 'src/models/customer';
import { NewWorkReport } from 'src/models/work-reports';
import { NewWorkReportComponent } from '../new-work-report/new-work-report.component';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss'],
})
export class NewCustomerComponent {
  myControl = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    identifier: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    note: new FormControl('', Validators.maxLength(255)),
  });

  constructor(
    public dialogRef: MatDialogRef<NewWorkReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewWorkReport
  ) {}

  onSubmit() {
    const result: NewCustomer = {
      name: this.myControl.get('name').value,
      identifier: this.myControl.get('identifier').value,
      note: this.myControl.get('note').value,
    };
    this.dialogRef.close(result);
  }
}
