# Resumo da migração — MindEaseMobile1 → MindEaseMobile (Expo Go)

Migração da base do projeto **MindEaseMobile1** (React Native CLI) para **MindEaseMobile** (Expo Go), preservando a Clean Architecture e a organização de pastas.

---

## 1. Pastas migradas

A estrutura em **MindEaseMobile** replica a do MindEaseMobile1:

```
src/
├── app/
│   ├── config/          ✅ env, firebaseAnalytics, index
│   ├── container/       ✅ container.ts, index (composition root)
│   ├── navigation/      ✅ RootNavigator, MainTabs, TarefasStack, PerfilStack, types, index
│   ├── providers/       ✅ ServicesProvider, ThemeProvider, PreferencesProvider, index
│   ├── App.tsx          ✅
│   ├── index.ts         ✅
│   └── panelWelcome.ts  ✅
├── assets/              ✅ (pasta criada, vazia)
├── data/
│   ├── data-sources/    ✅ auth, database, storage (interfaces)
│   └── repositories/    ✅ Auth, StubAuth, Preferences, StubPreferences, Tasks, StubTasks, FirestoreDatabase, Storage
├── domain/
│   ├── contracts/repositories/  ✅ IAuth, IDatabase, IStorage, ITasks, IPreferences, IAnalytics
│   ├── entities/       ✅ User, UserProfile, Board, Task, Preferences
│   └── use-cases/       ✅ auth, preferences, tasks (todos os casos de uso)
├── infra/
│   └── firebase/        ✅ types, config, data-sources (FirebaseAuth, Firestore, Storage)
├── lib/
│   ├── firebase.ts      ✅ (Firebase Web SDK — compatível Expo Go)
│   └── index.ts         ✅
├── presentation/
│   ├── components/      ✅ Button, Checkbox, Input, LogoHeader, ScreenContainer, ScreenHeader,
│   │                     TaskCard, TaskSection, TaskActionsSheet, TaskDetailsModal,
│   │                     EmptyTasksState, PanelSelect, index
│   └── screens/         ✅ Splash, Login, Cadastro, RecuperarSenha, Home, Painel, Tarefas,
│                         TaskDetail, TaskEdit, Perfil (+ components), AlterarSenha, AlterarDados
└── shared/
    ├── constants/       ✅ APP_NAME
    ├── theme/           ✅ palette, rnTheme, spacing, typography, index
    ├── types/           ✅ Nullable
    └── utils/           ✅ validation (email, password)
```

---

## 2. Arquivos copiados/adaptados

| Origem | Ação |
|--------|------|
| **shared/** | Copiados 1:1 (theme, utils, constants, types). |
| **domain/** | Copiados 1:1 (entities, contracts, use-cases auth/preferences/tasks). |
| **data/** | Copiados 1:1 (data-sources interfaces, todos os repositories). |
| **infra/firebase/** | Copiados 1:1 (Firebase Web SDK já compatível com Expo Go). |
| **lib/firebase.ts** | Copiado 1:1. |
| **app/config, container, providers** | Copiados 1:1. |
| **app/navigation** | Copiados com **uma adaptação**: ícones de `react-native-vector-icons` trocados por **@expo/vector-icons** (MaterialCommunityIcons) no `MainTabsNavigator`. |
| **app/App.tsx, index.ts, panelWelcome.ts** | Copiados 1:1. |
| **presentation/components** | Copiados 1:1. |
| **presentation/screens** | Copiados 1:1 (Splash, Login, Cadastro, RecuperarSenha, Home, Painel, Tarefas, TaskDetail, TaskEdit, Perfil + componentes, AlterarSenha, AlterarDados). |
| **Entry** | **Novo**: `index.js` na raiz chama `registerRootComponent(App)` (Expo). `package.json` → `"main": "index.js"` (substitui `expo-router/entry`). |

---

## 3. Ajustes por causa do Expo Go

| Item | Ajuste |
|------|--------|
| **Entry point** | Expo usa `registerRootComponent` em `index.js`; o app passa a usar o `App` da Clean Architecture em vez do Expo Router. |
| **Ícones** | `react-native-vector-icons` (nativo) não é usado no Expo Go. **MainTabsNavigator** passou a usar `@expo/vector-icons` (MaterialCommunityIcons). |
| **Navegação** | Mantida navegação tradicional (React Navigation: RootNavigator, MainTabs, stacks). Não foi usado Expo Router. |
| **Firebase** | Nenhuma alteração: o projeto já usava Firebase Web SDK em `lib/firebase.ts`, compatível com Expo Go. |
| **Variáveis de ambiente** | `app/config/env.ts` e `firebaseAnalytics.ts` continuam iguais; suporte a `EXPO_PUBLIC_*` já existia no analytics. |
| **TypeScript** | Ajustes de tipos para compilar com `strict: true`: `ThemeProvider` (retornos de `getEffectiveColors` com `as unknown as ThemeColors`), `firebaseAnalytics` (tipo do config estático), `MainTabsNavigator` (tipo do `route` em `getTarefasTabBarStyle`), `TaskDetailScreen`/`TaskEditScreen` (`RouteProp` para `useRoute`), `TasksRepository` (cast em `stripUndefined`), e tratamento de `task.focusTimerPausedAt`/`StartedAt` possivelmente undefined em `TaskDetailScreen`. |

Nenhuma lib nativa incompatível com Expo Go foi adicionada; o que existia (Firebase JS, React Navigation) é compatível.

---

## 4. O que não foi alterado

- **MindEaseMobile1** não foi modificado (somente leitura/cópia).
- **Expo Router**: a pasta `app/` do template Expo (ex.: `app/(tabs)/`, `_layout.tsx`) continua no projeto, mas o app não a usa (entry = `index.js` → `App`).
- **Lógica de negócio**: use cases, entities, contracts e regras foram mantidos; apenas tipos e pontos de entrada foram ajustados para o ambiente Expo/TypeScript.

---

## 5. Pontos para validação manual

1. **Fluxo de auth**  
   Splash → Login/Cadastro → MainTabs; recuperar senha; sair (reset para Login).

2. **Painel**  
   Preferências (complexidade, contraste, fonte, espaçamento, etc.); modal de boas-vindas após login/cadastro.

3. **Tarefas**  
   Listar, criar, editar, excluir, mover (todo/doing/done), checklist, timer de foco.

4. **Perfil**  
   Alterar dados, alterar senha; exibição de preferências e botão sair.

5. **Firebase**  
   Login, cadastro, recuperação de senha, Firestore (preferências, tarefas) e Storage (se usado) no dispositivo/Expo Go.

6. **Tema**  
   Contraste normal / alto / muito alto e preferências de fonte/espaçamento em todas as telas.

---

## 6. Como rodar

```bash
cd Mobile/MindEaseMobile
npm install
npm run start
```

Abrir no **Expo Go** (QR code ou dispositivo/simulador). O app sobe com a mesma arquitetura e fluxos do MindEaseMobile1, adaptados para Expo Go.
