import { Component, OnInit } from '@angular/core';
import { OrderManagerService } from '../service/order-manager.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  orders: any[] = []; // Danh sách tất cả đơn hàng
  paginatedOrders: any[] = []; // Danh sách đơn hàng theo trang
  errorMessage: string = '';
  selectedStatus: string = '';

  // Biến phân trang
  currentPage: number = 1;
  pageSize: number = 12;
  totalPages: number = 1;

  constructor(private orderManagerService: OrderManagerService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Tải tất cả đơn hàng từ service
  loadOrders(): void {
    this.orderManagerService.getAllOrders().subscribe(
      (data) => {
        this.orders = data;
        this.totalPages = Math.ceil(this.orders.length / this.pageSize);
        this.setPaginatedOrders();
      },
      (error) => {
        this.errorMessage = 'Lỗi khi tải dữ liệu đơn hàng.';
        console.error(error);
      }
    );
  }

  // Lấy đơn hàng theo trang hiện tại
  setPaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.orders.slice(startIndex, endIndex);
  }

  // Chuyển trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedOrders();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPaginatedOrders();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPaginatedOrders();
    }
  }

  // Thay đổi trạng thái được chọn
  onStatusChange(newStatus: string): void {
    this.selectedStatus = newStatus;
  }

  // Cập nhật trạng thái đơn hàng
  updateOrder(id: number): void {
    if (!this.selectedStatus) {
      this.errorMessage = 'Vui lòng chọn trạng thái mới trước khi cập nhật.';
      return;
    }

    Swal.fire({
      title: 'Bạn có chắc muốn cập nhật trạng thái đơn hàng này?',
      text: "Sau khi cập nhật, trạng thái sẽ thay đổi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, cập nhật!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrder = { status: this.selectedStatus };
        this.orderManagerService.updateOrder(id, updatedOrder).subscribe(
          () => {
            const updatedOrderIndex = this.orders.findIndex(order => order.id === id);
            if (updatedOrderIndex !== -1) {
              this.orders[updatedOrderIndex].status = this.selectedStatus;
              this.setPaginatedOrders(); // Cập nhật trang hiện tại
            }

            Swal.fire('Đã cập nhật!', 'Trạng thái đơn hàng đã được cập nhật.', 'success');
          },
          (error) => {
            this.errorMessage = 'Lỗi khi cập nhật đơn hàng.';
            console.error(error);
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật trạng thái.', 'error');
          }
        );
      }
    });
  }

  // Xóa đơn hàng
  deleteOrder(id: number): void {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa đơn hàng này?',
      text: "Sau khi xóa, bạn không thể phục hồi lại đơn hàng!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderManagerService.deleteOrder(id).subscribe(
          () => {
            Swal.fire('Đã xóa!', 'Đơn hàng đã được xóa thành công.', 'success');
            this.loadOrders();
          },
          (error) => {
            this.errorMessage = 'Lỗi khi xóa đơn hàng.';
            console.error(error);
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa đơn hàng.', 'error');
          }
        );
      }
    });
  }

  // Trả về class CSS tương ứng với trạng thái
  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      PENDING: 'status-pending',
      PAID: 'status-paid',
      SHIPPED: 'status-shipped',
      DELIVERED: 'status-delivered',
      CANCELED: 'status-canceled',
      COD_CONFIRMED: 'status-cod-confirmed',
      REFUNDED: 'status-refunded',
      RETURNED: 'status-returned',
      FAILED: 'status-failed'
    };
    return statusClassMap[status] || 'status-unknown';
  }
}
