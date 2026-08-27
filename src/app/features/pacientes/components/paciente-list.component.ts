import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../services/paciente.service';
import { PacienteListStore } from '../stores/paciente-list.store';
import { PacienteSelecaoStore } from '../stores/paciente-selecao.store';
import { PacienteCardComponent } from './paciente-card.component';
import { PacienteFormComponent } from './paciente-form.component';
import { PacienteFormSignalComponent } from './paciente-form-signal.component';
import { PacienteSelectionPanelComponent } from './paciente-selection-panel.component';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    FormsModule,
    PacienteCardComponent,
    PacienteFormComponent,
    PacienteFormSignalComponent,
    PacienteSelectionPanelComponent,
  ],
  providers: [PacienteListStore, PacienteSelecaoStore],
  template: `
    <section class="paciente-list">
      <header class="page-header">
        <div>
          <p class="eyebrow">Care Plus</p>
          <h1>Pacientes</h1>
          <p class="intro">Dados carregados diretamente da API de teste.</p>
        </div>
        <div class="header-actions">
          <span class="active-count">{{ listStore.totalAtivos() }} ativos</span>
          <button type="button" class="refresh-button" (click)="recarregar()">
            Atualizar lista
          </button>
        </div>
      </header>

      <div class="toolbar">
        <label for="filtro">Buscar paciente</label>
        <input
          id="filtro"
          type="text"
          [ngModel]="filtro()"
          (ngModelChange)="onFiltroChange($event)"
          placeholder="Buscar por nome ou CPF"
        />
        <div class="api-actions">
          <button type="button" (click)="testarBuscarPorId()">Testar busca por ID</button>
          <button type="button" (click)="testarAtualizacao()">Testar atualização</button>
          <button type="button" class="danger-button" (click)="testarRemocao()">
            Testar remoção
          </button>
        </div>
        @if (resultadoApi()) {
          <p class="success">{{ resultadoApi() }}</p>
        }
      </div>

      @if (listStore.carregando()) {
        <p>Carregando...</p>
      } @else if (pacientesFiltrados().length === 0) {
        <p>Nenhum paciente encontrado.</p>
      } @else {
        @for (paciente of pacientesFiltrados(); track paciente.id) {
          <div class="paciente-item">
            @switch (paciente.status) {
              @case ('ATIVO') {
                <span class="status status-ativo">ATIVO</span>
              }
              @case ('INATIVO') {
                <span class="status status-inativo">INATIVO</span>
              }
              @default {
                <span class="status status-pendente">PENDENTE</span>
              }
            }

            <app-paciente-card [paciente]="paciente" />
            @if (paciente.ativo) {
              <button type="button" class="inactive-button" (click)="marcarInativo(paciente.id)">
                Marcar inativo
              </button>
            }
          </div>
        }
      }

      @if (listStore.erro()) {
        <p class="error">{{ listStore.erro() }}</p>
      }
    </section>

    <app-paciente-selection-panel />

    <section class="forms-grid">
      <app-paciente-form (salvo)="recarregar()" />
      <app-paciente-form-signal (salvo)="recarregar()" />
    </section>
  `,
})
export class PacienteListComponent {
  readonly listStore = inject(PacienteListStore);
  private readonly pacienteService = inject(PacienteService);
  readonly filtro = signal('');
  readonly resultadoApi = signal<string | null>(null);
  readonly pacientesFiltrados = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    return this.listStore
      .pacientes()
      .filter((paciente) => `${paciente.nome} ${paciente.cpf}`.toLowerCase().includes(texto));
  });

  constructor() {
    this.listStore.carregar();
  }

  onFiltroChange(valor: string): void {
    this.filtro.set(valor);
  }

  recarregar(): void {
    this.listStore.carregar();
  }

  testarBuscarPorId(): void {
    this.pacienteService.buscarPorId('1').subscribe({
      next: (paciente) => this.resultadoApi.set(`Busca por ID concluída: ${paciente.nome}`),
      error: () => this.resultadoApi.set('Não foi possível buscar o paciente 1.'),
    });
  }

  testarAtualizacao(): void {
    const paciente: Paciente = {
      id: '1',
      nome: 'Usuário atualizado',
      cpf: '00000000001',
      dataNascimento: new Date('1990-01-01'),
      ativo: true,
      status: 'ATIVO',
    };

    this.pacienteService.atualizar('1', paciente).subscribe({
      next: (atualizado) => {
        this.resultadoApi.set(`Atualização concluída: ${atualizado.nome}`);
        this.recarregar();
      },
      error: () => this.resultadoApi.set('Não foi possível atualizar o paciente 1.'),
    });
  }

  testarRemocao(): void {
    this.pacienteService.remover('1').subscribe({
      next: () => {
        this.resultadoApi.set('Remoção concluída para o paciente 1.');
        this.recarregar();
      },
      error: () => this.resultadoApi.set('Não foi possível remover o paciente 1.'),
    });
  }

  marcarInativo(id: string): void {
    this.listStore.marcarInativo(id);
  }
}
