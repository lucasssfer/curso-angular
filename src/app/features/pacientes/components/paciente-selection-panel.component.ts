import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PacienteSelecaoStore } from '../stores/paciente-selecao.store';

@Component({
  selector: 'app-paciente-selection-panel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="selection-panel">
      <p class="eyebrow">Seleção atual</p>
      @if (store.selecionado(); as paciente) {
        <h2>{{ paciente.nome }}</h2>
        <p>ID: {{ paciente.id }}</p>
        <p>Status: {{ paciente.status }}</p>
        <div class="panel-actions">
          <a [routerLink]="['/pacientes', paciente.id]">Abrir detalhes</a>
          <button type="button" class="text-button" (click)="store.limpar()">Limpar</button>
        </div>
      } @else {
        <p class="empty-selection">Selecione um paciente para ver um resumo aqui.</p>
      }
    </aside>
  `,
})
export class PacienteSelectionPanelComponent {
  readonly store = inject(PacienteSelecaoStore);
}
