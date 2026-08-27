import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../services/paciente.service';
import { PacienteListStore } from './paciente-list.store';

const pacientesDeTeste: Paciente[] = [
  { id: '1', nome: 'Ativo', cpf: '12345678901', dataNascimento: new Date('1990-01-01'), ativo: true, status: 'ATIVO' },
  { id: '2', nome: 'Inativo', cpf: '12345678902', dataNascimento: new Date('1991-01-01'), ativo: false, status: 'INATIVO' },
];

class PacienteServiceMock {
  chamadasBuscarTodos = 0;

  buscarTodos(): Observable<Paciente[]> {
    this.chamadasBuscarTodos++;
    return of(pacientesDeTeste);
  }
}

describe('PacienteListStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PacienteListStore, { provide: PacienteService, useClass: PacienteServiceMock }],
    });
  });

  it('carrega pacientes e calcula totalAtivos', () => {
    const store = TestBed.inject(PacienteListStore);
    const service = TestBed.inject(PacienteService) as unknown as PacienteServiceMock;

    store.carregar();

    expect(service.chamadasBuscarTodos).toBe(1);
    expect(store.pacientes()).toEqual(pacientesDeTeste);
    expect(store.totalAtivos()).toBe(1);
  });

  it('calcula totalInativos', () => {
    const store = TestBed.inject(PacienteListStore);
    store.carregar();

    expect(store.totalInativos()).toBe(1);
  });
});