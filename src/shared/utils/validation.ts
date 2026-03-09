/**
 * Validações reutilizáveis (apenas formato; regras de negócio ficam em use cases).
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/** Mínimo 6 caracteres (Firebase Auth). */
export function isPasswordStrongEnough(password: string): boolean {
  return password.length >= 6;
}

export function getEmailError(email: string): string | null {
  if (!email.trim()) return 'E-mail é obrigatório.';
  if (!isValidEmail(email)) return 'E-mail inválido.';
  return null;
}

export function getPasswordError(password: string): string | null {
  if (!password) return 'Senha é obrigatória.';
  if (!isPasswordStrongEnough(password)) return 'Senha deve ter no mínimo 6 caracteres.';
  return null;
}
