import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { InternOrdersComponent } from './merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './merchandise/stock/stock.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from 'src/services/auth/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { NewInternMerchComponent } from './merchandise/new-intern-merch/new-intern-merch.component';
import { UpdateInternMerchComponent } from './merchandise/update-intern-merch/update-intern-merch.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WorkReportsComponent } from './work-reports/work-reports.component';
import { AdminComponent } from './admin/admin.component';
import { WorkReportsComponent as AdminWorkReportsComponent } from './admin/work-reports/work-reports.component';
import { UsersComponent } from './admin/users/users.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { EditComponent as CustomerEditComponent } from './admin/customers/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'work-reports',
    component: WorkReportsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'merch',
    children: [
      {
        path: 'intern',
        children: [
          {
            path: 'new',
            component: NewInternMerchComponent,
            canActivate: [AuthGuardService],
          },
          {
            path: 'update/:id',
            component: UpdateInternMerchComponent,
            canActivate: [AuthGuardService],
          },
          {
            path: 'list',
            component: InternOrdersComponent,
            canActivate: [AuthGuardService],
          },
        ],
      },
      {
        path: 'extern',
        component: ExternOrdersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'stock',
        component: StockComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'work-reports',
        component: AdminWorkReportsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'customers',
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            component: CustomersComponent,
            canActivate: [AuthGuardService],
          },
          {
            path: 'edit/:id',
            component: CustomerEditComponent,
            canActivate: [AuthGuardService],
          },
        ],
      },
    ],
  },

  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
