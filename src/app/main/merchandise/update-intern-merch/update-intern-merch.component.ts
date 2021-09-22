import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  InternMerchandise,
  UpdateInternMerchandise,
} from 'src/models/intern-merch';
import { User, UserEdge } from 'src/models/user';
import { InternMerchService } from 'src/services/intern-merch.service';
import { UserService } from 'src/services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { validate as uuidValidate } from 'uuid';

@Component({
  selector: 'app-update-intern-merch',
  templateUrl: './update-intern-merch.component.html',
  styleUrls: ['./update-intern-merch.component.scss'],
})
export class UpdateInternMerchComponent implements OnInit {
  updateInternMerchForm = this.fb.group({
    articleNumber: [''],
    cost: [''],
    count: [''],
    invoiceNumber: [''],
    merchandiseId: [''],
    merchandiseName: [''],
    ordererId: [''],
    postage: [''],
    projectLeaderId: [''],
    purchasedOn: [''],
    shop: [''],
    url: [''],
    useCase: [''],
    status: [''],
  });
  ordererOptions: Observable<UserEdge[]>;
  internMerch: Observable<InternMerchandise>;
  selectedOrderer: Observable<User>;
  selectedProjectLeader: Observable<User>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private internMerchService: InternMerchService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.internMerch = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');

        if (uuidValidate(id)) {
          this.router.navigate(['/404']);
        }
        return this.internMerchService.getInternMerchById(id).pipe(
          map((res) => {
            this.selectedOrderer = new Observable((subscriber) => {
              subscriber.next(res.orderer);
            });
            this.selectedProjectLeader = new Observable((subscriber) => {
              subscriber.next(res.projectLeader);
            });

            this.updateInternMerchForm.patchValue({
              articleNumber: res.articleNumber,
              cost: res.cost,
              count: res.count,
              invoiceNumber: res.invoiceNumber,
              merchandiseId: res.merchandiseId,
              merchandiseName: res.merchandiseName,
              ordererId: res.orderer.id,
              postage: res.postage,
              projectLeaderId: res.projectLeader.id,
              purchasedOn: res.purchasedOn,
              shop: res.shop,
              url: res.url,
              useCase: res.useCase,
            });
            return res;
          })
        );
      })
    );

    this.ordererOptions = this.userService.listUsers().pipe(
      map((res) => {
        return res.listUsers.edges;
      })
    );
  }

  onBack() {
    this.location.back();
  }

  onOrdererChange(change: MatSelectChange) {
    this.selectedOrderer = change.value;
    this.updateInternMerchForm.patchValue({
      orderer: change.value.id,
    });
  }

  onProjectLeaderChange(change: MatSelectChange) {
    this.selectedProjectLeader = change.value;
    this.updateInternMerchForm.patchValue({
      projectLeader: change.value.id,
    });
  }

  getUserName(user: User): string {
    var name = '';
    if (user.firstname && user.lastname) {
      name = user.firstname + ' ' + user.lastname;
    } else {
      name = user.username.toString();
    }
    return name;
  }

  onSubmit(): void {
    console.log(this.updateInternMerchForm.get('orderer').value);
    let update: UpdateInternMerchandise = {
      articleNumber: this.updateInternMerchForm.get('articleNumber').value,
      cost: this.updateInternMerchForm.get('cost').value,
      count: this.updateInternMerchForm.get('count').value,
      invoiceNumber: this.updateInternMerchForm.get('invoiceNumber').value,
      merchandiseId: this.updateInternMerchForm.get('merchandiseId').value,
      merchandiseName: this.updateInternMerchForm.get('merchandiseName').value,
      ordererId: this.updateInternMerchForm.get('ordererId').value.id,
      postage: this.updateInternMerchForm.get('postage').value,
      projectLeaderId:
        this.updateInternMerchForm.get('projectLeaderId').value.id,
      shop: this.updateInternMerchForm.get('shop').value,
      url: this.updateInternMerchForm.get('url').value,
      useCase: this.updateInternMerchForm.get('useCase').value,
    };

    this.internMerch.subscribe((merch) => {
      this.internMerchService.updateInternMerch(merch.id, update).subscribe();
    });

    this.onBack();
  }
}
