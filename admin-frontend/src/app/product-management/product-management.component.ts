import { Component, OnInit } from '@angular/core';
import { ProductManagerService, ProductDTO } from '../service/product-manager.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: ProductDTO[] = [];
  paginatedProducts: ProductDTO[] = [];
  isLoading = false;
  errorMessage = '';

  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;

  constructor(private productService: ProductManagerService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
        this.updatePaginatedProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        let errorMsg = 'Lỗi khi tải danh sách sản phẩm';
        if (error.status === 403) {
          errorMsg = 'Bạn không có quyền truy cập danh sách sản phẩm (403 Forbidden)';
        } else if (error.status === 401) {
          errorMsg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại (401 Unauthorized)';
        } else {
          errorMsg += `: ${error.message}`;
        }
        this.errorMessage = errorMsg;
        console.error('Lỗi tải sản phẩm:', error);
      }
    });
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  async addNewProduct(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Thêm sản phẩm mới',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Tên sản phẩm" required>' +
        '<input id="swal-input2" class="swal2-input" type="number" placeholder="ID danh mục">' +
        '<input id="swal-input3" class="swal2-input" type="number" placeholder="Giá" required>' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Số lượng tồn kho" required>' +
        '<input id="swal-input5" class="swal2-input" type="number" placeholder="Đánh giá">' +
        '<input id="swal-input6" class="swal2-input" placeholder="URL ảnh sản phẩm">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const categoryId = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const price = (document.getElementById('swal-input3') as HTMLInputElement).value;
        const stockQuantity = (document.getElementById('swal-input4') as HTMLInputElement).value;
        const rating = (document.getElementById('swal-input5') as HTMLInputElement).value;
        const imageUrl = (document.getElementById('swal-input6') as HTMLInputElement).value;

        if (!name || !price || !stockQuantity) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return null;
        }

        return {
          name,
          categoryId: categoryId ? Number(categoryId) : null,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          rating: rating ? Number(rating) : null,
          imageUrl: imageUrl || null
        };
      }
    });

    if (formValues) {
      this.isLoading = true;
      this.productService.create([formValues]).subscribe({
        next: (response) => {
          if (response && response[0]) {
            this.products.push(response[0]);
            this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
            this.updatePaginatedProducts();
          } else {
  
            this.loadProducts();
          }
          this.isLoading = false;
          Swal.fire('Thành công', 'Sản phẩm đã được thêm!', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'Lỗi khi tạo sản phẩm';
          if (error.status === 403) {
            errorMsg = 'Bạn không có quyền thêm sản phẩm (403 Forbidden)';
          } else if (error.status === 401) {
            errorMsg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại (401 Unauthorized)';
          } else {
            errorMsg += `: ${error.message}`;
          }
          this.errorMessage = errorMsg;
          Swal.fire('Lỗi', errorMsg, 'error');
          console.error('Lỗi thêm sản phẩm:', error);
        }
      });
    }
  }

  async updateProduct(product: ProductDTO): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Sửa sản phẩm',
      html:
        `<input id="swal-input1" class="swal2-input" value="${product.name || ''}" placeholder="Tên sản phẩm" required>` +
        `<input id="swal-input2" class="swal2-input" type="number" value="${product.categoryId || ''}" placeholder="ID danh mục">` +
        `<input id="swal-input3" class="swal2-input" type="number" value="${product.price || ''}" placeholder="Giá" required>` +
        `<input id="swal-input4" class="swal2-input" type="number" value="${product.stockQuantity || ''}" placeholder="Số lượng tồn kho" required>` +
        `<input id="swal-input5" class="swal2-input" type="number" value="${product.rating || ''}" placeholder="Đánh giá">` +
        `<input id="swal-input6" class="swal2-input" value="${product.imageUrl || ''}" placeholder="URL ảnh sản phẩm">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const categoryId = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const price = (document.getElementById('swal-input3') as HTMLInputElement).value;
        const stockQuantity = (document.getElementById('swal-input4') as HTMLInputElement).value;
        const rating = (document.getElementById('swal-input5') as HTMLInputElement).value;
        const imageUrl = (document.getElementById('swal-input6') as HTMLInputElement).value;

        if (!name || !price || !stockQuantity) {
          Swal.showValidationMessage('Vui lòng điền đầy đủ các trường bắt buộc');
          return null;
        }

        return {
          id: product.id,
          name,
          categoryId: categoryId ? Number(categoryId) : null,
          price: Number(price),
          stockQuantity: Number(stockQuantity),
          rating: rating ? Number(rating) : null,
          imageUrl: imageUrl || null
        };
      }
    });

    if (formValues) {
      this.isLoading = true;
      this.productService.update(formValues.id!, formValues).subscribe({
        next: (response) => {
          if (response) {
            const index = this.products.findIndex(p => p.id === formValues.id);
            if (index !== -1) {
              this.products[index] = response;
              this.updatePaginatedProducts();
            }
          } else {
            this.loadProducts();
          }
          this.isLoading = false;
          Swal.fire('Thành công', 'Sản phẩm đã được cập nhật!', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'Lỗi khi cập nhật sản phẩm';
          if (error.status === 403) {
            errorMsg = 'Bạn không có quyền cập nhật sản phẩm (403 Forbidden)';
          } else if (error.status === 401) {
            errorMsg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại (401 Unauthorized)';
          } else {
            errorMsg += `: ${error.message}`;
          }
          this.errorMessage = errorMsg;
          Swal.fire('Lỗi', errorMsg, 'error');
          console.error('Lỗi cập nhật sản phẩm:', error);
        }
      });
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await Swal.fire({
      title: 'Bạn có chắc không?',
      text: 'Bạn sẽ không thể khôi phục sản phẩm này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      this.isLoading = true;
      this.productService.delete(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
          this.updatePaginatedProducts();
          this.isLoading = false;
          Swal.fire('Đã xóa', 'Sản phẩm đã được xóa thành công!', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          let errorMsg = 'Lỗi khi xóa sản phẩm';
          if (error.status === 403) {
            errorMsg = 'Bạn không có quyền xóa sản phẩm (403 Forbidden)';
          } else if (error.status === 401) {
            errorMsg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại (401 Unauthorized)';
          } else {
            errorMsg += `: ${error.message}`;
          }
          this.errorMessage = errorMsg;
          Swal.fire('Lỗi', errorMsg, 'error');
          console.error('Chi tiết lỗi xóa sản phẩm:', error);
        }
      });
    }
  }

  updateStock(id: number, increment: number = 10): void {
    this.isLoading = true;
    // Tìm sản phẩm trong danh sách để lấy stockQuantity hiện tại
    const product = this.products.find(p => p.id === id);
    if (!product || product.stockQuantity === undefined || product.stockQuantity === null) {
      this.isLoading = false;
      this.errorMessage = 'Không tìm thấy sản phẩm hoặc số lượng tồn kho không hợp lệ';
      Swal.fire('Lỗi', this.errorMessage, 'error');
      return;
    }

    // Tính số lượng mới bằng cách cộng thêm increment (10) vào giá trị hiện tại
    const newQuantity = product.stockQuantity + increment;

    this.productService.updateStock(id, newQuantity).subscribe({
      next: (response) => {
        if (response) {
          const index = this.products.findIndex(p => p.id === id);
          if (index !== -1) {
            this.products[index] = response;
            this.updatePaginatedProducts();
          }
        } else {
          this.loadProducts();
        }
        this.isLoading = false;
        Swal.fire('Thành công', `Đã tăng ${increment} tồn kho!`, 'success');
      },
      error: (error) => {
        this.isLoading = false;
        let errorMsg = 'Lỗi khi cập nhật tồn kho';
        if (error.status === 0) {
          errorMsg = 'Không thể kết nối đến server (CORS hoặc server không chạy)';
        } else if (error.status === 403) {
          errorMsg = 'Bạn không có quyền cập nhật tồn kho (403 Forbidden)';
        } else if (error.status === 401) {
          errorMsg = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại (401 Unauthorized)';
        } else {
          errorMsg += `: ${error.message}`;
        }
        this.errorMessage = errorMsg;
        Swal.fire('Lỗi', errorMsg, 'error');
        console.error('Chi tiết lỗi cập nhật tồn kho:', error);
      }
    });
  }
}