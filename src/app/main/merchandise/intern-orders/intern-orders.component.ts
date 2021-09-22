import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, take } from 'rxjs/operators';
import { SNACKBAR_TIMEOUT } from 'src/app/app.component';
import {
  InternMerchandise,
  InternMerchandiseEdge,
  ListInternMerch,
  UpdateInternMerchandise,
} from 'src/models/intern-merch';
import { InternMerchService } from 'src/services/intern-merch.service';

import { Router } from '@angular/router';

const LS_PAGE_SIZE: string = 'intern_merch_page_size';

@Component({
  selector: 'app-intern-orders',
  templateUrl: './intern-orders.component.html',
  styleUrls: ['./intern-orders.component.scss'],
})
export class InternOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  internMerchandiseSource = new MatTableDataSource<InternMerchandiseEdge>();
  internMerchs: InternMerchandiseEdge[];

  countInternMerch$: Subscription;
  listInternMerch$: Subscription;
  deleteInternMerch$: Subscription;

  displayedColumns = [
    'no.',
    'merchandiseId',
    'merchandiseName',
    'count',
    'cost',
    'orderer',
    'status',
    'menu',
  ];

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
    private userService: UserService,
    private internMerchService: InternMerchService,

    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem(LS_PAGE_SIZE)) {
      this.pageSize = Number.parseInt(localStorage.getItem(LS_PAGE_SIZE));
    }
    this.countMerch();
    this.listInternMerch();
  }

  ngAfterViewInit(): void {
    this.internMerchandiseSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.listInternMerch$.unsubscribe();
    this.countInternMerch$.unsubscribe();
    this.deleteInternMerch$.unsubscribe();
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    localStorage.setItem(LS_PAGE_SIZE, this.pageSize.toString());
    this.pageIndex = event.pageIndex;
    this.countMerch();
    this.listInternMerch();
  }

  countMerch() {
    this.isLoadingResults = true;
    this.countInternMerch$ = this.internMerchService
      .countMerch()
      .subscribe((result) => {
        this.isLoadingResults = false;
        this.paginator.length = result;
      });
  }

  listInternMerch() {
    let first = this.pageSize;
    let after = (this.pageSize * this.pageIndex).toString();
    this.listInternMerch$ = this.internMerchService
      .listInternMerch(first, null, null, after)
      .subscribe((result) => {
        this.isLoadingResults = false;
        this.internMerchs = result.listInternMerch.edges;
      });
  }

  deleteInternMerch(internMerch: InternMerchandise): void {
    this.deleteInternMerch$ = this.internMerchService
      .deleteInternMerch(internMerch.id)
      .subscribe((res) => {
        if (res) {
          this.snackBar
            .open(internMerch.merchandiseName + ' successfully deleted.')
            ._dismissAfter(SNACKBAR_TIMEOUT);
        }
      });
  }

  ordererName(ordererId: string) {
    return ordererId;
  }

  openNewInternMerch(): void {
    this.router.navigate(['merch/intern/new']);
  }

  downloadInternMerch() {
    this.snackBar.open('Not yet implemented!')._dismissAfter(SNACKBAR_TIMEOUT);
  }

  goUpdateInternMerch(id: string): void {
    this.router.navigate(['merch/intern/update', id]);
  }
}
