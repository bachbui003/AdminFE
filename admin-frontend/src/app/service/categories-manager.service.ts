import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
  id?: number;
  name: string;
  icon?: string;
  description?: string; // Thêm trường mô tả
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesManagerService {
  private baseUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http
      .get<Category>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.baseUrl, category, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http
      .put<Category>(`${this.baseUrl}/${id}`, category, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getProductsByCategory(id: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${id}/products`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage =
      error.error?.message || error.statusText || 'Something went wrong';
    return throwError(() => new Error(errorMessage));
  }
}