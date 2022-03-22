import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import { NewProject, Project } from 'src/models/project';
import { CustomerService } from 'src/services/customer/customer.service';
import { ProjectService } from 'src/services/project/project.service';
import { NewProjectDialog } from 'src/app/dialogs/new-project/new-project.dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Customers } from 'src/services/customer/customers.gql';
import { Edge } from 'src/models/page-info';
import { Customer } from 'src/models/customer';

@Component({
  selector: 'app-new-wr',
  templateUrl: './new-wr.component.html',
  styleUrls: ['./new-wr.component.scss'],
})
export class NewWrComponent implements OnInit {
  customerOptions: Observable<Edge<Customer>[]>;
  projectOptions: Observable<Project[]>;

  customerControl = new FormControl();
  filteredCustomerOptions: Observable<Edge<Customer>[]>;

  selectedCustomerId: string;
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
    this.customerOptions = this.customerService.customers().pipe(
      map((result) => {
        return result.customers.edges;
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
        this.projectService.newProject(result.name, result.note);
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

  displayCustomer(edge: Edge<Customer>) {
    return edge.node.name;
  }
}
