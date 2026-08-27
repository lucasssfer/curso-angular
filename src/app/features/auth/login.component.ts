import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section>
      <h2>Login</h2>
      <button type="button" (click)="entrar()">Entrar</button>
      <a routerLink="/pacientes">Ir para pacientes</a>
    </section>
  `,
})
export class LoginComponent {
  entrar(): void {
    localStorage.setItem('token', 'fake-token');
    window.location.href = '/pacientes';
  }
}
