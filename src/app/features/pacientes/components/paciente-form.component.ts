import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { STATUS_PACIENTE, type Paciente, type StatusPaciente } from '../../../models/paciente';

type PacienteForm = FormGroup<{
  nome: FormControl<string>;
  cpf: FormControl<string>;
  dataNascimento: FormControl<string>;
  status: FormControl<StatusPaciente>;
}>;

export function cpfValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value?.toString().replace(/\D/g, '') ?? '';

    if (!cpf) {
      return { cpfInvalido: true };
    }

    if (cpf.length !== 11) {
      return { cpfInvalido: true };
    }

    return null;
  };
}

function dataNascimentoNaoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { required: true };
    }

    const data = new Date(valor);
    const hoje = new Date();

    if (Number.isNaN(data.getTime())) {
      return { dataInvalida: true };
    }

    if (data > hoje) {
      return { dataNascimentoFutura: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="salvar()">
      <div>
        <label for="nome">Nome</label>
        <input id="nome" formControlName="nome" />

        @if (form.controls.nome.touched && form.controls.nome.invalid) {
          <small class="form-hint">
            @if (form.controls.nome.errors?.['required']) {
              Nome é obrigatório.
            } @else if (form.controls.nome.errors?.['minlength']) {
              Nome deve ter pelo menos 3 caracteres.
            }
          </small>
        }
      </div>

      <div>
        <label for="cpf">CPF</label>
        <input id="cpf" formControlName="cpf" />

        @if (form.controls.cpf.touched && form.controls.cpf.invalid) {
          <small>
            @if (form.controls.cpf.errors?.['cpfInvalido']) {
              CPF inválido.
            }
          </small>
        }
      </div>

      <div>
        <label for="dataNascimento">Data de nascimento</label>
        <input id="dataNascimento" type="date" formControlName="dataNascimento" />

        @if (form.controls.dataNascimento.touched && form.controls.dataNascimento.invalid) {
          <small>
            @if (form.controls.dataNascimento.errors?.['dataNascimentoFutura']) {
              Data de nascimento não pode ser futura.
            } @else if (form.controls.dataNascimento.errors?.['dataInvalida']) {
              Data inválida.
            }
          </small>
        }
      </div>

      <div>
        <label for="status">Status</label>
        <select id="status" formControlName="status">
          @for (status of STATUS_PACIENTE; track status) {
            <option [value]="status">{{ status }}</option>
          }
        </select>
      </div>

      <button type="submit" [disabled]="form.invalid || salvando()">
        {{ salvando() ? 'Enviando...' : 'Criar paciente' }}
      </button>
      @if (mensagem()) {
        <p class="success">{{ mensagem() }}</p>
      }
    </form>
  `,
})
export class PacienteFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pacienteService = inject(PacienteService);
  readonly STATUS_PACIENTE = STATUS_PACIENTE;
  readonly salvo = output<void>();
  readonly salvando = signal(false);
  readonly mensagem = signal<string | null>(null);

  readonly form: PacienteForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [cpfValido()]],
    dataNascimento: ['', [dataNascimentoNaoFutura()]],
    status: ['ATIVO' as StatusPaciente, Validators.required],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();
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
        this.form.reset({ nome: '', cpf: '', dataNascimento: '', status: 'ATIVO' });
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
