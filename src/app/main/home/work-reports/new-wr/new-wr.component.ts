import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import { CustomerEdge } from 'src/models/customer';
import { NewProject, Project } from 'src/models/project';
import { CustomerService } from 'src/services/customer.service';
import { ProjectService } from 'src/services/project.service';
import { NewProjectDialog } from 'src/app/dialogs/new-project/new-project.dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-wr',
  templateUrl: './new-wr.component.html',
  styleUrls: ['./new-wr.component.scss'],
})
export class NewWrComponent implements OnInit {
  //customerOptions: string[] = ['GKL Test Kunde GmbH & Co. KG', 'T45 Test Kunde', 'LSM Test Kunde'];
  customerOptions: Observable<CustomerEdge[]>;
  projectOptions: Observable<Project[]>;

  customerControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerEdge[]>;

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
    private snackBar: MatSnackBar
  ) {
    this.customerOptions = this.customerService.listCustomers().pipe(
      map((result) => {
        return result.listCustomers.edges;
      })
    );
    this.filteredCustomerOptions = this.customerControl.valueChanges.pipe(
      startWith(''),
      mergeMap((filter: string) => {
        return this.customerOptions.pipe(
          map((customers) => {
            return customers.filter((option) =>
              option.node.name.toLowerCase().includes(filter.toLowerCase())
            );
          })
        );
      })
    );
  }

  ngOnInit() {}

  newProject() {
    const newProject: NewProject = undefined;
    const dialogRef = this.newProjectDialog.open(NewProjectDialog, {
      maxWidth: '125rem',
      hasBackdrop: true,
      disableClose: false,
      data: { newProject: newProject },
    });

    dialogRef.afterClosed().subscribe((result: NewProject) => {
      if (result) {
        this.projectService.newProject(
          result.description,
          result.name,
          result.note
        );
      }
    });
  }

  onCustomerChange(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    this.projectOptions = new Observable((customer) => {
      customer.next(event.option.value.node.projects);
    });
  }

  onSubmit() {
    console.warn(this.newWRForm.value);
    this.snackBar.open('Not yet implemented!')._dismissAfter(SNACKBAR_TIMEOUT);
  }

  displayCustomer(edge: CustomerEdge) {
    return edge.node.name;
  }
}
