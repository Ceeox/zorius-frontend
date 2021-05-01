import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CountInternMerchandiseGQL, InternMerchandise, InternMerchandiseEdge, InternOrderTableDataGQL, NewInternMerchandise, NewInternOrderGQL, Orderer, UpdateInternMerchandise, UpdateInternMerchGQL } from './graphql.module';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewDialog } from './new-dialog/new-dialog';
import ObjectID from 'bson-objectid';
import { UpdateDialog } from './update-dialog/update-dialog';


export interface UpdateDialogData {
    merch: InternMerchandise,
    update: UpdateInternMerchandise
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
    internMerch: Observable<InternMerchandiseEdge[]>;
    displayedColumns = ['no.', 'id', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'edit', 'download'];

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
        private countInternMerchGQL: CountInternMerchandiseGQL,
        private updateInternMerchGQL: UpdateInternMerchGQL,
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

    loadTableData(): void {
        this.countMerch();

        let first = this.pageSize;
        if (this.pageEvent.pageSize) {
            first = this.pageEvent.pageSize;
        }
        let after = null;
        if (this.pageEvent.pageIndex) {
            after = (this.pageEvent.pageSize * this.pageEvent.pageIndex).toString();
        }

        this.internMerch = this.listInternMerch(first, null, null, after);
    }

    ordererName(orderer: Orderer): string {
        var name = "";
        if (orderer.firstname && orderer.lastname) {
            name = orderer.firstname + " " + orderer.lastname;
        } else {
            name = orderer.username.toString()
        }
        return name;
    }

    private countMerch() {
        this.isLoadingResults = true;
        this.countInternMerchGQL.watch().valueChanges.subscribe(({ data, loading }) => {
            this.isLoadingResults = loading;
            this.pageLength = data.countInternMerch;
        });
    }

    private listInternMerch(first?: number, last?: number, before?: string, after?: string): Observable<InternMerchandiseEdge[]> {
        this.isLoadingResults = true;
        return this.tableDataGQL.watch({
            first: first,
            last: last,
            before: before,
            after: after
        }).valueChanges.pipe(
            map(result => {
                this.isLoadingResults = false;
                return result.data.listInternMerch.edges;
            }),
            catchError(err => {
                this.isLoadingResults = false;
                this.snackBar.open("Error: " + err)._dismissAfter(5000);
                return [];
            })
        );
    }

    submitNewInternOrder(newOder: NewInternMerchandise) {
        this.newInternOrderGQL
            .mutate({
                newInternOrder: newOder,
            })
            .subscribe();
        this.loadTableData();
    }

    openNewInternOrder(): void {
        const newOrder = undefined;
        const dialogRef = this.dialog.open(NewDialog, {
            width: '50vw',
            hasBackdrop: true,
            disableClose: true,
            data: { newInternOrder: newOrder }
        });
        var user;
        this.userService.getSelf().subscribe((user) => {
            user = user;
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result)
                return;
            result.ordererId = user.id;
            result.purchasedOn = Date.now().toString();
            this.submitNewInternOrder(result);
        });
    }

    submitUpdateInternMerch(id: ObjectID, update: UpdateInternMerchandise) {
        this.updateInternMerchGQL
            .mutate({
                id: id,
                update: update
            })
            .subscribe();
        this.loadTableData();
    }

    openUpdateDialog(merch: InternMerchandise): void {
        const updatedOrder: UpdateInternMerchandise = undefined;
        const dialogRef = this.dialog.open(UpdateDialog, {
            width: '50vw',
            hasBackdrop: true,
            disableClose: true,
            data: { merch: merch, update: updatedOrder }
        });

        dialogRef.afterClosed().subscribe((update) => {
            if (!update)
                return;
            this.submitUpdateInternMerch(merch.id, update);
        });
    }
}

