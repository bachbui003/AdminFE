import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLayoutComponent,
    UserManagementComponent,
    CategoryManagementComponent,
    PaymentManagementComponent,
    StatisticsComponent,
    ProductManagementComponent,
    OrderManagerComponent,
  


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
