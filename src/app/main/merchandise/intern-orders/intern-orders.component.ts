import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import { InternMerchandise, InternMerchandiseEdge, Orderer, UpdateInternMerchandise } from 'src/models/intern-merch';
import { InternMerchService } from 'src/services/intern-merch.service';
import { NewInternMerchDialog } from 'src/app/dialogs/new-intern-merch/new-intern-merch.dialog';
import { UpdateInternMerchDialog } from 'src/app/dialogs/update-intern-merch/update-intern-merch.dialog';
import { ObjectID } from 'mongodb';

const LS_PAGE_SIZE: string = "intern_merch_page_size";

@Component({
    selector: 'app-intern-orders',
    templateUrl: './intern-orders.component.html',
    styleUrls: ['./intern-orders.component.scss'],
})
export class InternOrdersComponent implements OnInit, AfterViewInit {

    internMerchandiseSource = new MatTableDataSource<InternMerchandiseEdge>();
    internMerchs: Observable<InternMerchandiseEdge[]>;
    displayedColumns = ['no.', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'edit', 'download', 'delete'];

    pageSizeOptions = [10, 25, 50, 100];
    pageSize: number = 10;
    pageIndex: number = 0;
    pageLength: number;

    updateMerch?: UpdateInternMerchandise;
    internMerch: InternMerchandise;

    data;

    isLoadingResults = true;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public newMerchDialog: MatDialog,
        public updateMerchDialog: MatDialog,
        private userService: UserService,
        private internMerchService: InternMerchService,
        private snackBar: MatSnackBar
    ) { }

    ngAfterViewInit(): void {
        this.internMerchandiseSource.paginator = this.paginator;
    }

    ngOnInit() {
        if (localStorage.getItem(LS_PAGE_SIZE)) {
            this.pageSize = Number.parseInt(localStorage.getItem(LS_PAGE_SIZE));
        }
        this.countMerch();
        this.loadTableData();
    }

    handlePageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        localStorage.setItem(LS_PAGE_SIZE, this.pageSize.toString());
        this.pageIndex = event.pageIndex;
        this.countMerch();
        this.loadTableData();
    }

    countMerch() {
        this.isLoadingResults = true;
        this.internMerchService.countMerch().subscribe(result => {
            this.isLoadingResults = false;
            this.paginator.length = result;
        });
    }

    loadTableData() {
        let first = this.pageSize;
        let after = (this.pageSize * this.pageIndex).toString();
        this.internMerchs = this.internMerchService.listInternMerch(first, null, null, after)
            .pipe(
                map(result => {
                    this.isLoadingResults = false;
                    return result.listInternMerch.edges;
                })
            );
    }

    download() {
        this.snackBar.open("Not yet implemented!")._dismissAfter(SNACKBAR_TIMEOUT);
    }

    delete() {
        this.snackBar.open("Not yet implemented!")._dismissAfter(SNACKBAR_TIMEOUT);
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

    openNewInternOrder(): void {
        const newOrder = undefined;
        const dialogRef = this.newMerchDialog.open(NewInternMerchDialog, {
            minWidth: '30rem',
            maxWidth: '150rem',
            hasBackdrop: true,
            disableClose: true,
            data: { newInternOrder: newOrder }
        });
        let user;
        this.userService.getSelf().subscribe((user) => {
            user = user;
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result)
                return;
            result.ordererId = user.id;
            result.purchasedOn = Date.now().toString();
            //this.internMerchService.newInternMerch(result);
        });
    }

    openUpdateDialog(id: ObjectID): void {
        const dialogRef = this.updateMerchDialog.open(UpdateInternMerchDialog, {
            minWidth: '40rem',
            maxWidth: '150rem',
            hasBackdrop: true,
            data: { internMerchId: id, update: undefined }
        });

        dialogRef.afterClosed().subscribe((update) => {
            if (!update)
                return;
            //this.internMerchService.updateInternMerch(id, update);
        });
    }
}

