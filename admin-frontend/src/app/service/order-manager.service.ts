import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderManagerService {
  private apiUrl = 'http://localhost:8080/api/orders'; // Đảm bảo khớp với backend

  constructor(private http: HttpClient) {}

  // Hàm tạo header với token từ sessionStorage
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Thêm nếu API yêu cầu
    });
  }

  // Lấy tất cả đơn hàng
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  // Cập nhật đơn hàng
  updateOrder(id: number, updatedOrder: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedOrder, { headers: this.getHeaders() });
  }

  // Xóa đơn hàng
  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }


}
