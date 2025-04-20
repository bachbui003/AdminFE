import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Định nghĩa interface cho sản phẩm bán chạy
interface TopSellingProduct {
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  price: number;
  revenue: number; // 👈 đúng theo tên biến trong JSON

}

// Định nghĩa interface cho response của top-selling-products
interface TopSellingProductsResponse {
  topSellingProducts: TopSellingProduct[]; // Sửa từ topProducts
  totalRevenue: number; // Tổng doanh thu từ các sản phẩm bán chạy
}

// Định nghĩa interface cho response của order-status-stats
interface OrderStatusStatsResponse {
  completedOrders: number;
  pendingOrders: number;
  CODOrders: number;
  canceledOrders: number;
  deliveredOrders?: number;
  shippedOrders?: number;
  failedOrders?: number;
}

// Định nghĩa interface cho đơn hàng trong revenue
interface Order {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  orderDate: string;
  totalPrice: number;
  status: string;
}

// Định nghĩa interface cho response của revenue
interface MonthlyRevenueDTO {
  month: number;
  totalRevenue: number;
  orders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  // Hàm tạo header với token từ sessionStorage
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Thêm nếu API yêu cầu
    });
  }

  getTopSellingProducts(): Observable<TopSellingProductsResponse> {
    return this.http.get<TopSellingProductsResponse>(`${this.apiUrl}/top-selling-products`, {
      headers: this.getHeaders()
    });
  }

  getOrderStatusStats(): Observable<OrderStatusStatsResponse> {
    return this.http.get<OrderStatusStatsResponse>(`${this.apiUrl}/order-status-stats`, {
      headers: this.getHeaders()
    });
  }

  getRevenueBetweenDates(startDate: Date, endDate: Date): Observable<MonthlyRevenueDTO> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<MonthlyRevenueDTO>(`${this.apiUrl}/revenue`, {
      headers: this.getHeaders(),
      params: params
    });
  }
}