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
import { InternMerchandise, InternMerchandiseEdge, NewInternMerchandise, Orderer, UpdateInternMerchandise } from 'src/models/intern-merch';
import { InternMerchService } from 'src/services/intern-merch.service';
import { NewInternMerchDialog } from 'src/app/dialogs/new-intern-merch/new-intern-merch.dialog';
import { UpdateInternMerchDialog } from 'src/app/dialogs/update-intern-merch/update-intern-merch.dialog';
import ObjectID from 'bson-objectid';
import { Router } from '@angular/router';


const LS_PAGE_SIZE: string = "intern_merch_page_size";

@Component({
    selector: 'app-intern-orders',
    templateUrl: './intern-orders.component.html',
    styleUrls: ['./intern-orders.component.scss'],
})
export class InternOrdersComponent implements OnInit, AfterViewInit {

    internMerchandiseSource = new MatTableDataSource<InternMerchandiseEdge>();
    internMerchs: Observable<InternMerchandiseEdge[]>;
    displayedColumns = ['no.', 'merchandiseId', 'merchandiseName', 'count', 'cost', 'orderer', 'status', 'menu'];

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

        private snackBar: MatSnackBar,
        private router: Router,
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

    deleteInternMerch(internMerch: InternMerchandise): void {
        this.internMerchService.deleteInternMerch(internMerch.id).subscribe(res => {
            if (res) {
                this.snackBar
                    .open(internMerch.merchandiseName + " successfull deleted.")
                    ._dismissAfter(SNACKBAR_TIMEOUT);
            }
        });
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

    openNewInternMerch(): void {
        this.router.navigate(['merch/intern/new']);
    }

    downloadInternMerch() {
        this.snackBar.open("Not yet implemented!")._dismissAfter(SNACKBAR_TIMEOUT);
    }

    goUpdateInternMerch(id: ObjectID): void {
        this.router.navigate(['merch/intern/update', id]);
    }
}

