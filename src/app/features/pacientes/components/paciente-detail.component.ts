import { DatePipe } from '@angular/common';
import { Component, effect, input, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../services/paciente.service';

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section>
      <a class="back-link" routerLink="/pacientes">Voltar para pacientes</a>
      @if (paciente()) {
        <h2>{{ paciente()?.nome }}</h2>
        <p>ID: {{ paciente()?.id }}</p>
        <p>Status: <strong>{{ paciente()?.status }}</strong></p>
        <p>CPF: {{ paciente()?.cpf }}</p>
        <p>Nascimento: {{ paciente()?.dataNascimento | date: 'dd/MM/yyyy' }}</p>
      } @else {
        @if (erro()) { <p class="error">{{ erro() }}</p> } @else { <p>Carregando paciente...</p> }
      }
    </section>
  `,
})
export class PacienteDetailComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly pacienteService = inject(PacienteService);
  readonly id = input.required<string>();
  readonly paciente = signal<Paciente | null>(null);
  readonly erro = signal<string | null>(null);

  constructor() {
    effect(() => {
      const pacienteId = this.id();
      this.pacienteService.buscarPorId(pacienteId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (paciente) => this.paciente.set(paciente),
          error: () => this.erro.set('Não foi possível carregar este paciente.'),
        });
    });
  }
}
