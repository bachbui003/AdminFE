import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      return true; // Có token → cho vào
    } else {
      this.router.navigate(['/login']); // Không có token → chuyển về login
      return false;
    }
  }
}
