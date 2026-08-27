import { possuiToken } from './auth.guard';

describe('authGuard', () => {
  it('permite acesso quando existe token', () => {
    expect(possuiToken('fake-token')).toBe(true);
  });

  it('nega acesso quando não existe token', () => {
    expect(possuiToken(null)).toBe(false);
  });
});
