import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './main/pagenotfound/pagenotfound.component';
import { WarenComponent } from './main/merchandise/waren.component';
import { InternOrdersComponent } from './main/merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './main/merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './main/merchandise/stock/stock.component';
import { LoginComponent } from './main/login/login.component';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
//import { RegisterComponent } from './main/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent }

  { path: 'user', component: WarenComponent, canActivate: [AuthGuardService] },
  { path: 'merchandise', component: WarenComponent, canActivate: [AuthGuardService] },
  { path: 'merchandise/intern_orders', component: InternOrdersComponent, canActivate: [AuthGuardService] },
  { path: 'merchandise/extern_orders', component: ExternOrdersComponent, canActivate: [AuthGuardService] },
  { path: 'merchandise/stock', component: StockComponent, canActivate: [AuthGuardService] },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
