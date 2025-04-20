import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../service/statistics.service';

interface TopSellingProduct {
  productName: string;
  quantitySold: number;
  price: number;
  revenue: number;
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
  deliveredOrders?: number;
  shippedOrders?: number;
  failedOrders?: number;
  
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
    canceledOrders: 0,
    deliveredOrders: 0,
    shippedOrders: 0,
    failedOrders: 0 
  };
  revenueData: MonthlyRevenueDTO | null = null;
  topTotalRevenue: number = 0;

  // Phân trang cho doanh thu
  currentPage: number = 1;
  pageSize: number = 10; // Số đơn hàng mỗi trang
  totalPages: number = 0;
  paginatedOrders: Order[] = [];

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
    this.errorMessage = null; // Reset error message before making the request
  
    this.statisticsService.getRevenueBetweenDates(start, end).subscribe({
      next: (data: MonthlyRevenueDTO) => {
        this.revenueData = data;
  
        if (data.orders.length === 0) {
          const formattedStart = start.toLocaleDateString('vi-VN');
          const formattedEnd = end.toLocaleDateString('vi-VN');
          this.errorMessage = `Không có đơn hàng từ ${formattedStart} đến ${formattedEnd}`;
          this.paginatedOrders = [];
          this.totalPages = 0;
        } else {
          this.errorMessage = null;
          this.paginatedOrders = data.orders; // Initialize paginated orders
          this.updatePagination(); // Update pagination based on orders
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.handleError('Không thể tải dữ liệu doanh thu', err);
      }
    });
  }
  // Cập nhật dữ liệu phân trang
  updatePagination(): void {
    if (!this.revenueData) return;

    const orders = this.revenueData.orders || [];
    this.totalPages = Math.ceil(orders.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = orders.slice(startIndex, endIndex);
  }

  // Chuyển đến trang khác
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Chuyển đến trang trước
  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Chuyển đến trang sau
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  onFilterClick(): void {
    if (this.activeTab === 'revenue') {
      this.errorMessage = null;
      this.currentPage = 1; // Reset về trang 1 khi lọc lại
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
      this.currentPage = 1; // Reset về trang 1 khi thay đổi khoảng thời gian
      this.loadRevenue();
    }
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message, error);
  }
}