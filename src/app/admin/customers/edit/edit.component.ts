import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  NewProjectComponent,
  NewProjectDialogData,
} from 'src/app/dialogs/new-project/new-project.dialog';
import { Customer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { NewProject } from 'src/models/project';
import { CustomerService } from 'src/services/customer/customer.service';
import { CustomersGQL } from 'src/services/customer/customers.gql';
import { UpdateCustomerGQL } from 'src/services/customer/update-customer.gql';
import { ProjectService } from 'src/services/project/project.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnDestroy {
  customer: Edge<Customer>;
  customerId: string;

  customerSub$?: Subscription;
  updateCustomerSub$?: Subscription;
  newProjectSub$?: Subscription;
  updateProjectSub$?: Subscription;
  dialogSub$?: Subscription;

  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    identifier: new FormControl('', Validators.required),
    note: new FormControl(''),
  });
  projectsFromArray = new FormArray([]);
  projectsFrom = new FormGroup({
    projects: this.projectsFromArray,
  });
  fb: FormBuilder = new FormBuilder();

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerGQL: CustomersGQL,
    private customerService: CustomerService,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.customerSub$?.unsubscribe();
    this.updateCustomerSub$?.unsubscribe();
    this.dialogSub$?.unsubscribe();
    this.newProjectSub$?.unsubscribe();
  }

  loadCustomers() {
    this.customerSub$ = this.customerGQL
      .watch({
        options: {
          ids: [this.customerId],
        },
      })
      .valueChanges.pipe(
        map((result) => {
          return result.data.customers.edges;
        })
      )
      .subscribe((edges) => {
        this.customer = edges.find((e) => e.node.id === this.customerId);
        this.customerForm.setValue({
          name: this.customer.node.name,
          identifier: this.customer.node.identifier,
          note: this.customer.node.note,
        });
        this.projectsFromArray.clear();
        this.customer.node.projects.map((project) => {
          const newProjectGroup = this.fb.group({
            id: new FormControl(project.id),
            name: new FormControl(project.name, Validators.required),
            note: new FormControl(project.note),
          });
          this.projectsFromArray.push(newProjectGroup);
        });
      });
  }

  onChangeCustomerName(edge: Edge<Customer>) {
    if (this.customerForm.get('name').invalid) {
      return;
    }
    this.updateCustomerSub$ = this.customerService
      .updateCustomer(this.customerId, {
        name: this.customerForm.get('name').value,
      })
      .subscribe(
        (result) =>
          (this.customer = { node: result.updateCustomer } as Edge<Customer>)
      );
  }

  onChangeCustomerIdentifier(edge: Edge<Customer>) {
    if (this.customerForm.get('identifier').invalid) {
      return;
    }
    this.updateCustomerSub$ = this.customerService
      .updateCustomer(this.customerId, {
        identifier: this.customerForm.get('identifier').value,
      })
      .subscribe(
        (result) =>
          (this.customer = { node: result.updateCustomer } as Edge<Customer>)
      );
  }

  onChangeCustomerNote(edge: Edge<Customer>) {
    this.updateCustomerSub$ = this.customerService
      .updateCustomer(this.customerId, {
        note: this.customerForm.get('note').value,
      })
      .subscribe(
        (result) =>
          (this.customer = { node: result.updateCustomer } as Edge<Customer>)
      );
  }

  onChangeProjectName(event: any, projectId: string) {
    this.updateProjectSub$ = this.projectService
      .updateProject(projectId, { name: event.target.value })
      .subscribe(() => this.loadCustomers());
  }

  onChangeProjectNote(event: any, projectId: string) {
    this.updateProjectSub$ = this.projectService
      .updateProject(projectId, { note: event.target.value })
      .subscribe(() => this.loadCustomers());
  }

  newProject() {
    const dialogRef = this.dialog.open(NewProjectComponent);

    this.dialogSub$ = dialogRef
      .afterClosed()
      .subscribe((result?: NewProjectDialogData) => {
        if (!result) return;

        this.newProjectSub$ = this.projectService
          .newProject({
            customerId: this.customerId,
            name: result.name,
            note: result.note,
          })
          .subscribe(() => {
            this.customerSub$?.unsubscribe();
            this.loadCustomers();
          });
      });
  }
}
