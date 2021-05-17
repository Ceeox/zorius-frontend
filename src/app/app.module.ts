import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

// imports extern
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './main/home/home.component';
import { PageNotFoundComponent } from './main/pagenotfound/pagenotfound.component';
import { WarenComponent } from './main/merchandise/waren.component';
import { InternOrdersComponent } from './main/merchandise/intern-orders/intern-orders.component';
import { ExternOrdersComponent } from './main/merchandise/extern-orders/extern-orders.component';
import { StockComponent } from './main/merchandise/stock/stock.component';
import { LoginComponent } from './main/login/login.component';
import { WorkdayComponent } from './main/home/workday/workday.component';
import { NewDialog } from './main/merchandise/intern-orders/new-dialog/new-dialog';

//services
import { AuthGuardService } from 'src/services/auth-guard.service';
import { UpdateDialog } from './main/merchandise/intern-orders/update-dialog/update-dialog';
import { RegisterComponent } from './main/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    WarenComponent,
    InternOrdersComponent,
    ExternOrdersComponent,
    StockComponent,
    LoginComponent,
    WorkdayComponent,
    RegisterComponent,

    NewDialog,
    UpdateDialog
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

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule
  ],
  entryComponents: [
    NewDialog,
    UpdateDialog
  ],
  providers: [CookieService, AuthGuardService, { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
