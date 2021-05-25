import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import ObjectID from 'bson-objectid';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { InternMerchandise, UpdateInternMerchandise } from 'src/models/intern-merch';
import { User, UserEdge } from 'src/models/user';
import { InternMerchService } from 'src/services/intern-merch.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-intern-merch',
  templateUrl: './update-intern-merch.component.html',
  styleUrls: ['./update-intern-merch.component.scss']
})
export class UpdateInternMerchComponent implements OnInit {

  updateInternMerchForm = this.fb.group({
    articleNumber: [''],
    cost: [''],
    count: [''],
    invoiceNumber: [''],
    merchandiseId: [''],
    merchandiseName: [''],
    orderer: [''],
    postage: [''],
    projectLeader: [''],
    purchasedOn: [''],
    shop: [''],
    url: [''],
    useCase: [''],
    status: ['']
  });
  ordererOptions: Observable<UserEdge[]>;
  statusOptions: string[] = ['ORDERED', 'USED', 'DELIVERED', 'STORED'];
  internMerch: Observable<InternMerchandise>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private internMerchService: InternMerchService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.internMerch = this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const id = new ObjectID(params.get('id'));

        if (!ObjectID.isValid(id)) {
          this.router.navigate(['/404']);
        }
        return this.internMerchService.getInternMerchById(id).pipe(
          map(res => {
            this.updateInternMerchForm.patchValue({
              articleNumber: res.articleNumber,
              cost: res.cost,
              count: res.count,
              invoiceNumber: res.invoiceNumber,
              merchandiseId: res.merchandiseId,
              merchandiseName: res.merchandiseName,
              orderer: res.orderer,
              postage: res.postage,
              projectLeader: res.projectLeader,
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
      map(res => {
        return res.listUsers.edges;
      })
    );

  }

  onBack() {
    this.location.back();
  }

  getUserName(user: User): string {
    var name = "";
    if (user.firstname && user.lastname) {
      name = user.firstname + " " + user.lastname;
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
      orderer: this.updateInternMerchForm.get('orderer').value.id,
      postage: this.updateInternMerchForm.get('postage').value,
      projectLeader: this.updateInternMerchForm.get('projectLeader').value.id,
      shop: this.updateInternMerchForm.get('shop').value,
      url: this.updateInternMerchForm.get('url').value,
      useCase: this.updateInternMerchForm.get('useCase').value,
    };

    this.internMerch.subscribe(merch => {
      this.internMerchService.updateInternMerch(merch.id, update)
        .subscribe();
    });

    this.onBack();
  }
}