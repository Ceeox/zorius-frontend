import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
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
        status: ['']
    });
    ordererOptions: Observable<UserEdge[]>;
    statusOptions: string[] = ['ORDERED', 'USED', 'DELIVERED', 'STORED'];

    constructor(
        public dialogRef: MatDialogRef<UpdateInternMerchDialog>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: {
            internMerch: InternMerchandise,
            update: UpdateInternMerchandise,
        },
        private userService: UserService,
        private internMerchService: InternMerchService,
    ) { }

    ngOnInit(): void {
        this.ordererOptions = this.userService.listUsers().pipe(
            map(res => {
                console.log(res.listUsers.edges);
                return res.listUsers.edges;
            })
        );
        console.log(this.data.internMerch.cost);
        this.newInternMerchForm.patchValue({
            articleNumber: this.data.internMerch.articleNumber,
            cost: this.data.internMerch.cost,
            count: this.data.internMerch.count,
            invoiceNumber: this.data.internMerch.invoiceNumber,
            merchandiseId: this.data.internMerch.merchandiseId,
            merchandiseName: this.data.internMerch.merchandiseName,
            orderer: this.data.internMerch.orderer,
            postage: this.data.internMerch.postage,
            projectLeader: this.data.internMerch.projectLeader,
            purchasedOn: this.data.internMerch.purchasedOn,
            shop: this.data.internMerch.shop,
            url: this.data.internMerch.url,
            useCase: this.data.internMerch.useCase,
        });
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
