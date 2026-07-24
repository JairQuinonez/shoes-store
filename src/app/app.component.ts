import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- HEADER FLOTANTE TIPO PÍLDORA (Se oculta en el login) -->
    <header class="floating-header" *ngIf="showNavbar">
      <nav class="pill-nav">
        <!-- 1. ÍCONO / LOGO CIRCULAR (Izquierda) -->
        <div>
          <a routerLink="/" class="logo-badge" title="Karen's Shoes">
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=100&q=80"
              alt="Logo"
            />
            <span>Karen's Shoes</span>
          </a>
        </div>

        <!-- 2. ENLACES PRINCIPALES (Centro) -->
        <div class="nav-links">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Inicio</a
          >
          <a routerLink="/catalogo" routerLinkActive="active">Catálogo</a>
        </div>

        <!-- 3. BOTÓN DESTACADO (Derecha) -->
        <a
          [href]="getWhatsAppLink()"
          target="_blank"
          class="cta-pill"
        >
          Contacto
        </a>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- FOOTER (Se oculta en el login) -->
    <footer class="site-footer" *ngIf="showNavbar">
      <div class="container">
        <p>&copy; {{ year }} Karen's Shoes. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [
    `
      /* =========================================
       HEADER Y NAVBAR FLOTANTE
       ========================================= */
      .floating-header {
        position: fixed;
        top: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        z-index: 1000;
        pointer-events: none; /* Permite hacer clic en el fondo fuera de la barra */
      }

      .pill-nav {
        pointer-events: auto; /* Reactiva clics dentro de la cápsula */
        background: #18181b; /* Negro antracita elegante */
        padding: 6px 8px 6px 8px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 28px;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(10px);
        width: min(92vw, 760px);
        justify-content: space-between;
      }

      /* Badge circular del Logo */
      .logo-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 4px 12px 4px 4px;
        border-radius: 999px;
        color: #ffff;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.82rem;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
      }

      .logo-badge:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.26);
      }

      .logo-badge img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .logo-badge span {
        white-space: nowrap;
      }

      /* Enlaces centrales */
      .nav-links {
        display: flex;
        align-items: center;
        gap: 22px;
      }

      .nav-links a {
        color: #a1a1aa;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .nav-links a:hover {
        color: #ffffff;
      }

      .nav-links a.active {
        color: #ffffff;
        font-weight: 600;
      }

      /* Botón redondeado de la derecha */
      .cta-pill {
        background: #ffffff;
        color: #18181b;
        text-decoration: none;
        padding: 8px 22px;
        border-radius: 30px;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .cta-pill:hover {
        background: #f4f4f5;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.25);
      }

      /* =========================================
       ESTILOS GLOBALES BASE
       ========================================= */
      main {
        min-height: 80vh;
      }

      .site-footer {
        background: #121212;
        color: #888;
        padding: 20px 0;
        text-align: center;
        font-size: 0.85rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      /* Adaptabilidad a pantallas pequeñas */
      @media (max-width: 500px) {
        .floating-header {
          top: 12px;
        }
        .pill-nav {
          gap: 14px;
          padding: 5px 6px;
        }
        .nav-links {
          gap: 12px;
        }
        .nav-links a {
          font-size: 0.8rem;
        }
        .cta-pill {
          padding: 6px 14px;
          font-size: 0.78rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  private router = inject(Router);

  year = new Date().getFullYear();
  showNavbar = true;

  constructor() {
    // Escucha el cambio de navegación para ocultar el header/footer en la ruta de login
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Oculta la barra cuando la URL incluya '/admin/login'
        this.showNavbar = !event.urlAfterRedirects.includes('/admin/login');
      });
  }

  getWhatsAppLink(): string {
    const message = `Hola, quiero saber el precio de los productos`;
    return `https://wa.me/${environment.wspaNumber}?text=${encodeURIComponent(message)}`;
  }
}