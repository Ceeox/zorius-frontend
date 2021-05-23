// material imports
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
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

// imports extern
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './main/pagenotfound/pagenotfound.component';
import { InternOrdersComponent } from './main/merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './main/merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './main/merchandise/stock/stock.component';
import { LoginComponent } from './main/login/login.component';
import { WorkdayComponent } from './main/home/workday/workday.component';
import { RegisterComponent } from './main/register/register.component';
import { WorkReportsComponent } from './main/home/work-reports/work-reports.component';
import { NewWrComponent } from './main/home/work-reports/new-wr/new-wr.component';
import { ListWrTodayComponent } from './main/home/work-reports/list-wr-today/list-wr-today.component';
import { NewInternMerchComponent } from './main/merchandise/new-intern-merch/new-intern-merch.component';
import { UpdateInternMerchComponent } from './main/merchandise/update-intern-merch/update-intern-merch.component';
import { UserProfileComponent } from './main/user-profile/user-profile.component';

// dialogs
import { NewProjectDialog } from './dialogs/new-project/new-project.dialog';
import { NewInternMerchDialog } from './dialogs/new-intern-merch/new-intern-merch.dialog';
import { UpdateInternMerchDialog } from './dialogs/update-intern-merch/update-intern-merch.dialog';

// services
import { AuthGuardService } from 'src/services/auth-guard.service';
import { getToken } from 'src/services/auth.service';


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
        NewWrComponent,
        ListWrTodayComponent,
        NewInternMerchComponent,
        UpdateInternMerchComponent,
        UserProfileComponent,

        NewProjectDialog,
        NewInternMerchDialog,
        UpdateInternMerchDialog
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

        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        GraphQLModule,
        HttpClientModule,

        JwtModule.forRoot({
            config: {
                tokenGetter: getToken
            }
        })
    ],
    providers: [JwtHelperService, AuthGuardService, {
        provide: [MAT_DIALOG_DEFAULT_OPTIONS, JWT_OPTIONS],
        useValue: [{ hasBackdrop: false }, JWT_OPTIONS]
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
