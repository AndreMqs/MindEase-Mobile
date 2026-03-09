/**
 * Flag para exibir o modal de boas-vindas do Painel na próxima abertura.
 * Definido ao sair do Login ou ao finalizar o Cadastro.
 */
let showPanelWelcomeNextOpen = false;

export function shouldShowPanelWelcomeModal(): boolean {
  return showPanelWelcomeNextOpen;
}

export function markPanelWelcomeForNextOpen(): void {
  showPanelWelcomeNextOpen = true;
}

export function consumePanelWelcomeModal(): boolean {
  const v = showPanelWelcomeNextOpen;
  showPanelWelcomeNextOpen = false;
  return v;
}
