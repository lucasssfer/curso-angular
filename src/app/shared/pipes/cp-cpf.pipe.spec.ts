import { CpCpfPipe } from './cp-cpf.pipe';

describe('CpCpfPipe', () => {
  const pipe = new CpCpfPipe();

  it('formata um CPF válido', () => {
    expect(pipe.transform('12345678901')).toBe('123.456.789-01');
  });

  it('retorna marcador para entrada vazia', () => {
    expect(pipe.transform('')).toBe('---');
    expect(pipe.transform(null)).toBe('---');
  });
});
