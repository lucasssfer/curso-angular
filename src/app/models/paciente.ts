export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
  ativo: boolean;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
}

export function obterNomePaciente(paciente: Paciente | undefined): string {
  if (!paciente) {
    return 'Desconhecido';
  }

  return paciente.nome;
}

export const STATUS_PACIENTE = ['ATIVO', 'INATIVO', 'PENDENTE'] as const;
export type StatusPaciente = (typeof STATUS_PACIENTE)[number];
