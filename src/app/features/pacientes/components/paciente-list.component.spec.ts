import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Paciente } from '../../../models/paciente';
import { PacienteService } from '../services/paciente.service';
import { PacienteListStore } from '../stores/paciente-list.store';
import { PacienteListComponent } from './paciente-list.component';

const pacientesDoComponente: Paciente[] = [
  {
    id: '1',
    nome: 'Maria Souza',
    cpf: '12345678901',
    dataNascimento: new Date('1985-03-12'),
    ativo: true,
    status: 'ATIVO',
  },
];

class PacienteServiceComponentMock {
  chamadasBuscarTodos = 0;

  buscarTodos(): Observable<Paciente[]> {
    this.chamadasBuscarTodos++;
    return of(pacientesDoComponente);
  }
}

describe('PacienteListComponent', () => {
  it('chama buscarTodos no início e preenche pacientes()', () => {
    TestBed.configureTestingModule({
      imports: [PacienteListComponent],
      providers: [
        provideRouter([]),
        { provide: PacienteService, useClass: PacienteServiceComponentMock },
      ],
    });

    const fixture = TestBed.createComponent(PacienteListComponent);
    fixture.detectChanges();
    const store = fixture.debugElement.injector.get(PacienteListStore);
    const service = TestBed.inject(PacienteService) as unknown as PacienteServiceComponentMock;

    expect(service.chamadasBuscarTodos).toBe(1);
    expect(store.pacientes()).toEqual(pacientesDoComponente);
  });
});
