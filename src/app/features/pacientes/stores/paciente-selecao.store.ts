import { computed, signal } from '@angular/core';
import { Paciente } from '../../../models/paciente';

export class PacienteSelecaoStore {
  private readonly selecionadoState = signal<Paciente | null>(null);

  readonly selecionado = this.selecionadoState.asReadonly();
  readonly temSelecao = computed(() => this.selecionadoState() !== null);

  selecionar(paciente: Paciente): void {
    this.selecionadoState.set(paciente);
  }

  limpar(): void {
    this.selecionadoState.set(null);
  }
}
