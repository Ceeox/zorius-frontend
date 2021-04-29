import { Component, OnInit, Inject, ViewChild, Injectable, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InternMerchandise, InternMerchandiseEdge, InternOrderTableDataGQL, NewInternOrderGQL } from './graphql.module';
import { merge, Observable } from 'rxjs';
import { catchError, first, last, map, startWith, switchMap } from 'rxjs/operators';
import { UserService } from 'src/services/user.service';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import ObjectID from 'bson-objectid';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class InternOrdersComponent implements OnInit, AfterViewInit {

    internMerchandiseSource = new MatTableDataSource<InternMerchandiseEdge>();
    internMerch: Observable<InternMerchandiseEdge[]>
    displayedColumns = ['no.', 'id', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'actions'];

    pageSizeOptions = [10, 25, 50, 100];
    pageSize: number = 10;
    pageLength: number;
    pageEvent: PageEvent = new PageEvent();

    data;

    isLoadingResults = true;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public dialog: MatDialog,
        private tableDataGQL: InternOrderTableDataGQL,
        private newInternOrderGQL: NewInternOrderGQL,
        private userService: UserService,
        private snackBar: MatSnackBar) {
    }

    ngAfterViewInit(): void {
        this.internMerchandiseSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.loadTableData();
    }

    handlePageEvent(event: PageEvent) {
        this.pageEvent = event;
        this.loadTableData();
    }

    resetPaging(): void {
        this.paginator.pageIndex = 0;
    }

    loadTableData(): void {
        let first = this.pageSize;
        if (this.pageEvent.pageSize) {
            first = this.pageEvent.pageSize;
        }
        let after = null;
        if (this.pageEvent.pageIndex) {
            after = (this.pageEvent.pageSize * this.pageEvent.pageIndex).toString();
        }

        console.log("previousPageIndex: " + this.pageEvent.previousPageIndex +
            "\npageIndex: " + this.pageEvent.pageIndex);

        console.log("first: " + first + " after: " + after);

        this.internMerch = this.listInternMerchandise(first, null, null, after);
    }

    private listInternMerchandise(first?: number, last?: number, before?: string, after?: string): Observable<InternMerchandiseEdge[]> {
        this.isLoadingResults = true;
        return this.tableDataGQL.watch({
            first: first,
            last: last,
            before: before,
            after: after
        }).valueChanges.pipe(
            map(result => {
                this.pageLength = 100;
                this.isLoadingResults = false;
                return result.data.listInternMerchandise.edges;
            }),
            catchError(({ err }) => {
                this.isLoadingResults = false;
                this.snackBar.open("Error: " + err)._dismissAfter(5000);
                return [];
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
