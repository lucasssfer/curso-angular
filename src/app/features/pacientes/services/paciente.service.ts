import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { Paciente } from '../../../models/paciente';

type JsonPlaceholderUser = {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
};

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL).replace(/\/+$/, '');

  buscarTodos(): Observable<Paciente[]> {
    return this.http.get<JsonPlaceholderUser[]>(`${this.apiUrl}/users`).pipe(
      map((usuarios) => usuarios.map((usuario) => this.mapToPaciente(usuario)))
    );
  }

  buscarPorId(id: string): Observable<Paciente> {
    return this.http.get<JsonPlaceholderUser>(`${this.apiUrl}/users/${id}`).pipe(
      map((usuario) => this.mapToPaciente(usuario))
    );
  }

  criar(paciente: Paciente): Observable<Paciente> {
    return this.http.post<JsonPlaceholderUser>(`${this.apiUrl}/users`, this.fromPacienteToJsonPlaceholder(paciente)).pipe(
      map((usuario) => this.mapToPaciente(usuario))
    );
  }

  atualizar(id: string, paciente: Paciente): Observable<Paciente> {
    return this.http.put<JsonPlaceholderUser>(`${this.apiUrl}/users/${id}`, this.fromPacienteToJsonPlaceholder(paciente)).pipe(
      map((usuario) => this.mapToPaciente(usuario))
    );
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  private mapToPaciente(usuario: JsonPlaceholderUser): Paciente {
    return {
      id: String(usuario.id),
      nome: usuario.name ?? usuario.username ?? `Usuário ${usuario.id}`,
      cpf: this.fakeCpf(usuario.id),
      dataNascimento: new Date(1990, 0, 1),
      ativo: true,
      status: 'ATIVO',
    };
  }

  private fromPacienteToJsonPlaceholder(paciente: Paciente): Partial<JsonPlaceholderUser> {
    return {
      id: Number(paciente.id),
      name: paciente.nome,
      username: paciente.nome,
      email: `${paciente.nome.toLowerCase().replace(/\s+/g, '.')}@mail.com`,
    };
  }

  private fakeCpf(id: number): string {
    return `${String(id).padStart(11, '0')}`.slice(0, 11);
  }
}
