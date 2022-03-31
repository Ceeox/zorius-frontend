// material imports
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';

// imports extern
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { InternOrdersComponent } from './merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './merchandise/stock/stock.component';
import { LoginComponent } from './login/login.component';
import { WorkdayComponent } from './home/workday/workday.component';
import { RegisterComponent } from './register/register.component';
import { WorkReportsComponent } from './work-reports/work-reports.component';
import { NewInternMerchComponent } from './merchandise/new-intern-merch/new-intern-merch.component';
import { UpdateInternMerchComponent } from './merchandise/update-intern-merch/update-intern-merch.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

// dialogs
import { NewProjectDialog } from './dialogs/new-project/new-project.dialog';
import { NewInternMerchDialog } from './dialogs/new-intern-merch/new-intern-merch.dialog';
import { UpdateInternMerchDialog } from './dialogs/update-intern-merch/update-intern-merch.dialog';

// services
import { AuthGuardService } from 'src/services/auth/auth-guard.service';
import { getToken } from 'src/services/auth/auth.service';
import { Apollo } from 'apollo-angular';
import { DurationPipe } from '../pipes/duration.pipe';
import { NewWorkReportComponent } from './dialogs/new-work-report/new-work-report.component';
import { AdminComponent } from './admin/admin.component';
import { UpdateWorkReportComponent } from './dialogs/update-work-report/update-work-report.component';
import { UsersComponent } from './admin/users/users.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { NewCustomerComponent } from './dialogs/new-customer/new-customer.component';
import { EditComponent } from './admin/customers/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    InternOrdersComponent,
    ExternOrdersComponent,
    StockComponent,
    LoginComponent,
    WorkdayComponent,
    RegisterComponent,
    WorkReportsComponent,
    NewInternMerchComponent,
    UpdateInternMerchComponent,
    UserProfileComponent,

    NewProjectDialog,
    NewInternMerchDialog,
    UpdateInternMerchDialog,

    DurationPipe,
    NewWorkReportComponent,
    AdminComponent,
    UpdateWorkReportComponent,
    UsersComponent,
    CustomersComponent,
    NewCustomerComponent,
    EditComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSidenavModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
      },
    }),
  ],
  providers: [
    Apollo,
    JwtHelperService,
    AuthGuardService,
    {
      provide: [MAT_DIALOG_DEFAULT_OPTIONS, JWT_OPTIONS],
      useValue: [{ hasBackdrop: false }, JWT_OPTIONS],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
