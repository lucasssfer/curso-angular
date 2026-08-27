import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pacientes',
    loadChildren: () =>
      import('./features/pacientes/paciente.routes').then((m) => m.pacienteRoutes),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/pacientes',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/pacientes',
  },
];
