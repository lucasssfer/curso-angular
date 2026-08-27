import { computed, inject, signal } from '@angular/core';
import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../services/paciente.service';

export class PacienteListStore {
  private readonly pacienteService = inject(PacienteService);
  private readonly pacientesState = signal<Paciente[]>([]);
  private readonly carregandoState = signal(false);
  private readonly erroState = signal<string | null>(null);

  readonly pacientes = this.pacientesState.asReadonly();
  readonly carregando = this.carregandoState.asReadonly();
  readonly erro = this.erroState.asReadonly();
  readonly totalAtivos = computed(() => this.pacientesState().filter((paciente) => paciente.ativo).length);
  readonly totalInativos = computed(() => this.pacientesState().filter((paciente) => !paciente.ativo).length);

  carregar(): void {
    this.carregandoState.set(true);
    this.erroState.set(null);

    this.pacienteService.buscarTodos().subscribe({
      next: (pacientes) => this.pacientesState.set(pacientes),
      error: () => {
        this.erroState.set('Erro ao carregar pacientes.');
        this.carregandoState.set(false);
      },
      complete: () => this.carregandoState.set(false),
    });
  }

  marcarInativo(id: string): void {
    this.pacientesState.update((pacientes) =>
      pacientes.map((paciente) =>
        paciente.id === id
          ? { ...paciente, ativo: false, status: 'INATIVO' }
          : paciente
      )
    );
  }
}
