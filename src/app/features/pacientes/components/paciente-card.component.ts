import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Paciente } from '../../../models/paciente';
import { CpCpfPipe } from '../../../shared/pipes/cp-cpf.pipe';
import { PacienteSelecaoStore } from '../stores/paciente-selecao.store';

@Component({
  selector: 'app-paciente-card',
  standalone: true,
  imports: [DatePipe, CpCpfPipe, RouterLink],
  template: `
    <article class="paciente-card">
      <h3>{{ paciente().nome }}</h3>
      <p><strong>CPF:</strong> {{ paciente().cpf | cpCpf }}</p>
      <p><strong>Nascimento:</strong> {{ paciente().dataNascimento | date: 'dd/MM/yyyy' }}</p>
      <div class="card-actions">
        <button type="button" class="select-button" (click)="selecionar()">Selecionar</button>
        <a [routerLink]="['/pacientes', paciente().id]">Abrir detalhes</a>
      </div>
    </article>
  `,
})
export class PacienteCardComponent {
  private readonly selecaoStore = inject(PacienteSelecaoStore);
  paciente = input.required<Paciente>();

  selecionar(): void {
    this.selecaoStore.selecionar(this.paciente());
  }
}

