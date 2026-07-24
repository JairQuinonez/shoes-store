# Karen's Shoes — Angular + Firebase + GitHub Pages

Sitio de catálogo de zapatos con panel de administración protegido por login.

## Estructura

- **Sitio público**: `/` (inicio) y `/catalogo` (productos, leídos en tiempo real desde Firestore)
- **Panel admin**: `/admin/login`, `/admin` (dashboard), `/admin/nuevo`, `/admin/editar/:id`
  - Protegido con `authGuard`: si no hay sesión de Firebase Auth, redirige a `/admin/login`

## 1. Requisitos

- Node.js 20+
- Cuenta gratuita en [Firebase](https://console.firebase.google.com)
- Cuenta en GitHub

## 2. Instalación local

```bash
npm install
npm start
```

Esto levanta el sitio en `http://localhost:4200`.

## 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com) → crea un proyecto nuevo (ej. `karen-shoes`).
2. **Firestore Database** → Crear base de datos → modo producción → elige una región.
3. **Authentication** → Sign-in method → habilita **Correo/contraseña**.
4. En Authentication → Users, crea manualmente el usuario que usarás para entrar al panel admin (tu email + contraseña).
5. En **Project settings → General → Tus apps**, agrega una app web y copia el objeto `firebaseConfig`.
6. Pega esos valores en:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`

### Reglas de seguridad de Firestore (recomendadas)

En Firestore → Reglas, usa algo como esto para que cualquiera pueda **leer** el catálogo pero solo usuarios autenticados puedan **escribir**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Publicar en GitHub Pages

### Opción A: automático con GitHub Actions (recomendado)

1. Crea un repositorio en GitHub llamado, por ejemplo, `karen-shoes`.
2. Sube este proyecto:
   ```bash
   git init
   git add .
   git commit -m "Proyecto inicial Karen's Shoes"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/karen-shoes.git
   git push -u origin main
   ```
3. En GitHub → Settings → Pages → Source: selecciona **gh-pages branch** (la crea automáticamente el workflow la primera vez que corre).
4. Cada `push` a `main` reconstruye y publica el sitio automáticamente (ver `.github/workflows/deploy.yml`).
5. Tu sitio quedará en: `https://TU_USUARIO.github.io/karen-shoes/`

> Importante: si tu repo tiene otro nombre, cambia `/karen-shoes/` por `/TU_REPO/` en `.github/workflows/deploy.yml` y en el script `deploy` de `package.json`.

### Opción B: manual desde tu máquina

```bash
npm run deploy
```

Esto compila y publica usando `angular-cli-ghpages` directo a la rama `gh-pages`.

## 5. Sobre la "otra URL" del admin

El panel admin vive en el mismo proyecto Angular pero en rutas distintas (`/admin/...`), protegidas con login. Así, al publicar en GitHub Pages, tendrás:

- Sitio público: `https://TU_USUARIO.github.io/karen-shoes/`
- Panel admin: `https://TU_USUARIO.github.io/karen-shoes/admin/login`

Si más adelante prefieres que el admin tenga un **dominio o subdominio totalmente separado**, se puede migrar a un segundo proyecto Angular que comparta los mismos `services/` y el mismo proyecto de Firebase — avísame y lo armamos así.

## 6. Próximos pasos sugeridos

- Agregar validaciones más estrictas al formulario de producto.
- Subir imágenes directamente a Firebase Storage en vez de pegar URLs.
- Agregar filtro/búsqueda en el catálogo público.
