import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../../../core/tokens/api-url.token';
import { PacienteService } from './paciente.service';

describe('PacienteService', () => {
  let service: PacienteService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PacienteService,
        { provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com/' },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PacienteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('busca todos os pacientes com GET e mapeia o retorno', () => {
    let resultado: unknown;

    service.buscarTodos().subscribe((pacientes) => (resultado = pacientes));

    const request = http.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, name: 'Leanne Graham' }]);

    expect(resultado).toEqual([
      expect.objectContaining({ id: '1', nome: 'Leanne Graham', ativo: true, status: 'ATIVO' }),
    ]);
  });

  it('busca um paciente pela URL com id', () => {
    let resultado: unknown;

    service.buscarPorId('7').subscribe((paciente) => (resultado = paciente));

    const request = http.expectOne('https://jsonplaceholder.typicode.com/users/7');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 7, name: 'Kurtis Weissnat' });

    expect(resultado).toEqual(expect.objectContaining({ id: '7', nome: 'Kurtis Weissnat' }));
  });
});
