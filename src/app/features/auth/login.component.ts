import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

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
  private router = inject(Router);
  private auth = inject(AuthService);

  entrar(): void {
    this.auth.login('fake-token');
    this.router.navigate(['/pacientes']);
  }
}
