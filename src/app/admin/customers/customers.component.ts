import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { NewCustomerComponent } from 'src/app/dialogs/new-customer/new-customer.component';
import { Customer, NewCustomer } from 'src/models/customer';
import { Edge } from 'src/models/page-info';
import { CustomersGQL } from 'src/services/customer/customers.gql';
import { NewCustomerGQL } from 'src/services/customer/new-customer.gql';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'identifier', 'note', 'edit'];

  customers$: Observable<Edge<Customer>[]>;

  newCustomerSub$?: Subscription;
  dialogSub$?: Subscription;

  constructor(
    public dialog: MatDialog,
    private customersGQL: CustomersGQL,
    private newCustomerGQL: NewCustomerGQL
  ) {
    this.customers$ = this.customersGQL.fetch({}).pipe(
      map((result) => {
        return result.data.customers.edges;
      })
    );
  }

  ngOnInit(): void {}

  newCustomer() {
    const dialogRef = this.dialog.open(NewCustomerComponent);

    this.dialogSub$ = dialogRef
      .afterClosed()
      .subscribe((result?: NewCustomer) => {
        if (!result) return;

        this.newCustomerSub$ = this.newCustomerGQL
          .mutate(result)
          .pipe(
            map((res) => {
              return res.data;
            })
          )
          .subscribe();
      });
  }

  updateCustomer(edge: Edge<Customer>) {}

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.customers$.filter = filterValue.trim().toLowerCase();
  // }
}
