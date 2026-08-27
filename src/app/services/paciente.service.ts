import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  private readonly pacientes: Paciente[] = [
    {
      id: '1',
      nome: 'Maria Silva',
      cpf: '12345678901',
      dataNascimento: new Date(1985, 4, 12),
      ativo: true,
      status: 'ATIVO',
    },
    {
      id: '2',
      nome: 'Joao Santos',
      cpf: '98765432100',
      dataNascimento: new Date(1978, 9, 3),
      ativo: true,
      status: 'PENDENTE',
    },
  ];

  buscarPorId(id: string): Paciente | undefined {
    return this.pacientes.find((paciente) => paciente.id === id);
  }
}
