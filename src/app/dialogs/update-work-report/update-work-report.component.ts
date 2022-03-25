import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { Project } from 'src/models/project';
import { NewWorkReport } from 'src/models/work-reports';
import { NewWorkReportComponent } from '../new-work-report/new-work-report.component';

@Component({
  selector: 'app-update-work-report',
  templateUrl: './update-work-report.component.html',
  styleUrls: ['./update-work-report.component.scss'],
})
export class UpdateWorkReportComponent implements OnInit {
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
    public dialogRef: MatDialogRef<UpdateWorkReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewWorkReport
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.dialogRef.close();
  }
}
