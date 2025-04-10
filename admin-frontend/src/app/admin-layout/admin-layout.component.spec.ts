<div class="admin-layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="logo">AdminPanel</h2>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <a routerLink="/products" routerLinkActive="active">
            <i class="fas fa-box-open"></i>
            <span>Quản lý Sản phẩm</span>
          </a>
        </li>
        <li>
          <a routerLink="/users" routerLinkActive="active">
            <i class="fas fa-users"></i>
            <span>Quản lý Người dùng</span>
          </a>
        </li>
        <li>
          <a routerLink="/categories" routerLinkActive="active">
            <i class="fas fa-tags"></i>
            <span>Quản lý Danh mục</span>
          </a>
        </li>
        <li>
          <a routerLink="/payments" routerLinkActive="active">
            <i class="fas fa-credit-card"></i>
            <span>Quản lý Thanh toán</span>
          </a>
        </li>
        <li>
          <a routerLink="/statistics" routerLinkActive="active">
            <i class="fas fa-chart-bar"></i>
            <span>Thống kê</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <button class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  </aside>

  <main class="main-content">
    <header class="main-header">
      <div class="header-left">
        <button class="sidebar-toggle">
          <i class="fas fa-bars"></i>
        </button>
        <h1 class="page-title">Dashboard</h1>
      </div>
      <div class="header-right">
        <div class="user-profile">
          <img src="assets/images/avatar.jpg" alt="User Avatar" class="avatar">
          <span class="username">Admin User</span>
          <i class="fas fa-caret-down dropdown-icon"></i>
        </div>
      </div>
    </header>
    <section class="content-container">
      <router-outlet></router-outlet>
    </section>
  </main>
</div>