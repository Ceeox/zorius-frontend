import { Component, OnInit, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InternMerchandise, InternMerchandiseEdge, InternOrderTableDataGQL, NewInternOrderGQL } from './graphql.module';
import { Observable } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { UserService } from 'src/services/user.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import ObjectID from 'bson-objectid';

export interface NewInternOrder {
    merchandiseName: String;
    count: number;
    url?: String;
    purchasedOn: Date;
    articleNumber?: String,
    postage?: number;
    useCase: String;
    cost: number;
}

// export interface InternMerchandise {
//   merchandise_id: number;
//   merchandise_name: String;
//   count: number;
//   orderer: String,
//   purchased_on: Date;
//   article_number?: String,
//   postage: number;
//   cost: number;
//   status: InternMerchandiseStatus;
//   serial_number: String;
//   invoice_number: number;

//   useCase?: String;
//   arived_on?: Date;
//   url?: String;
// }


@Component({
    selector: 'app-intern-orders',
    templateUrl: './intern-orders.component.html',
    styleUrls: ['./intern-orders.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class InternOrdersComponent implements OnInit {


    internMerchandiseSource = new MatTableDataSource<InternMerchandiseEdge>();
    internMerch: Observable<InternMerchandiseEdge[]>
    displayedColumns = ['no.', 'id', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'actions'];
    pageSizeOptions = [5, 10, 25, 50];
    data;

    isLoadingResults = true;
    isRateLimitReached = false;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(public dialog: MatDialog,
        private tableDataGQL: InternOrderTableDataGQL,
        private newInternOrderGQL: NewInternOrderGQL,
        private userService: UserService) {
    }

    edit(merch: InternMerchandise) {
        console.log(merch.id);
    }

    ngOnInit() {
        this.loadTableData();
    }

    loadTableData() {

        this.internMerch = this.listInternMerchandise(10, null, null, null);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.internMerchandiseSource.filter = filterValue.trim().toLowerCase();

        if (this.internMerchandiseSource.paginator) {
            this.internMerchandiseSource.paginator.firstPage();
        }
    }

    listInternMerchandise(first: number, last?: number, before?: string, after?: string): Observable<InternMerchandiseEdge[]> {
        this.isLoadingResults = true;

        return this.tableDataGQL.watch({
            first: first,
            last: last,
            before: before,
            after: after
        }).valueChanges.pipe(
            map(result => {
                this.isLoadingResults = false;
                return result.data.listInternMerchandise.edges;
            })
        );
    }

    submitNewInternOrder(newOder: NewInternOrder) {
        this.newInternOrderGQL
            .mutate({
                newInternOrder: newOder,
            })
            .subscribe();
        this.loadTableData();
    }

    openIncomingGoods(): void {
        console.log("TODO: Implement incoming goods");
    }

    openNewInternOrder(): void {
        const newOrder = undefined;
        const dialogRef = this.dialog.open(NewInternOrderDialog, {
            width: '40vw',
            hasBackdrop: true,
            disableClose: true,
            data: { newInternOrder: newOrder }
        });
        var user;
        this.userService.getUser().subscribe((user) => {
            user = user;
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined)
                return;
            result.ordererId = user.id;
            result.purchasedOn = Date.now().toString();
            this.submitNewInternOrder(result);
        });
    }

}

@Component({
    selector: 'new-intern-order-dialog',
    templateUrl: 'new-intern-order-dialog.html',
    styleUrls: ['./new-intern-order-dialog.scss'],
})
export class NewInternOrderDialog {
    constructor(
        public dialogRef: MatDialogRef<NewInternOrderDialog>,
        @Inject(MAT_DIALOG_DATA) public data: NewInternOrder) { }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
