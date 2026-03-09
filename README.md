# MindEase (Mobile)

Aplicação mobile de suporte cognitivo (TDAH, TEA, dislexia, burnout, ansiedade): tarefas, preferências acessíveis e gamificação. Projeto em **React Native + Expo + TypeScript**, com **Clean Architecture** e integração **Firebase**.

---

## Como rodar

```bash
npm install
npx expo start
```

No terminal do Expo você pode abrir em:
- **iOS** — `npm run ios` ou tecla `i` (simulador)
- **Android** — `npm run android` ou tecla `a` (emulador)
- **Web** — `npm run web` ou tecla `w`
- **Expo Go** — escanear QR code no dispositivo

> Requer **Node.js 20+** (ou use o [patch do metro-config](https://github.com/facebook/metro/issues/1210) em Node 18).

```bash
npm run lint   # lint do projeto
```

---

## Stack e libs

| Uso | Tecnologia |
|-----|------------|
| **Core** | React 19, React Native 0.81, Expo 54, TypeScript 5.9 |
| **Roteamento** | Expo Router 6 (file-based), React Navigation 7 (tabs + stack) |
| **UI / gestos** | React Native Paper (ou custom), Gesture Handler, Reanimated |
| **Navegação** | Bottom Tabs, Native Stack |
| **Backend / dados** | Firebase (Auth, Firestore, Storage) |
| **Estado / persistência** | Context (preferências), repositórios (auth, tarefas, preferências) |

---

## Arquitetura

- **Clean Architecture**: domínio isolado, casos de uso independentes de UI, adaptadores por interfaces.
- **Camadas**:
  - **`domain/`** — use cases (auth, tarefas, preferências)
  - **`data/`** — repositórios, data sources (auth, database, storage)
  - **`infra/`** — implementações Firebase (auth, Firestore, Storage)
  - **`presentation/`** — telas, componentes reutilizáveis
  - **`app/`** — navegação (Root, Tabs, Stacks), providers (tema, preferências, serviços), container (DI), config

**Roteamento** com **Expo Router** em `src/app`; navegação por abas (Home, Tarefas, Perfil) e stacks por módulo.

---

## Features

### Autenticação (Firebase quando configurado; stubs locais)
- Splash, Login, Cadastro, Recuperar senha
- Cadastro: nome, e-mail, senha
- Rotas públicas e protegidas

### Painel cognitivo
- Preferências de complexidade, modo foco, resumo, animações, alertas
- Contraste, tamanho da fonte, espaçamento
- Perfil de navegação e necessidades específicas (TDAH, dislexia, ansiedade, sobrecarga)

### Tarefas
- Listagem por seções (A fazer, Fazendo, Feito)
- Detalhe e edição de tarefa; checklist
- Timer de foco (Pomodoro) e avisos conforme rotina
- Preferências aplicadas em tempo real (tema, acessibilidade)

### Perfil
- Resumo de preferências; gamificação (pontos, total ganho)
- Aba Dados e conta: editar nome e e-mail, alterar senha
- Integração preparada para Firebase

### Persistência
- Auth e tarefas: **Firebase** (Auth, Firestore) quando configurado; stubs locais para desenvolvimento
- Preferências: repositório com persistência local / Firebase conforme ambiente

---

## Firebase (configuração)

1. Criar `.env` (ou `app.config.js` / `app.config.ts`) com as variáveis do projeto Firebase.
2. Configurar **Firebase Auth**, **Firestore** e **Storage** no console.
3. Os repositórios em `data/` e implementações em `infra/firebase` já estão preparados; trocar stubs pelo container quando for usar Firebase em produção.

A infra de auth prevê: login, registro (com nome), logout, recuperar senha, **atualizar perfil** (nome/e-mail) e **alterar senha**.

---

## Estrutura de pastas (resumo)

```txt
src/
  app/              # Expo Router root, navegação (Root, Tabs, Stacks), providers, container, config
  domain/           # use cases (auth, tasks, preferences)
  data/             # repositórios, data sources (auth, database, storage)
  infra/            # Firebase (auth, Firestore, Storage)
  presentation/     # screens (Splash, Login, Home, Painel, Tarefas, Perfil, etc.) e components
  lib/              # helpers (ex.: firebase client)
```

---
