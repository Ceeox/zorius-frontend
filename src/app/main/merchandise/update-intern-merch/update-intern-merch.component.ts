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

  newInternMerchForm = this.fb.group({
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
            this.newInternMerchForm.patchValue({
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

  goBack() {
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
    console.log(this.newInternMerchForm.get('orderer').value);
    let update: UpdateInternMerchandise = {
      articleNumber: this.newInternMerchForm.get('articleNumber').value,
      cost: this.newInternMerchForm.get('cost').value,
      count: this.newInternMerchForm.get('count').value,
      invoiceNumber: this.newInternMerchForm.get('invoiceNumber').value,
      merchandiseId: this.newInternMerchForm.get('merchandiseId').value,
      merchandiseName: this.newInternMerchForm.get('merchandiseName').value,
      orderer: this.newInternMerchForm.get('orderer').value.id,
      postage: this.newInternMerchForm.get('postage').value,
      projectLeader: this.newInternMerchForm.get('projectLeader').value.id,
      shop: this.newInternMerchForm.get('shop').value,
      url: this.newInternMerchForm.get('url').value,
      useCase: this.newInternMerchForm.get('useCase').value,
    };

    this.internMerch.subscribe(merch => {
      this.internMerchService.updateInternMerch(merch.id, update)
        .subscribe();
    });

    this.goBack();
  }
}