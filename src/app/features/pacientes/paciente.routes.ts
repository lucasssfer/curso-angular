import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const pacienteRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/paciente-list.component').then((m) => m.PacienteListComponent),
    canActivate: [authGuard],
  },
  {
    path: ':id',
    loadComponent: () => import('./components/paciente-detail.component').then((m) => m.PacienteDetailComponent),
    canActivate: [authGuard],
  },
];
