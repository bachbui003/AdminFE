// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res) => {
          const token = res.token;
          const decoded: any = jwtDecode(token);
          
          const userId = decoded.id || decoded.sub;
          const role = decoded.role;
  
          if (role !== 'ADMIN') {
            this.errorMsg = 'Bạn không có quyền truy cập';
            return;
          }
  
          // ✅ Lưu token và userId nếu là admin
          sessionStorage.setItem('accessToken', token);
          sessionStorage.setItem('userId', userId);
  
          alert('Đăng nhập thành công');
          this.router.navigate(['/products']); // chuyển hướng sau khi đăng nhập thành công
        },
        error: (err) => {
          this.errorMsg = err.error.message || 'Đăng nhập thất bại';
        }
      });
    }
  }
  
}
