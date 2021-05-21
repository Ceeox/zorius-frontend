import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import { CustomerEdge } from 'src/models/customer';
import { NewProject, Project } from 'src/models/project';
import { CustomerService } from 'src/services/customer.service';
import { ProjectService } from 'src/services/project.service';
import { NewProjectDialog } from 'src/app/dialogs/new-project/new-project.dialog';

@Component({
  selector: 'app-new-wr',
  templateUrl: './new-wr.component.html',
  styleUrls: ['./new-wr.component.scss']
})
export class NewWrComponent implements OnInit {
  //customerOptions: string[] = ['GKL Test Kunde GmbH & Co. KG', 'T45 Test Kunde', 'LSM Test Kunde'];
  customerOptions: Observable<CustomerEdge[]>;
  projectOptions: Observable<Project[]>;

  selectedCustomerId: number;
  selectedProjectId: string;

  newWRForm = this.fb.group({
    customer: [''],
    project: [''],
    description: [''],
  });
  invoiced: boolean = false;

  constructor(
    public newProjectDialog: MatDialog,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
  ) {
    this.customerOptions = this.customerService.listCustomers().pipe(
      map(result => {
        return result.listCustomers.edges;
      })
    );
  }

  ngOnInit() {

  }

  newProject() {
    const newProject: NewProject = undefined;
    const dialogRef = this.newProjectDialog.open(NewProjectDialog, {
      maxWidth: '125rem',
      hasBackdrop: true,
      disableClose: false,
      data: { newProject: newProject }
    });

    dialogRef.afterClosed().subscribe((result: NewProject) => {
      if (result) {
        this.projectService.newProject(result.description, result.name, result.note);
      }
    });
  }

  onCustomerChange(event: MatSelectChange) {
    this.projectOptions = new Observable(subscriber => {
      subscriber.next(event.value.projects);
    });
  }

  onSubmit() {
    console.warn(this.newWRForm.value);
    this.snackBar.open("Not yet implemented!")._dismissAfter(SNACKBAR_TIMEOUT);
  }
}
