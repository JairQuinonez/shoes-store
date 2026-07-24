import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- SECCIÓN 1: HERO (Imagen 1) -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <!-- Oscurece un poco el fondo para que el texto resalte -->

      <div class="hero-content">
        <h1>CALZADO PARA<br />TODOS</h1>
        <p class="hero-subtitle">
          Estilo, tendencia y la comodidad que tus pasos merecen.
        </p>

        <div class="hero-buttons">
          <a routerLink="/catalogo" class="btn btn-white">Ir a catálogo</a>
          <!-- Cambia el link del href por tu link real de WhatsApp -->
        </div>
      </div>
    </section>

    <section class="features">
      <div class="features-container">
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Calidad Premium</h3>
          <p>
            Seleccionamos cuidadosamente cada modelo garantizando acabados
            impecables.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🚚</div>
          <h3>Envíos Garantizados</h3>
          <p>Llegamos a la puerta de tu casa de forma rápida y 100% segura.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Asesoría por WhatsApp</h3>
          <p>
            ¿Dudas con tu talla? Te atendemos de inmediato para ayudarte a
            elegir.
          </p>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 2: FOOTER / WHATSAPP CTA (Imagen 2) -->
    <section class="whatsapp-cta">
      <div class="wa-text-container">
        <h2>
          Pregunta por nuestros<br />productos por <br /><span class="highlight"
            >Whatsapp</span
          >
        </h2>
      </div>

      <div class="wa-collage">
        <!-- Reemplaza los 'src' con las URLs de tus imágenes reales -->
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80"
          alt="Zapato 1"
          class="c-img c-img-1"
        />
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=300&q=80"
          alt="Zapato 2"
          class="c-img c-img-2"
        />
        <img
          src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=300&q=80"
          alt="Zapato 3"
          class="c-img c-img-3"
        />
        <img
          src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=300&q=80"
          alt="Zapato 4"
          class="c-img c-img-4"
        />
        <img
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80"
          alt="Zapato 5"
          class="c-img c-img-5"
        />
      </div>
    </section>
  `,
  styles: [
    `
      /* =========================================
       SECCIÓN 1: HERO
       ========================================= */
      .hero {
        position: relative;
        height: 90vh; /* Ocupa casi toda la pantalla */
        min-height: 600px;
        /* AQUÍ PONES TU IMAGEN DE FONDO REAL */
        background-image: url("https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1920&q=80");
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        padding: 0 10%; /* Espaciado lateral */
        margin-top: -80px; /* Sube la sección por si tu navbar tiene fondo transparente */
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.2); /* Sombra sutil */
        z-index: 1;
      }

      .hero-content {
        position: relative;
        z-index: 2; /* Asegura que el texto esté por encima de la sombra */
        color: white;
      }

      .hero-subtitle {
        font-size: 1.15rem;
        opacity: 0.9;
        margin-bottom: 35px;
        font-weight: 300;
      }

      .logo-text {
        font-size: 1.2rem;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 40px;
      }

      .hero-content h1 {
        font-size: 4.5rem;
        font-weight: 400;
        line-height: 1.1;
        margin-bottom: 40px;
        letter-spacing: 1px;
      }

      .hero-buttons {
        display: flex;
        gap: 20px; /* Espacio entre los botones */
      }

      .btn-white {
        background: white;
        color: #000;
        text-decoration: none;
        padding: 12px 35px;
        border-radius: 30px; /* Botones redondeados tipo píldora */
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .btn-white:hover {
        background: #f0f0f0;
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      /* =========================================
       SECCIÓN 2: BENEFICIOS (NUEVA SECCIÓN)
       ========================================= */
      .features {
        background: #faf8f5; /* Tono crema suave y elegante */
        padding: 70px 10%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      }

      .features-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        text-align: center;
      }

      .feature-card {
        background: white;
        padding: 35px 25px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
        transition: transform 0.3s ease;
      }

      .feature-card:hover {
        transform: translateY(-7px);
        background: #bed4e5;
      }

      .feature-icon {
        font-size: 2.2rem;
        margin-bottom: 15px;
      }

      .feature-card h3 {
        font-size: 1.2rem;
        color: #1a1a1a;
        margin-bottom: 10px;
        font-weight: 700;
      }

      .feature-card p {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.5;
        margin: 0;
      }

      /* =========================================
       SECCIÓN 2: FOOTER / WHATSAPP CTA
       ========================================= */
      .whatsapp-cta {
        /* Gradiente de celeste a rosa suave */
        background: linear-gradient(135deg, #a4ebd8 0%, #f6d1e4 100%);
        padding: 100px 10%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden; /* Evita que el collage ensanche la página */
      }

      .wa-text-container h2 {
        font-size: 3rem;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 1.2;
      }

      .highlight {
        color: #25d366; /* Verde exacto de WhatsApp */
        text-decoration: underline;
        text-underline-offset: 8px; /* Separa un poco la línea de la letra */
        text-decoration-thickness: 3px;
      }

      /* EL COLLAGE DE IMÁGENES */
      .wa-collage {
        position: relative;
        width: 600px;
        height: 400px;
      }

      .c-img {
        position: absolute;
        width: 180px;
        height: 180px;
        object-fit: cover;
        border-radius: 30px; /* Bordes redondeados gruesos */
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        transition:
          transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
          z-index 0.4s;
        cursor: pointer;
      }

      /* Posicionamiento y rotación para imitar la Imagen 2 */
      .c-img-1 {
        top: 10%;
        left: 0%;
        transform: rotate(-10deg);
        z-index: 1;
      }
      .c-img-2 {
        top: 45%;
        left: 15%;
        transform: rotate(15deg);
        z-index: 2;
      }
      .c-img-3 {
        top: 0%;
        left: 40%;
        transform: rotate(-5deg);
        z-index: 1;
      }
      .c-img-4 {
        top: 55%;
        left: 55%;
        transform: rotate(20deg);
        z-index: 3;
      }
      .c-img-5 {
        top: 10%;
        left: 75%;
        transform: rotate(-12deg);
        z-index: 2;
      }

      /* Efecto al pasar el ratón por el collage */
      .c-img:hover {
        transform: scale(1.15) rotate(0deg);
        z-index: 10;
      }

      /* =========================================
       RESPONSIVE DESIGN (MÓVILES)
       ========================================= */
      @media (max-width: 992px) {
        .hero-content h1 {
          font-size: 3.5rem;
        }

        .whatsapp-cta {
          flex-direction: column;
          text-align: center;
          padding: 60px 5%;
        }

        .wa-text-container {
          margin-bottom: 60px;
        }
        .wa-text-container h2 {
          font-size: 2.5rem;
        }

        .wa-collage {
          width: 100%;
          max-width: 400px;
          height: 350px;
        }

        .c-img {
          width: 140px;
          height: 140px;
        }

        .c-img-1 {
          top: 0%;
          left: 0%;
        }
        .c-img-2 {
          top: 50%;
          left: 10%;
        }
        .c-img-3 {
          top: 10%;
          left: 35%;
        }
        .c-img-4 {
          top: 60%;
          left: 50%;
        }
        .c-img-5 {
          top: 20%;
          left: 65%;
        }
      }

      @media (max-width: 576px) {
        .hero-content h1 {
          font-size: 2.8rem;
        }
        .hero-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent {}
