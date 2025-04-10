// src/app/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  // Sự kiện đăng xuất
  logout(): void {
    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        // Xóa token và thông tin người dùng khỏi sessionStorage
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userId');

        // Hiển thị thông báo đăng xuất thành công
        Swal.fire({
          title: 'Đăng xuất thành công',
          icon: 'success',
          timer: 1500, // Tự đóng sau 1.5 giây
          showConfirmButton: false
        }).then(() => {
          // Chuyển hướng về trang đăng nhập
          this.router.navigate(['/login']);
        });
      }
    });
  }
}