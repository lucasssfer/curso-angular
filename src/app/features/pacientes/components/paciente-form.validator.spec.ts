import { FormControl } from '@angular/forms';
import { cpfValido } from './paciente-form.component';

describe('cpfValido', () => {
  const validator = cpfValido();

  it('retorna null para CPF válido', () => {
    expect(validator(new FormControl('123.456.789-01'))).toBeNull();
  });

  it('retorna cpfInvalido para CPF inválido', () => {
    expect(validator(new FormControl('123'))).toEqual({ cpfInvalido: true });
  });
});