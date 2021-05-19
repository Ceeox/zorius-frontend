import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { throwServerError } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerResponseEdge, CustomerService } from 'src/services/customer.service';
import { ProjectResponseEdge, ProjectService } from 'src/services/Project.service';

@Component({
  selector: 'app-new-wr',
  templateUrl: './new-wr.component.html',
  styleUrls: ['./new-wr.component.scss']
})
export class NewWrComponent implements OnInit {
  //customerOptions: string[] = ['GKL Test Kunde GmbH & Co. KG', 'T45 Test Kunde', 'LSM Test Kunde'];
  customerOptions: Observable<CustomerResponseEdge[]>;
  projectOptions: Observable<ProjectResponseEdge[]>;

  selectedCustomer: string;
  selectedProject: string;

  newWRForm = this.fb.group({
    customer: [''],
    project: [''],
    description: [''],
  });
  invoiced: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private projectService: ProjectService,
  ) {
    this.customerOptions = this.customerService.listCustomers().pipe(
      map(result => {
        console.log(result)
        return result;
      })
    );

    this.projectOptions = this.projectService.listProjects().pipe(
      map(result => {
        console.log(result)
        return result;
      })
    );
  }

  ngOnInit() {
  }

  onSubmit() {
    console.warn(this.newWRForm.value);
  }
}
