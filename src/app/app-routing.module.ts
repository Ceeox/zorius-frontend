import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './main/pagenotfound/pagenotfound.component';
import { InternOrdersComponent } from './main/merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './main/merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './main/merchandise/stock/stock.component';
import { LoginComponent } from './main/login/login.component';
import { AuthGuardService } from 'src/services/auth/auth-guard.service';
import { RegisterComponent } from './main/register/register.component';
import { NewInternMerchComponent } from './main/merchandise/new-intern-merch/new-intern-merch.component';
import { UpdateInternMerchComponent } from './main/merchandise/update-intern-merch/update-intern-merch.component';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { WorkReportsComponent } from './work-reports/work-reports.component';
import { AdminComponent } from './admin/admin.component';
import { WorkReportsComponent as AdminWorkReportsComponent } from './admin/work-reports/work-reports.component';

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
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'work-reports',
        component: AdminWorkReportsComponent,
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
