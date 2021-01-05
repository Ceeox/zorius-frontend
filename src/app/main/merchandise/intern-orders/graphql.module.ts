import { Injectable } from '@angular/core';
import { Query, Mutation, gql } from 'apollo-angular';
import { InternOrderTableData } from './intern-orders.component';


export interface Response {
  tableData: InternOrderTableData[];
}

@Injectable({
  providedIn: 'root',
})
export class InternOrderTableDataGQL extends Query<Response> {
  document = gql`
    query tableData {
      id
      arivedOn
      projectLeader
      url
      createdDate
      updatedDate
      orderer
      projectLeader
      count
      merchandiseId
      merchandiseName
      purchasedOn
      serialNumber
      invoiceNumber
      shop
      useCase
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class NewInternOrderGQL extends Mutation {
  document = gql`
    mutation newMerchandiseIntern($newInternOrder: NewInternOrder!) {
      newInternOrder(newInternOrder: $newInternOrder) {
        id
        arivedOn
        projectLeader
        url
        createdDate
        updatedDate
        orderer
        projectLeader
        count
        merchandiseId
        merchandiseName
        purchasedOn
        serialNumber
        invoiceNumber
        shop
        useCase
      }
    }`;
}