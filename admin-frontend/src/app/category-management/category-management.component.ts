import { Component, OnInit } from '@angular/core';
import { CategoriesManagerService, Category } from '../service/categories-manager.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css'],
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  products: any[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private categoryService: CategoriesManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.successMessage = null;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải danh mục: ' + err.message;
        this.successMessage = null;
      },
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = { ...category };
    this.openEditCategoryForm(category);
  }

  loadProducts(categoryId: number): void {
    this.categoryService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.successMessage = null;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Không thể tải sản phẩm: ' + err.message;
        this.successMessage = null;
      },
    });
  }

  openCreateCategoryForm(): void {
    Swal.fire({
      title: 'Tạo Danh mục Mới',
      html: `
        <div class="text-start">
          <label for="name" class="form-label">Tên Danh mục <span class="text-danger">*</span></label>
          <input type="text" id="name" class="form-control mb-2" placeholder="Nhập tên danh mục" required>
          <label for="description" class="form-label">Mô tả</label>
          <textarea id="description" class="form-control mb-2" placeholder="Nhập mô tả (tùy chọn)" rows="3"></textarea>
          <label for="icon" class="form-label">URL Biểu tượng</label>
          <input type="text" id="icon" class="form-control" placeholder="Nhập URL biểu tượng (tùy chọn)">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Tạo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      focusConfirm: false,
      customClass: {
        popup: 'swal2-popup',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const icon = (document.getElementById('icon') as HTMLInputElement).value;
        if (!name) {
          Swal.showValidationMessage('Tên danh mục là bắt buộc');
          return false;
        }
        return { name, description: description || undefined, icon: icon || undefined };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const category: Category = {
          name: result.value.name,
          description: result.value.description,
          icon: result.value.icon,
        };
        this.categoryService.createCategory(category).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Danh mục đã được tạo!',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'swal2-popup',
              },
            });
            this.loadCategories();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể tạo danh mục: ' + err.message,
              customClass: {
                popup: 'swal2-popup',
              },
            });
          },
        });
      }
    });
  }

  openEditCategoryForm(category: Category): void {
    Swal.fire({
      title: 'Sửa Danh mục',
      html: `
        <div class="text-start">
          <label for="name" class="form-label">Tên Danh mục <span class="text-danger">*</span></label>
          <input type="text" id="name" class="form-control mb-2" value="${category.name}" required>
          <label for="description" class="form-label">Mô tả</label>
          <textarea id="description" class="form-control mb-2" rows="3">${
            category.description || ''
          }</textarea>
          <label for="icon" class="form-label">URL Biểu tượng</label>
          <input type="text" id="icon" class="form-control" value="${category.icon || ''}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      focusConfirm: false,
      customClass: {
        popup: 'swal2-popup',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const icon = (document.getElementById('icon') as HTMLInputElement).value;
        if (!name) {
          Swal.showValidationMessage('Tên danh mục là bắt buộc');
          return false;
        }
        return { name, description: description || undefined, icon: icon || undefined };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value && category.id) {
        const updatedCategory: Category = {
          name: result.value.name,
          description: result.value.description,
          icon: result.value.icon,
        };
        this.categoryService.updateCategory(category.id, updatedCategory).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Danh mục đã được cập nhật!',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'swal2-popup',
              },
            });
            this.loadCategories();
            this.resetSelection();
            if (this.selectedCategory?.id === category.id) {
              if (category.id !== undefined) {
                this.loadProducts(category.id);
              }
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể cập nhật danh mục: ' + err.message,
              customClass: {
                popup: 'swal2-popup',
              },
            });
          },
        });
      }
    });
  }

  deleteCategory(id: number): void {
    const category = this.categories.find((c) => c.id === id);
    Swal.fire({
      title: 'Xác nhận xóa danh mục',
      text: `Bạn có chắc muốn xóa danh mục "${category?.name}" không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
      customClass: {
        popup: 'swal2-popup swal2-delete-confirm',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Đã xóa',
              text: 'Danh mục đã được xóa thành công!',
              timer: 1500,
              showConfirmButton: false,
              customClass: {
                popup: 'swal2-popup',
              },
            });
            this.loadCategories();
            this.resetSelection();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Không thể xóa danh mục: ' + err.message,
              customClass: {
                popup: 'swal2-popup',
              },
            });
          },
        });
      }
    });
  }

  resetSelection(): void {
    this.selectedCategory = null;
    this.products = [];
  }

  clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}