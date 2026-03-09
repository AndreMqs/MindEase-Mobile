/**
 * Entidade de usuário autenticado.
 * Domain não conhece Firebase; apenas dados essenciais.
 */
export type User = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};
