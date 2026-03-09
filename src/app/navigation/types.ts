import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
/** Fluxo de autenticação: Splash, Login, Cadastro, RecuperarSenha */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  RecuperarSenha: undefined;
  /** Área autenticada: TabBar com Home e Perfil */
  MainTabs: undefined;
};

/** Tabs da área autenticada */
export type MainTabsParamList = {
  Painel: undefined;
  Tarefas: undefined;
  Loja: undefined;
  Perfil: undefined;
};

/** Stack dentro da tab Tarefas */
export type TarefasStackParamList = {
  TarefasList: undefined;
  TaskDetail: { task: import('../../domain/entities/Task').Task };
  /** task opcional: sem task = criar, com task = editar */
  TaskEdit: { task?: import('../../domain/entities/Task').Task };
};

/** Stack dentro da tab Perfil */
export type PerfilStackParamList = {
  Perfil: undefined;
  AlterarDados: undefined;
  AlterarSenha: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabsScreenProps<T extends keyof MainTabsParamList> =
  BottomTabScreenProps<MainTabsParamList, T>;

export type TarefasStackScreenProps<T extends keyof TarefasStackParamList> =
  NativeStackScreenProps<TarefasStackParamList, T>;

export type PerfilStackScreenProps<T extends keyof PerfilStackParamList> =
  NativeStackScreenProps<PerfilStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
