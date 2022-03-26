import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { Project } from 'src/models/project';
import {
  NewWorkReport,
  UpdateWorkReport,
  WorkReport,
} from 'src/models/work-reports';
import { CustomersGQL } from 'src/services/customer/customers.gql';
import { NewWorkReportComponent } from '../new-work-report/new-work-report.component';

@Component({
  selector: 'app-update-work-report',
  templateUrl: './update-work-report.component.html',
  styleUrls: ['./update-work-report.component.scss'],
})
export class UpdateWorkReportComponent implements OnInit {
  myControl = new FormGroup({
    customer: new FormControl('', Validators.required),
    project: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    invoiced: new FormControl(false, Validators.required),
  });
  customers$: Observable<Edge<Customer>[]>;
  projects$: Observable<Project[]>;

  constructor(
    public dialogRef: MatDialogRef<UpdateWorkReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkReport,
    private customersGQL: CustomersGQL
  ) {
    this.myControl.setValue(
      {
        customer: this.data.customer,
        project: this.data.project,
        description: this.data.description,
        invoiced: this.data.invoiced,
      },
      { emitEvent: true }
    );
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
    this.projects$ = this.myControl
      .get('customer')
      .valueChanges.pipe(map((c) => c.projects));
  }

  onSubmit() {
    const result: UpdateWorkReport = {
      id: this.data.id,
      customer: this.myControl.get('customer').value.id,
      project: this.myControl.get('project').value.id,
      description: this.myControl.get('description').value,
      invoiced: this.myControl.get('invoiced').value,
    };
    this.dialogRef.close(result);
  }
}
