import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interface cho User
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

// Interface cho UpdateProfileRequest
export interface UpdateProfileRequest {
  email: string;
  fullName: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  private apiUrl = 'http://localhost:8080/api/users'; // Đảm bảo khớp với backend

  constructor(private http: HttpClient) {}

  // Lấy token từ sessionStorage và tạo headers
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Lấy tất cả người dùng
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Cập nhật người dùng
  updateUser(id: number, updateRequest: UpdateProfileRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, updateRequest, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Xóa người dùng
  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Xử lý lỗi
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Đã xảy ra lỗi';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error || `Mã lỗi: ${error.status}\nThông báo: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}