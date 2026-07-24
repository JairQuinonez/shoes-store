import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <!-- CABECERA Y MARCA -->
        <div class="brand-header">
          <div class="logo-badge">👠</div>
          <h1>Karen's Shoes</h1>
          <span class="subtitle">Panel Administrador</span>
        </div>

        <!-- FORMULARIO DE ACCESO -->
        <form class="login-form" (ngSubmit)="onSubmit()">
          <!-- CORREO -->
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-box">
              <span class="icon">✉️</span>
              <input
                id="email"
                type="email"
                name="email"
                [(ngModel)]="email"
                placeholder="admin@karensshoes.com"
                required
              />
            </div>
          </div>

          <!-- CONTRASEÑA -->
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-box">
              <span class="icon">🔒</span>
              <input
                id="password"
                type="password"
                name="password"
                [(ngModel)]="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <!-- MENSAJE DE ERROR -->
          <div class="error-banner" *ngIf="error">
            <span>⚠️ {{ error }}</span>
          </div>

          <!-- BOTÓN INGRESO -->
          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Iniciar sesión →</span>
            <span *ngIf="loading" class="loading-state">
              <span class="spinner"></span> Validando...
            </span>
          </button>

          <!-- REGRESO A LA TIENDA -->
          <a routerLink="/" class="back-link">← Volver al sitio público</a>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* =========================================
         LAYOUT Y CONTENEDOR PRINCIPAL
         ========================================= */
      .login-wrapper {
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
          160deg,
          #fbf7f8 0%,
          #eaf3f5 50%,
          #f5eff2 100%
        );
        padding: 20px;
        box-sizing: border-box;
      }

      .login-card {
        background: #ffffff;
        width: 100%;
        max-width: 420px;
        padding: 40px 32px;
        border-radius: 28px;
        box-shadow: 0 20px 40px rgba(11, 26, 32, 0.08);
        border: 1px solid #f1f5f9;
      }

      /* =========================================
         CABECERA / MARCA
         ========================================= */
      .brand-header {
        text-align: center;
        margin-bottom: 32px;
      }

      .logo-badge {
        width: 56px;
        height: 56px;
        background: #0b1a20;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        margin: 0 auto 12px auto;
        box-shadow: 0 8px 20px rgba(11, 26, 32, 0.15);
      }

      .brand-header h1 {
        font-size: 1.6rem;
        font-weight: 800;
        color: #0b1a20;
        margin: 0 0 4px 0;
      }

      .subtitle {
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* =========================================
         FORMULARIO Y CAMPOS
         ========================================= */
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        font-size: 0.88rem;
        font-weight: 700;
        color: #334155;
      }

      .input-box {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-box .icon {
        position: absolute;
        left: 14px;
        font-size: 1rem;
        pointer-events: none;
      }

      .input-box input {
        width: 100%;
        padding: 13px 14px 13px 44px;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        font-size: 0.95rem;
        background: #f8fafc;
        color: #0f172a;
        transition: all 0.25s ease;
        box-sizing: border-box;
      }

      .input-box input:focus {
        outline: none;
        border-color: #0b1a20;
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(191, 235, 230, 0.4);
      }

      /* =========================================
         ALERTAS DE ERROR
         ========================================= */
      .error-banner {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 0.88rem;
        font-weight: 600;
        text-align: center;
      }

      /* =========================================
         BOTÓN Y ENLACES
         ========================================= */
      .btn-submit {
        background: #0b1a20;
        color: #ffffff;
        border: none;
        padding: 14px;
        border-radius: 30px;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 8px;
        box-shadow: 0 6px 20px rgba(11, 26, 32, 0.15);
      }

      .btn-submit:hover:not(:disabled) {
        background: #172e38;
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(11, 26, 32, 0.25);
      }

      .btn-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .back-link {
        text-align: center;
        color: #64748b;
        text-decoration: none;
        font-size: 0.88rem;
        font-weight: 600;
        margin-top: 10px;
        transition: color 0.2s ease;
      }

      .back-link:hover {
        color: #0b1a20;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';

  async onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch (e) {
      this.error = 'Credenciales incorrectas. Verifica tus datos.';
    } finally {
      this.loading = false;
    }
  }
}