import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product.model";
import imageCompression from "browser-image-compression";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom, map, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="form-section">
      <!-- TOAST DE NOTIFICACIÓN -->
      <div class="toast" [class.show]="showToast">
        <span class="toast-icon">✅</span>
        <span>{{ toastMessage }}</span>
      </div>

      <div class="form-wrapper">
        <!-- FORMULARIO PRINCIPAL -->
        <div class="form-container">
          <!-- Encabezado del Formulario -->
          <div class="form-header">
            <h1>{{ editId ? "Editar Producto" : "Nuevo Producto" }}</h1>
            <p class="subtitle">
              {{
                editId
                  ? "Modifica los detalles del producto seleccionado"
                  : "Ingresa los datos para publicar un nuevo producto"
              }}
            </p>
          </div>

          <form (ngSubmit)="save()" class="product-form">
            <!-- Campo Nombre -->
            <div class="form-group">
              <label for="name">Nombre del producto</label>
              <input
                id="name"
                type="text"
                name="name"
                [(ngModel)]="product.name"
                placeholder="Ej. Tacones Elegantes Rose"
                required
              />
            </div>

            <!-- Selección de Tallas (Chips de Botones) -->
            <div class="form-group">
              <label>Tallas Disponibles</label>
              <div class="sizes-grid">
                <button
                  type="button"
                  *ngFor="let size of availableSizes"
                  class="size-chip"
                  [class.selected]="isSelectedSize(size)"
                  (click)="toggleSize(size)"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Carga de Imagen -->
            <div class="form-group">
              <label>Imagen del Producto</label>
              <div class="file-dropzone">
                <input
                  type="file"
                  id="file-input"
                  #fileInput
                  accept="image/*"
                  (change)="onImageSelected($event)"
                />
                <label for="file-input" class="file-label">
                  <span class="icon">📷</span>
                  <span>{{
                    selectedFile ? selectedFile.name : "Seleccionar una imagen"
                  }}</span>
                </label>
              </div>
            </div>

            <!-- Vista Previa de la Imagen -->
            <div class="preview-box" *ngIf="imagePreview">
              <p class="preview-title">Vista previa:</p>
              <img [src]="imagePreview" alt="Vista previa" />
            </div>

            <!-- Botones de Acción -->
            <div class="actions">
              <button type="submit" class="btn-submit" [disabled]="saving">
                {{
                  saving
                    ? "Guardando..."
                    : editId
                    ? "Actualizar Producto"
                    : "Guardar Producto"
                }}
              </button>

              <button type="button" (click)="finish()" class="btn-finish">
                🏁 Finalizar / Volver al Panel
              </button>

              <a routerLink="/admin" class="btn-cancel">Cancelar</a>
            </div>
          </form>
        </div>

        <!-- PANEL LATERAL: LISTA DE PRODUCTOS AGREGADOS EN LA SESIÓN -->
        <aside class="saved-panel" *ngIf="savedProductsList.length > 0">
          <div class="panel-header">
            <h3>Agregados recientemente</h3>
            <span class="badge-count">{{ savedProductsList.length }}</span>
          </div>

          <ul class="saved-list">
            <li *ngFor="let name of savedProductsList; let i = index">
              <span class="item-icon">👟</span>
              <span class="item-name">{{ name }}</span>
            </li>
          </ul>

          <button (click)="finish()" class="btn-done-side">
            ✓ Finalizar y volver
          </button>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      /* =========================================
         SECCIÓN Y CONTENEDORES
         ========================================= */
      .form-section {
        min-height: 100vh;
        background: linear-gradient(
          160deg,
          #fbf7f8 0%,
          #eaf3f5 50%,
          #f5eff2 100%
        );
        padding-top: 140px;
        padding-bottom: 80px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: relative;
      }

      .form-wrapper {
        display: flex;
        gap: 24px;
        max-width: 920px;
        width: 100%;
        margin: 0 16px;
        align-items: flex-start;
      }

      .form-container {
        background: #ffffff;
        flex: 1;
        padding: 35px 30px;
        border-radius: 24px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
      }

      .form-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .form-header h1 {
        font-size: 1.8rem;
        color: #1a1a1a;
        font-weight: 800;
        margin: 0 0 8px 0;
      }

      .subtitle {
        font-size: 0.9rem;
        color: #666;
        margin: 0;
      }

      /* =========================================
         CAMPOS DE FORMULARIO
         ========================================= */
      .form-group {
        margin-bottom: 22px;
      }

      .form-group label {
        display: block;
        font-size: 0.88rem;
        font-weight: 700;
        color: #333;
        margin-bottom: 8px;
      }

      input[type="text"] {
        width: 100%;
        padding: 12px 14px;
        border: 1.5px solid #e1e5e8;
        border-radius: 12px;
        font-size: 0.95rem;
        font-family: inherit;
        background: #fafafa;
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      input[type="text"]:focus {
        outline: none;
        border-color: #bfebe6;
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(191, 235, 230, 0.3);
      }

      /* =========================================
         CHIPS DE TALLAS
         ========================================= */
      .sizes-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .size-chip {
        background: #f0f2f5;
        color: #444;
        border: 1.5px solid transparent;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .size-chip:hover {
        background: #e2e7ec;
      }

      .size-chip.selected {
        background: #0b1a20;
        color: #ffffff;
        border-color: #0b1a20;
        box-shadow: 0 4px 10px rgba(11, 26, 32, 0.2);
      }

      /* =========================================
         IMAGEN & PREVIEW
         ========================================= */
      .file-dropzone input[type="file"] {
        display: none;
      }

      .file-label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        background: #f8fafc;
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        cursor: pointer;
        font-size: 0.9rem;
        color: #475569;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .file-label:hover {
        background: #f1f5f9;
      }

      .preview-box {
        text-align: center;
        margin-bottom: 20px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 12px;
      }

      .preview-title {
        font-size: 0.8rem;
        color: #64748b;
        margin: 0 0 8px 0;
        font-weight: 600;
      }

      .preview-box img {
        max-width: 100%;
        max-height: 180px;
        border-radius: 10px;
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      /* =========================================
         BOTONES DE ACCIÓN
         ========================================= */
      .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 28px;
      }

      .btn-submit {
        background-color: #bfebe6;
        color: #0b1a20;
        border: none;
        padding: 14px;
        border-radius: 30px;
        font-weight: 800;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
      }

      .btn-submit:hover:not(:disabled) {
        background-color: #a4e4e0;
        transform: translateY(-1px);
      }

      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-finish {
        background-color: #0b1a20;
        color: #ffffff;
        border: none;
        padding: 12px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .btn-finish:hover {
        background-color: #172e38;
      }

      .btn-cancel {
        text-align: center;
        color: #64748b;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 6px;
      }

      .btn-cancel:hover {
        color: #0b1a20;
      }

      /* =========================================
         PANEL LATERAL (LISTA DE PRODUCTOS GUARDADOS)
         ========================================= */
      .saved-panel {
        width: 300px;
        background: #ffffff;
        border-radius: 24px;
        padding: 24px 20px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
        animation: fadeIn 0.3s ease-in-out;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .panel-header h3 {
        font-size: 0.95rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
      }

      .badge-count {
        background: #bfebe6;
        color: #0b1a20;
        font-weight: 800;
        font-size: 0.8rem;
        padding: 2px 10px;
        border-radius: 12px;
      }

      .saved-list {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        max-height: 280px;
        overflow-y: auto;
      }

      .saved-list li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: #f8fafc;
        border-radius: 12px;
        margin-bottom: 8px;
        font-size: 0.88rem;
        color: #334155;
        font-weight: 600;
      }

      .item-icon {
        font-size: 1.1rem;
      }

      .item-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .btn-done-side {
        width: 100%;
        background: #0b1a20;
        color: #ffffff;
        border: none;
        padding: 11px;
        border-radius: 14px;
        font-weight: 700;
        font-size: 0.88rem;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .btn-done-side:hover {
        background: #172e38;
      }

      /* =========================================
         TOAST FLOTANTE
         ========================================= */
      .toast {
        position: fixed;
        top: 30px;
        right: 30px;
        background: #0b1a20;
        color: #ffffff;
        padding: 14px 22px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        font-size: 0.92rem;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
      }

      .toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .toast-icon {
        font-size: 1.2rem;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Responsive */
      @media (max-width: 800px) {
        .form-wrapper {
          flex-direction: column;
        }

        .saved-panel {
          width: 100%;
          box-sizing: border-box;
        }
      }
    `,
  ],
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly imgbbApiKey = environment.imgbbApiKey;

  availableSizes: string[] = [
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
  ];

  editId: string | null = null;
  saving = false;
  selectedFile?: File;
  imagePreview?: string;

  // ESTADOS NUEVOS
  savedProductsList: string[] = []; // Nombres de los productos guardados en la sesión
  showToast = false;
  toastMessage = "";

  product: Product = {
    name: "",
    description: "",
    price: 0,
    sizes: [],
    inStock: true,
    imageUrl: "",
  };

  async ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get("id");

    if (this.editId) {
      try {
        const found = await this.productService.getProductById(this.editId);
        if (found) {
          this.product = { ...found };
          if (!this.product.sizes) {
            this.product.sizes = [];
          }
          if (found.imageUrl) {
            this.imagePreview = found.imageUrl;
          }
        }
      } catch (error) {
        console.error("Error al obtener producto para edición:", error);
      }
    }
  }

  isSelectedSize(size: string): boolean {
    return this.product.sizes ? this.product.sizes.includes(size) : false;
  }

  toggleSize(size: string) {
    if (!this.product.sizes) {
      this.product.sizes = [];
    }

    if (this.isSelectedSize(size)) {
      this.product.sizes = this.product.sizes.filter((s) => s !== size);
    } else {
      this.product.sizes.push(size);
      this.product.sizes.sort((a, b) => Number(a) - Number(b));
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  async compressImage(file: File) {
    return await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
  }

  async save() {
    if (!this.product.name) {
      this.triggerToast("Por favor ingresa el nombre del producto");
      return;
    }

    this.saving = true;

    try {
      const data: any = {
        ...this.product,
        createdAt: this.product.createdAt ?? Date.now(),
      };

      if (this.selectedFile) {
        const compressed = await this.compressImage(this.selectedFile);
        const imageUrl = await this.uploadToImgBB(compressed);
        data.imageUrl = imageUrl;
      }

      if (this.editId) {
        await this.productService.updateProduct(this.editId, data);
        this.triggerToast("¡Producto actualizado con éxito!");
        this.finish(); // Si está editando, redirige directo
        return;
      } else {
        await this.productService.addProduct(data);
        // Guardamos el nombre en la lista lateral
        this.savedProductsList.unshift(data.name);
        this.triggerToast("¡Guardado correctamente!");
      }

      // Reiniciamos el formulario para continuar agregando más productos
      this.resetForm();
    } catch (err) {
      console.error("Error guardando producto:", err);
      this.triggerToast("Ocurrió un error al guardar el producto");
    } finally {
      this.saving = false;
    }
  }

  // REINICIA EL FORMULARIO
  resetForm() {
    this.product = {
      name: "",
      description: "",
      price: 0,
      sizes: [],
      inStock: true,
      imageUrl: "",
    };
    this.selectedFile = undefined;
    this.imagePreview = undefined;

    // Resetea el input file
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  // MOSTRAR TOAST NOTIFICACIÓN
  triggerToast(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // BOTÓN PARA VOLVER AL PANEL
  finish() {
    this.router.navigate(["/admin"]);
  }

  async uploadToImgBB(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await firstValueFrom(
        this.http
          .post<any>(
            `https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`,
            formData
          )
          .pipe(
            map((res) => res.data.url),
            catchError((error: HttpErrorResponse) => {
              console.error("Error uploading image to ImgBB:", error);
              return throwError(
                () =>
                  new Error(
                    error.error?.message ?? "Error al subir la imagen"
                  )
              );
            })
          )
      );

      return response;
    } catch (error) {
      console.error("Fallo al subir imagen:", error);
      throw error;
    }
  }
}