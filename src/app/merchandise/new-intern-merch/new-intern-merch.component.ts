import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NewInternMerchandise } from 'src/models/intern-merch';
import { Location } from '@angular/common';
import { InternMerchService } from 'src/services/intern-merch.service';
import { UserService } from 'src/services/user/user.service';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { Edge } from 'src/models/page-info';

@Component({
  selector: 'app-new-intern-merch',
  templateUrl: './new-intern-merch.component.html',
  styleUrls: ['./new-intern-merch.component.scss'],
})
export class NewInternMerchComponent implements OnInit {
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
    status: [''],
  });
  selfId: string;
  ordererOptions: Observable<Edge<User>[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private interMerch: InternMerchService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.ordererOptions = this.userService.users().pipe(
      map((res) => {
        return res.users.edges;
      })
    );
  }

  onBack() {
    this.location.back();
  }

  onSubmit(): void {
    console.log(this.newInternMerchForm.get('orderer').value);
    let newInternMerch: NewInternMerchandise = {
      articleNumber: this.newInternMerchForm.get('articleNumber').value,
      cost: this.newInternMerchForm.get('cost').value,
      count: this.newInternMerchForm.get('count').value,
      merchandiseName: this.newInternMerchForm.get('merchandiseName').value,
      postage: this.newInternMerchForm.get('postage').value,
      shop: this.newInternMerchForm.get('shop').value,
      url: this.newInternMerchForm.get('url').value,
      useCase: this.newInternMerchForm.get('useCase').value,
      projectLeaderId: this.newInternMerchForm.get('projectLeader').value.id,
      ordererId: this.selfId,
    };

    this.interMerch.newInternMerch(newInternMerch).subscribe();

    this.onBack();
  }
}
