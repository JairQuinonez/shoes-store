import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { QueryDocumentSnapshot, DocumentData } from "@angular/fire/firestore";
import { ProductService } from "../../services/product.service";
import { Product } from "../../models/product.model";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-catalog",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="catalog-section">
      <div class="container">
        
        <div class="catalog-header">
          <h2>Catálogo de Productos</h2>
          <p class="subtitle">Encuentra el par perfecto para cada ocasión</p>
        </div>

        
        @if (displayedProducts.length > 0) {
          <div class="grid">
            @for (p of displayedProducts; track $index) {
              <article class="product-card">
                <div class="image-wrapper">
                  <!-- Fallback si no hay imagen -->
                  <img
                    [src]="p.imageSrc || p.imageUrl || 'assets/placeholder.png'"
                    [alt]="p.name || 'Producto'"
                    loading="lazy"
                  />
                </div>

                <div class="card-info">
                  <h2 class="product-title" [title]="p.name">
                    {{ p.name || "Producto sin nombre" }}
                  </h2>

                  <div class="sizes-container">
                    <p class="sizes-label">Tallas disponibles:</p>
                    <p class="sizes-numbers">
                      {{
                        p.sizes && p.sizes.length > 0
                          ? p.sizes.join(" - ")
                          : "Consultar disponiblidad"
                      }}
                    </p>
                  </div>

                  <div class="btn-wrapper">
                    <a
                      [href]="getWhatsAppLink(p.name || 'este producto')"
                      target="_blank"
                      class="btn-price"
                    >
                      Preguntar precio
                    </a>
                  </div>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="initial-loading">
            <p>Cargando catálogo...</p>
          </div>
        }

        <div #scrollAnchor class="scroll-anchor">
          @if (isLoading && displayedProducts.length > 0) {
            <p class="loading-more">Cargando más productos...</p>
          }

          @if (!isLoading && !hasMore && displayedProducts.length > 0) {
            <p class="end-message">Has llegado al final del catálogo</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* =========================================
         ANIMACIÓN DE ENTRADA SUAVE (FADE IN + SUBIDA)
         ========================================= */
      @keyframes fadeInUp {
        from {
          opacity: 0.15;
          transform: translateY(32px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* =========================================
         SECCIÓN PRINCIPAL & FONDO DEGRADADO
         ========================================= */
      .catalog-section {
        min-height: 100vh;
        background: linear-gradient(
          160deg,
          #fbf7f8 0%,
          #eaf3f5 50%,
          #f5eff2 100%
        );
        padding-top: 130px;
        padding-bottom: 80px;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
      }

      .catalog-header {
        text-align: center;
        margin-bottom: 50px;
      }

      .catalog-header h2 {
        font-size: 2.2rem;
        color: #1a1a1a;
        font-weight: 800;
        margin: 0 0 8px 0;
        letter-spacing: 0.5px;
      }

      .subtitle {
        font-size: 1rem;
        color: #666;
        margin: 0;
      }

      /* =========================================
   GRID Y TARJETAS BLOQUEADAS
   ========================================= */
      .grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 50px 35px;
      }

      .product-card {
        background: #ffffff;
        width: 260px;
        height: 400px; /* Altura total fija */
        border-radius: 0 80px 0 80px;
        text-align: center;
        position: relative;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;

        /* Flexbox para estructurar imagen arriba e info abajo */
        display: flex;
        flex-direction: column;
      }

      /* 1. IMAGEN CON TAMAÑO FIJO Y FONDO DE RESERVA */
      .image-wrapper {
        width: 100%;
        height: 220px; /* Altura fija */
        border-radius: 0 80px 0 0;
        position: relative;
        background-color: #f3f4f6; /* Se ve si la imagen no carga */
        flex-shrink: 0; /* Previene que la imagen se reduzca */
      }

      .product-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0 80px 0 0;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        z-index: 20;
      }

      .product-card img:hover {
        transform: scale(1.3) translateY(-40px);
        border-radius: 15px;
        filter: drop-shadow(0 20px 30px rgba(167, 216, 216, 0.7)) saturate(1.2)
          contrast(1.1);
      }

      /* 2. CONTENEDOR DE INFORMACIÓN CON FLEXBOX VERTICAL */
      .card-info {
        padding: 15px 20px 20px 20px;
        flex: 1; /* Ocupa todo el espacio restante */
        display: flex;
        flex-direction: column;
        justify-content: space-between; /* Distribuye el espacio de forma uniforme */
        box-sizing: border-box;
      }

      /* 3. TÍTULO BLOQUEADO A MÁXIMO 2 LÍNEAS */
      .product-title {
        font-size: 0.95rem;
        color: #0b1a20;
        margin: 0;
        font-weight: 800;
        line-height: 1.2;

        /* Fuerza exactamente 2 líneas máximo con '...' si es largo */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;

        /* Reserva la altura de 2 líneas incluso si el título es de 1 sola palabra */
        min-height: 2.4em;
      }

      .sizes-container {
        margin: 10px 0;
      }

      .sizes-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #000000;
        margin: 0 0 2px 0;
      }

      /* 4. TALLAS BLOQUEADAS A 1 LÍNEA */
      .sizes-numbers {
        font-size: 0.85rem;
        font-style: italic;
        color: #666;
        margin: 0;
        font-weight: 400;

        /* Mantiene 1 línea con puntos suspensivos si hay demasiadas tallas */
        white-space: wrap;
        text-overflow: ellipsis;
        height: 1.2em; /* Mantiene la altura fija si está vacío */
      }

      /* 5. BOTÓN SIEMPRE AL FONDO */
      .btn-wrapper {
        margin-top: auto; /* Empuja el botón al final de la tarjeta */
      }

      .btn-price {
        background-color: #bfebe6;
        color: #000;
        text-decoration: none;
        padding: 10px 25px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 0.9rem;
        display: inline-block;
        transition: background-color 0.3s ease;
        width: 100%; /* Botón uniforme en todas las tarjetas */
        box-sizing: border-box;
      }

      .btn-price:hover {
        background-color: #a4e4e0;
      }

      /* =========================================
         INDICADORES DE CARGA Y SCROLL
         ========================================= */
      .scroll-anchor {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
      }

      .loading-more,
      .initial-loading,
      .end-message {
        text-align: center;
        color: #666;
        font-weight: 600;
        font-size: 0.95rem;
      }
    `,
  ],
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild("scrollAnchor") scrollAnchor!: ElementRef;

  displayedProducts: Product[] = [];
  pageSize = 8;
  isLoading = false;
  hasMore = true;

  private lastDocSnapshot: QueryDocumentSnapshot<DocumentData> | null = null;
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.fetchPage();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
          this.fetchPage();
        }
      },
      { threshold: 0.1 },
    );

    if (this.scrollAnchor) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  getWhatsAppLink(productName: string): string {
    const message = `Hola, quiero saber el precio de este producto ${productName}`;
    return `https://wa.me/${environment.wspaNumber}?text=${encodeURIComponent(message)}`;
  }

  async fetchPage() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;

    try {
      const result = await this.productService.getProductsPage(
        this.pageSize,
        this.lastDocSnapshot,
      );

      const processed = result.products.map((p) => ({
        ...p,
        imageSrc: p.image
          ? this.bytesToUrl(p.image.bytes, p.image.type)
          : p.imageUrl,
      }));

      this.displayedProducts = [...this.displayedProducts, ...processed];

      this.lastDocSnapshot = result.lastDoc;
      this.hasMore = result.hasMore;
    } catch (error) {
      console.error("Error obteniendo productos de Firestore:", error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  bytesToUrl(bytes: number[] | Uint8Array, type: string) {
    const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    const arrayBuffer = new ArrayBuffer(uint8.byteLength);
    new Uint8Array(arrayBuffer).set(uint8);
    const blob = new Blob([arrayBuffer], { type });
    return URL.createObjectURL(blob);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
