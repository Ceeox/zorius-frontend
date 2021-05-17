import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewDialog } from './new-dialog/new-dialog';
import { UpdateDialog } from './update-dialog/update-dialog';
import { InternMerchandise, InternMerchandiseEdge, InternMerchService, Orderer, UpdateInternMerchandise } from 'src/services/intern-merch.service';
import { map } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import ObjectID from 'bson-objectid';


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
    internMerchs: Observable<InternMerchandiseEdge[]>;
    displayedColumns = ['no.', 'id', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'edit', 'download', 'delete'];

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
        private snackBar: MatSnackBar) {
    }

    ngAfterViewInit(): void {
        this.internMerchandiseSource.paginator = this.paginator;

    }

    ngOnInit() {
        this.countMerch();
        this.loadTableData();
    }

    handlePageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
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
                    return result;
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
        const dialogRef = this.newMerchDialog.open(NewDialog, {
            width: '40vw',
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
            this.internMerchService.submitNewInternOrder(result);
        });
    }

    openUpdateDialog(id: ObjectID): void {
        this.internMerchService.getInternMerchById(id).subscribe(result => {
            this.internMerch = result;
        });

        const dialogRef = this.updateMerchDialog.open(UpdateDialog, {
            width: '40vw',
            hasBackdrop: true,
            data: { update: this.internMerch }
        });

        dialogRef.afterClosed().subscribe((update) => {
            if (!update)
                return;
            this.internMerchService.submitUpdateInternMerch(id, update);
        });
    }

    toUpdate(merch: InternMerchandise): UpdateInternMerchandise {
        return {
            arivedOn: merch.arivedOn,
            articleNumber: merch.articleNumber,
            cost: merch.cost,
            count: merch.count,
            invoiceNumber: merch.invoiceNumber,
            merchandiseId: merch.merchandiseId,
            merchandiseName: merch.merchandiseName,
            orderer: merch.orderer,
            postage: merch.postage,
            projectLeader: merch.projectLeader,
            purchasedOn: merch.purchasedOn,
            serialNumber: merch.serialNumber,
            shop: merch.shop,
            url: merch.url,
            useCase: merch.useCase,
        };
    }
}

