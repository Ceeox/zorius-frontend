import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ObjectID } from "mongodb";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InternMerchandise, UpdateInternMerchandise } from "src/models/intern-merch";
import { User, UserEdge } from "src/models/user";
import { InternMerchService } from "src/services/intern-merch.service";
import { UserService } from "src/services/user.service";


@Component({
    selector: 'update-intern-merch.dialog',
    templateUrl: 'update-intern-merch.dialog.html',
    styleUrls: ['./update-intern-merch.dialog.scss'],
})
export class UpdateInternMerchDialog implements OnInit {

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
    });
    ordererOptions: Observable<UserEdge[]>;
    internMerch: InternMerchandise;

    constructor(
        public dialogRef: MatDialogRef<UpdateInternMerchDialog>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            internMerchId: ObjectID,
            update: UpdateInternMerchandise,
        },
        private userService: UserService,
        private internMerchService: InternMerchService,
    ) {
        this.ordererOptions = this.userService.listUsers().pipe(
            map(res => {
                return res.listUsers.edges;
            })
        );
        // this.internMerchService.getInternMerchById(this.data.internMerchId)
        //     .subscribe(res => {
        //         console.log("res: " + res);
        //         this.internMerch = res;
        //     });
    }

    ngOnInit(): void {


        // console.log("arivedOn " + res.arivedOn)
        // this.newInternMerchForm.patchValue({
        //     arivedOn: res.arivedOn,
        //     articleNumber: res.articleNumber,
        //     cost: res.cost,
        //     count: res.count,
        //     invoiceNumber: res.invoiceNumber,
        //     merchandiseId: res.merchandiseId,
        //     merchandiseName: res.merchandiseName,
        //     orderer: res.orderer,
        //     postage: res.postage,
        //     projectLeader: res.projectLeader,
        //     purchasedOn: res.purchasedOn,
        //     shop: res.shop,
        //     url: res.url,
        //     useCase: res.useCase,
        // });
        // console.log(this.newInternMerchForm.value);
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
        this.data.update = {
            articleNumber: this.newInternMerchForm.get('articleNumber').value,
            cost: this.newInternMerchForm.get('cost').value,
            count: this.newInternMerchForm.get('count').value,
            invoiceNumber: this.newInternMerchForm.get('invoiceNumber').value,
            merchandiseId: this.newInternMerchForm.get('merchandiseId').value,
            merchandiseName: this.newInternMerchForm.get('merchandiseName').value,
            orderer: this.newInternMerchForm.get('orderer').value.id,
            postage: this.newInternMerchForm.get('postage').value,
            projectLeader: this.newInternMerchForm.get('projectLeader').value.id,
            purchasedOn: this.newInternMerchForm.get('purchasedOn').value,
            shop: this.newInternMerchForm.get('shop').value,
            url: this.newInternMerchForm.get('url').value,
            useCase: this.newInternMerchForm.get('useCase').value,
        };
        console.log("update: " + this.data.update);
        this.dialogRef.close(this.data);
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
