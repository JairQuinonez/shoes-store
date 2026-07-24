import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/login/login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'admin/nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: 'admin/editar/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  { path: '**', redirectTo: '' },
];
