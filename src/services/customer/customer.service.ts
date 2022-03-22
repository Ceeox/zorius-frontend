import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, first, map, retryWhen, take } from 'rxjs/operators';
import { RETRY_COUNT, RETRY_DELAY } from 'src/app/graphql.module';
import {
  ListCustomerOptions,
  NewCustomer,
  UpdateCustomer,
} from 'src/models/customer';
import { CustomersGQL, Customers } from './customers.gql';
import { NewCustomerGQL, NewCustomerResult } from './new-customer.gql';
import { UpdateCustomerGQL, UpdateCustomerResult } from './update-customer-gql';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(
    private newCustomerGQL: NewCustomerGQL,
    private updateCustomerGQL: UpdateCustomerGQL,
    private listCustomersGQL: CustomersGQL
  ) {}

  newCustomer(_new: NewCustomer): Observable<NewCustomerResult> {
    return this.newCustomerGQL
      .mutate({
        _new,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        first(),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  updateCustomer(
    id: string,
    update: UpdateCustomer
  ): Observable<UpdateCustomerResult> {
    return this.updateCustomerGQL
      .mutate({
        id,
        update,
      })
      .pipe(
        map((res) => {
          return res.data;
        }),
        first(),
        retryWhen((errors) =>
          errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT))
        )
      );
  }

  customers(options?: ListCustomerOptions): Observable<Customers> {
    return this.listCustomersGQL.fetch({ options }).pipe(
      map((res) => {
        return res.data;
      }),
      take(1),
      retryWhen((errors) => errors.pipe(delay(RETRY_DELAY), take(RETRY_COUNT)))
    );
  }
}
