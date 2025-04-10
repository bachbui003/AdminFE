import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { PaymentManagementComponent } from './payment-management/payment-management.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // ✅ Chặn cả layout nếu chưa login
    children: [
      { path: 'products', component: ProductManagementComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'categories', component: CategoryManagementComponent },
      { path: 'payments', component: PaymentManagementComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'orders', component: OrderManagerComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
