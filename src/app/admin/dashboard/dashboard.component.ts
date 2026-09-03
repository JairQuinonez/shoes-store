import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";
import { AuthService } from "../../services/auth.service";
import { Product } from "../../models/product.model";
import { QueryDocumentSnapshot, DocumentData } from "@angular/fire/firestore";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-wrapper">
      <aside class="sidebar">
        <div class="brand-section">
          <h2>Panel Admin</h2>
          <span class="role-badge">Gestión</span>
        </div>

        <nav class="nav-menu">
          <a routerLink="/admin/nuevo" class="btn-primary">
            <span class="icon">+</span> Nuevo producto
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="btn-logout" (click)="logout()">
            <span class="icon">🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="content-header">
          <div>
            <h1>Catálogo de Productos</h1>
            <p class="subtitle">
              Administra los productos, precios y disponibilidad en tu tienda
            </p>
          </div>
          <a routerLink="/admin/nuevo" class="btn-primary mobile-btn">
            + Nuevo producto
          </a>
        </header>

        <div class="table-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Tallas</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                @if (loading) {
                  <tr>
                    <td colspan="4" class="state-cell">
                      <div class="loader-spinner"></div>
                      <p>Cargando productos...</p>
                    </td>
                  </tr>
                }
                @if (!loading) {
                  @for (p of products; track p.id) {
                    <tr>
                    <td class="img-cell">
                      <div class="img-wrapper">
                        <img
                          [src]="p.imageUrl || '/assets/placeholder.png'"
                          [alt]="p.name"
                        />
                      </div>
                    </td>
                    <td class="name-cell">
                      <strong>{{ p.name }}</strong>
                    </td>

                    <td class="sizes-cell">
                      @if (p.sizes && p.sizes.length) {
                        <span class="sizes-tag">
                          {{ p.sizes.join(", ") }}
                        </span>
                      }
                      @if (!p.sizes || !p.sizes.length) {
                        <span class="no-sizes">—</span>
                      }
                    </td>

                    <td class="actions-cell">
                      <a
                        [routerLink]="['/admin/editar', p.id]"
                        class="btn-edit"
                      >
                        ✏️ Editar
                      </a>
                      <button (click)="remove(p.id!)" class="btn-delete">
                        🗑️ Eliminar
                      </button>
                    </td>
                    </tr>
                  }
                }

                @if (!loading && products.length === 0) {
                  <tr>
                    <td colspan="4" class="state-cell empty-state">
                      <span class="empty-icon">🛍️</span>
                      <p>No hay productos en esta página.</p>
                      <a routerLink="/admin/nuevo" class="link-add">
                        Agregar un producto
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div
            class="pagination-bar"
          >
            @if (!loading && (products.length > 0 || currentPage > 1)) {
            <div class="page-size-selector">
              <label for="pageSize">Mostrar por página:</label>
              <select
                id="pageSize"
                [(ngModel)]="pageSize"
                (change)="changePageSize()"
              >
                <option [ngValue]="5">5</option>
                <option [ngValue]="10">10</option>
                <option [ngValue]="20">20</option>
                <option [ngValue]="50">50</option>
              </select>
            </div>

            <span class="pagination-info">
              Página <strong>{{ currentPage }}</strong>
            </span>

            <div class="pagination-controls">
              <button
                class="btn-page"
                (click)="prevPage()"
                [disabled]="currentPage === 1 || loading"
              >
                ← Anterior
              </button>
              <button
                class="btn-page"
                (click)="nextPage()"
                [disabled]="!hasMore || loading"
              >
                Siguiente →
              </button>
            </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .dashboard-wrapper {
        display: flex;
        min-height: 100vh;
        background: linear-gradient(
          160deg,
          #fbf7f8 0%,
          #eaf3f5 50%,
          #f5eff2 100%
        );
        padding-top: 130px;
      }

      .sidebar {
        width: 260px;
        background: #0b1a20;
        color: #ffffff;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        margin-bottom: 30px;
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      .brand-section h2 {
        font-size: 1.4rem;
        font-weight: 800;
        margin: 0;
        color: #ffffff;
      }

      .role-badge {
        display: inline-block;
        font-size: 0.72rem;
        background: rgba(255, 255, 255, 0.12);
        color: #bfebe6;
        padding: 3px 10px;
        border-radius: 12px;
        margin-top: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .nav-menu {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .nav-menu a,
      .btn-primary {
        justify-content: flex-start;
        padding: 12px 16px;
        text-align: left;
      }

      .sidebar-footer {
        margin-top: auto;
        padding-top: 20px;
      }

      .btn-primary {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #bfebe6;
        color: #0b1a20;
        text-decoration: none;
        padding: 12px 18px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(191, 235, 230, 0.3);
      }

      .btn-primary:hover {
        background: #a3e2dc;
        transform: translateY(-2px);
      }

      .btn-logout {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #e2e8f0;
        padding: 11px;
        border-radius: 14px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.25s ease;
      }

      .btn-logout:hover {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.4);
        color: #fca5a5;
      }

      .main-content {
        flex: 1;
        padding: 0 35px 50px 30px;
      }

      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
      }

      .content-header h1 {
        font-size: 1.8rem;
        font-weight: 800;
        color: #111827;
        margin: 0;
      }

      .subtitle {
        color: #6b7280;
        font-size: 0.9rem;
        margin-top: 4px;
      }

      .mobile-btn {
        display: none;
      }

      .table-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        border: 1px solid #f1f5f9;
      }

      .table-responsive {
        width: 100%;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }

      th {
        background: #fafafa;
        color: #475569;
        font-weight: 700;
        font-size: 0.82rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
      }

      td {
        padding: 14px 20px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
        font-size: 0.9rem;
        color: #334155;
      }

      tr:hover {
        background-color: #f8fafc;
      }

      .img-wrapper {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        overflow: hidden;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .name-cell strong {
        color: #0f172a;
      }

      .sizes-tag {
        font-size: 0.82rem;
        background: #f1f5f9;
        padding: 4px 10px;
        border-radius: 8px;
        color: #475569;
        font-weight: 600;
      }

      .no-sizes {
        color: #94a3b8;
      }

      .text-right {
        text-align: right;
      }

      .actions-cell {
        text-align: right;
        white-space: nowrap;
      }

      .btn-edit {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 8px;
        margin-right: 6px;
        transition: background 0.2s ease;
      }

      .btn-edit:hover {
        background: #eff6ff;
      }

      .btn-delete {
        background: none;
        border: none;
        color: #dc2626;
        font-weight: 600;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 8px;
        transition: background 0.2s ease;
      }

      .btn-delete:hover {
        background: #fef2f2;
      }

      .state-cell {
        text-align: center;
        padding: 40px !important;
        color: #64748b;
      }

      .empty-icon {
        font-size: 2.2rem;
        display: block;
        margin-bottom: 8px;
      }

      .link-add {
        display: inline-block;
        margin-top: 10px;
        color: #0b1a20;
        font-weight: 700;
        text-decoration: underline;
      }

      .loader-spinner {
        width: 30px;
        height: 30px;
        border: 3px solid #e2e8f0;
        border-top-color: #0b1a20;
        border-radius: 50%;
        margin: 0 auto 12px auto;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .pagination-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #fafafa;
        border-top: 1px solid #e2e8f0;
        gap: 12px;
        flex-wrap: wrap;
      }

      .page-size-selector {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        color: #64748b;
        font-weight: 600;
      }

      .page-size-selector select {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1.5px solid #cbd5e1;
        background: #ffffff;
        color: #0f172a;
        font-weight: 700;
        cursor: pointer;
      }

      .pagination-info {
        font-size: 0.88rem;
        color: #64748b;
      }

      .pagination-controls {
        display: flex;
        gap: 10px;
      }

      .btn-page {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        color: #334155;
        padding: 8px 16px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-page:hover:not(:disabled) {
        background: #f1f5f9;
        border-color: #94a3b8;
        color: #0f172a;
      }

      .btn-page:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      @media (max-width: 860px) {
        .dashboard-wrapper {
          flex-direction: column;
        }

        .sidebar {
          width: auto;
          margin: 0 20px 20px 20px;
        }

        .main-content {
          padding: 0 20px 40px 20px;
        }

        .mobile-btn {
          display: flex;
        }

        .sidebar .btn-primary {
          display: none;
        }

        .pagination-bar {
          flex-direction: column;
          align-items: stretch;
          text-align: center;
        }

        .pagination-controls {
          justify-content: center;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];
  loading = true;

  pageSize = 5;
  currentPage = 1;
  hasMore = false;

  private pageCursors: (QueryDocumentSnapshot<DocumentData> | null)[] = [null];

  ngOnInit() {
    this.loadPage(1);
  }

  async loadPage(page: number) {
    this.loading = true;

    try {
      const cursor = this.pageCursors[page - 1] ?? null;
      const res = await this.productService.getProductsPage(
        this.pageSize,
        cursor,
      );

      this.products = res.products;
      this.hasMore = res.hasMore;
      this.currentPage = page;

      if (res.lastDoc) {
        this.pageCursors[page] = res.lastDoc;
      }
    } catch (err) {
      console.error("Error al cargar la página:", err);
    } finally {
      this.loading = false;
    }
  }

  changePageSize() {
    this.pageCursors = [null];
    this.loadPage(1);
  }

  nextPage() {
    if (this.hasMore) {
      this.loadPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  async remove(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await this.productService.deleteProduct(id);
        this.loadPage(this.currentPage);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        alert("Ocurrió un error al intentar eliminar el producto.");
      }
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(["/admin/login"]);
  }
}
