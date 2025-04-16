import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../service/statistics.service';

interface TopSellingProduct {
  productName: string;
  quantitySold: number;
  price: number;        // 👈 Thêm price
  revenue: number;      // 👈 Thêm revenue
}

interface TopSellingProductsResponse {
  topSellingProducts: TopSellingProduct[];
  totalRevenue: number;
}

interface OrderStatusStatsResponse {
  completedOrders: number;
  pendingOrders: number;
  CODOrders: number;
  canceledOrders: number;
}

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

interface MonthlyRevenueDTO {
  month: number;
  totalRevenue: number;
  orders: Order[];
  monthlyData?: { [key: string]: number };
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // Dữ liệu hiển thị
  topSellingProducts: TopSellingProduct[] = [];
  orderStatusStats: OrderStatusStatsResponse = {
    completedOrders: 0,
    pendingOrders: 0,
    CODOrders: 0,
    canceledOrders: 0
  };
  revenueData: MonthlyRevenueDTO | null = null;
  topTotalRevenue: number = 0;

  // UI điều khiển
  activeTab: 'topSelling' | 'revenue' | 'orderStatus' = 'topSelling';
  startDate: string = '';
  endDate: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);

    this.loadDataForActiveTab();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onTabChange(tab: 'topSelling' | 'revenue' | 'orderStatus'): void {
    this.activeTab = tab;
    this.loadDataForActiveTab();
  }

  loadDataForActiveTab(): void {
    this.errorMessage = null;

    switch (this.activeTab) {
      case 'topSelling':
        this.loadTopSellingProducts();
        break;
      case 'revenue':
        this.loadRevenue();
        break;
      case 'orderStatus':
        this.loadOrderStatusStats();
        break;
    }
  }

  loadTopSellingProducts(): void {
    this.isLoading = true;
    this.statisticsService.getTopSellingProducts().subscribe({
      next: (data: TopSellingProductsResponse) => {
        this.topSellingProducts = data.topSellingProducts || [];
        this.topTotalRevenue = data.totalRevenue || 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Không thể tải danh sách sản phẩm bán chạy.', err);
      }
    });
  }

  loadOrderStatusStats(): void {
    this.isLoading = true;
    this.statisticsService.getOrderStatusStats().subscribe({
      next: (data: OrderStatusStatsResponse) => {
        this.orderStatusStats = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Không thể tải thống kê trạng thái đơn hàng.', err);
      }
    });
  }

  loadRevenue(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Vui lòng chọn khoảng thời gian';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.errorMessage = 'Ngày không hợp lệ';
      return;
    }

    if (start > end) {
      this.errorMessage = 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
      return;
    }

    this.isLoading = true;
    this.statisticsService.getRevenueBetweenDates(start, end).subscribe({
      next: (data: MonthlyRevenueDTO) => {
        this.revenueData = data;

        if (data.orders.length === 0) {
          this.errorMessage = `Không có đơn hàng từ ${this.startDate} đến ${this.endDate}`;
        } else {
          this.errorMessage = null;
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.handleError('Không thể tải dữ liệu doanh thu', err);
      }
    });
  }

  onFilterClick(): void {
    if (this.activeTab === 'revenue') {
      this.errorMessage = null;
      this.loadRevenue();
    }
  }

  setDateRange(days: number): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);

    if (this.activeTab === 'revenue') {
      this.loadRevenue();
    }
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message, error);
  }
}
