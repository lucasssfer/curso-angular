import { Component, computed, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { STATUS_PACIENTE, type Paciente, type StatusPaciente } from '../../../models/paciente';

interface PacienteSignalForm {
  nome: string;
  cpf: string;
  dataNascimento: string;
  status: StatusPaciente;
}

@Component({
  selector: 'app-paciente-form-signal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <h3>Signal Forms</h3>

      <form (ngSubmit)="salvar()">
        <div>
          <label for="nome-signal">Nome</label>
          <input
            id="nome-signal"
            [value]="form().nome"
            (input)="atualizarCampo('nome', $any($event.target).value)"
          />

          @if (touched().nome && nomeInvalido()) {
            <small>Nome deve ter pelo menos 3 caracteres.</small>
          }
        </div>

        <div>
          <label for="cpf-signal">CPF</label>
          <input
            id="cpf-signal"
            [value]="form().cpf"
            (input)="atualizarCampo('cpf', $any($event.target).value)"
          />

          @if (touched().cpf && cpfInvalido()) {
            <small>CPF inválido.</small>
          }
        </div>

        <div>
          <label for="dataNascimento-signal">Data de nascimento</label>
          <input
            id="dataNascimento-signal"
            type="date"
            [value]="form().dataNascimento"
            (input)="atualizarCampo('dataNascimento', $any($event.target).value)"
          />

          @if (touched().dataNascimento && dataNascimentoInvalida()) {
            <small>Data inválida ou futura.</small>
          }
        </div>

        <div>
          <label for="status-signal">Status</label>
          <select
            id="status-signal"
            [value]="form().status"
            (change)="atualizarCampo('status', $any($event.target).value)"
          >
            @for (status of STATUS_PACIENTE; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>

        <button type="submit" [disabled]="formInvalido() || salvando()">
          {{ salvando() ? 'Enviando...' : 'Criar com signals' }}
        </button>
        @if (mensagem()) {
          <p class="success">{{ mensagem() }}</p>
        }
      </form>
    </section>
  `,
})
export class PacienteFormSignalComponent {
  private readonly pacienteService = inject(PacienteService);
  readonly STATUS_PACIENTE = STATUS_PACIENTE;
  readonly salvo = output<void>();
  readonly salvando = signal(false);
  readonly mensagem = signal<string | null>(null);

  readonly form = signal<PacienteSignalForm>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    status: 'ATIVO',
  });

  readonly touched = signal({
    nome: false,
    cpf: false,
    dataNascimento: false,
  });

  readonly nomeInvalido = computed(
    () => this.form().nome.trim().length < 3 && this.form().nome.length > 0,
  );
  readonly cpfInvalido = computed(() => {
    const cpf = this.form().cpf.replace(/\D/g, '');
    return cpf.length !== 11 && cpf.length > 0;
  });
  readonly dataNascimentoInvalida = computed(() => {
    const valor = this.form().dataNascimento;
    if (!valor) {
      return true;
    }

    const data = new Date(valor);
    const hoje = new Date();

    return Number.isNaN(data.getTime()) || data > hoje;
  });

  readonly formInvalido = computed(() => {
    return (
      this.form().nome.trim().length < 3 || this.cpfInvalido() || this.dataNascimentoInvalida()
    );
  });

  atualizarCampo(chave: keyof PacienteSignalForm, valor: string): void {
    this.form.update((estado) => ({
      ...estado,
      [chave]: chave === 'status' ? (valor as StatusPaciente) : valor,
    }));

    if (chave === 'nome') {
      this.touched.update((estado) => ({ ...estado, nome: true }));
    }

    if (chave === 'cpf') {
      this.touched.update((estado) => ({ ...estado, cpf: true }));
    }

    if (chave === 'dataNascimento') {
      this.touched.update((estado) => ({ ...estado, dataNascimento: true }));
    }
  }

  salvar(): void {
    this.touched.set({
      nome: true,
      cpf: true,
      dataNascimento: true,
    });

    if (this.formInvalido()) {
      return;
    }

    const dados = this.form();
    const payload: Paciente = {
      id: '0',
      nome: dados.nome,
      cpf: dados.cpf,
      dataNascimento: new Date(`${dados.dataNascimento}T00:00:00`),
      ativo: true,
      status: dados.status,
    };
    this.salvando.set(true);
    this.mensagem.set(null);

    this.pacienteService.criar(payload).subscribe({
      next: () => {
        this.mensagem.set('Paciente criado com sucesso.');
        this.form.set({ nome: '', cpf: '', dataNascimento: '', status: 'ATIVO' });
        this.touched.set({ nome: false, cpf: false, dataNascimento: false });
        this.salvo.emit();
      },
      error: () => {
        this.mensagem.set('Não foi possível criar o paciente.');
        this.salvando.set(false);
      },
      complete: () => this.salvando.set(false),
    });
  }
}
