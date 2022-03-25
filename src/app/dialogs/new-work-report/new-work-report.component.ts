import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { Project } from 'src/models/project';
import { NewWorkReport } from 'src/models/work-reports';
import { CustomersGQL } from 'src/services/customer/customers.gql';

@Component({
  selector: 'app-new-work-report',
  templateUrl: './new-work-report.component.html',
  styleUrls: ['./new-work-report.component.scss'],
})
export class NewWorkReportComponent implements OnInit, OnDestroy {
  myControl = new FormGroup({
    customer: new FormControl('', Validators.required),
    project: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    description: new FormControl('', Validators.required),
    invoiced: new FormControl(false, Validators.required),
  });
  customers$: Observable<Edge<Customer>[]>;
  projects$: Observable<Project[]>;

  constructor(
    public dialogRef: MatDialogRef<NewWorkReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewWorkReport,
    private customersGQL: CustomersGQL
  ) {
    this.customers$ = this.customersGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          return result.data.customers.edges;
        })
      );
  }

  ngOnInit(): void {
    this.projects$ = this.myControl.get('customer').valueChanges.pipe(
      map((c: Customer) => {
        this.myControl.get('project').enable();
        return c.projects;
      })
    );
  }

  ngOnDestroy(): void {}

  onSubmit() {
    const result: NewWorkReport = {
      customerId: this.myControl.get('customer').value.id,
      projectId: this.myControl.get('project').value.id,
      description: this.myControl.get('description').value,
      invoiced: this.myControl.get('invoiced').value,
    };
    this.dialogRef.close(result);
  }
}
