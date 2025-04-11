import { Component, OnInit } from '@angular/core';
import { UserManagerService, User, UpdateProfileRequest } from '../service/user-manager.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  searchTerm: string = '';

  constructor(private userService: UserManagerService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalItems = data.length;
      },
      error: (error) => {
        Swal.fire('Lỗi!', error.message || 'Không thể tải danh sách người dùng', 'error');
      }
    });
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.users
      .filter(user => 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  selectUser(user: User): void {
    Swal.fire({
      title: `Sửa thông tin: ${user.username}`,
      html: `
        <form id="editForm">
          <div class="form-group">
            <label for="email">Email <span class="text-danger">*</span></label>
            <input id="email" class="swal2-input" placeholder="Nhập email" 
                   value="${user.email}" required>
          </div>
          <div class="form-group">
            <label for="fullName">Họ tên <span class="text-danger">*</span></label>
            <input id="fullName" class="swal2-input" placeholder="Nhập họ tên" 
                   value="${user.fullName}" required>
          </div>
          <div class="form-group">
            <label for="phone">Số điện thoại</label>
            <input id="phone" class="swal2-input" placeholder="Nhập số điện thoại" 
                   value="${user.phone || ''}">
          </div>
          <div class="form-group">
            <label for="address">Địa chỉ</label>
            <input id="address" class="swal2-input" placeholder="Nhập địa chỉ" 
                   value="${user.address || ''}">
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const email = (Swal.getPopup()?.querySelector('#email') as HTMLInputElement)?.value;
        const fullName = (Swal.getPopup()?.querySelector('#fullName') as HTMLInputElement)?.value;
        const phone = (Swal.getPopup()?.querySelector('#phone') as HTMLInputElement)?.value;
        const address = (Swal.getPopup()?.querySelector('#address') as HTMLInputElement)?.value;

        if (!email || !fullName) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ thông tin bắt buộc');
          return false;
        }

        return { email, fullName, phone, address };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updateRequest: UpdateProfileRequest = result.value;
        this.userService.updateUser(user.id, updateRequest).subscribe({
          next: () => {
            Swal.fire('Thành công!', 'Cập nhật thông tin người dùng thành công!', 'success');
            this.loadUsers();
          },
          error: (error) => {
            Swal.fire('Lỗi!', error.message || 'Có lỗi xảy ra khi cập nhật', 'error');
          }
        });
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Bạn chắc chắn muốn xóa?',
      text: "Bạn sẽ không thể hoàn tác lại thao tác này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            Swal.fire('Đã xóa!', 'Người dùng đã được xóa thành công.', 'success');
            this.loadUsers();
          },
          error: (error) => {
            Swal.fire('Lỗi!', error.message || 'Có lỗi xảy ra khi xóa', 'error');
          }
        });
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
  }
}