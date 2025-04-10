// src/app/service/product-manager.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductManagerService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  // Hàm tạo header với token từ sessionStorage
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Thêm nếu API yêu cầu
    });
  }

  getAll(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(products: ProductDTO[]): Observable<ProductDTO[]> {
    return this.http.post<ProductDTO[]>(`${this.apiUrl}`, products, { headers: this.getHeaders() });
  }

  update(id: number, product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateStock(id: number, quantity: number): Observable<ProductDTO> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.patch<ProductDTO>(`${this.apiUrl}/${id}/stock`, null, {
      headers: this.getHeaders(),
      params: params
    });
  }
}


export interface ProductDTO {
  id?: number | null;
  name?: string | null;
  categoryId?: number | null;
  price?: number | null;
  stockQuantity?: number | null;
  rating?: number | null;
  imageUrl?: string | null;
}