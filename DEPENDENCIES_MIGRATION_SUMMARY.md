# Resumo da migração de dependências — MindEaseMobile1 → MindEaseMobile

Esta etapa prepara apenas o ambiente do **MindEaseMobile** (Expo Go) com as dependências equivalentes ao **MindEaseMobile1** (React Native CLI), sem migrar código nem features.

---

## 1. Dependências do MindEaseMobile1 (projeto antigo)

### dependencies (MindEaseMobile1)

| Pacote | Versão no antigo | Uso / observação |
|--------|-------------------|------------------|
| `@expo/vector-icons` | ^15.1.1 | Ícones (Expo) |
| `@react-native/new-app-screen` | 0.84.1 | Tela padrão do template CLI |
| `@react-navigation/bottom-tabs` | ^7.15.5 | Abas |
| `@react-navigation/native` | ^7.1.33 | Navegação |
| `@react-navigation/native-stack` | ^7.14.4 | Stack nativo |
| `expo-asset` | ^55.0.8 | Assets (Expo) |
| `firebase` | ^12.10.0 | Auth, Firestore, etc. |
| `react` | 19.2.3 | Core |
| `react-native` | 0.84.1 | Core |
| `react-native-config` | ^1.6.1 | Variáveis de ambiente (nativo) |
| `react-native-safe-area-context` | ^5.5.2 | Safe area |
| `react-native-screens` | ^4.24.0 | Telas nativas |
| `react-native-vector-icons` | ^10.3.0 | Ícones (wrapper nativo) |

### devDependencies (MindEaseMobile1)

| Pacote | Versão no antigo | Uso |
|--------|-------------------|-----|
| `@babel/core`, `@babel/preset-env`, `@babel/runtime` | ^7.25.x | Build (gerido pelo Expo no novo projeto) |
| `@react-native-community/cli*` | 20.1.0 | CLI React Native (não usado no Expo) |
| `@react-native/babel-preset`, `eslint-config`, `metro-config`, `typescript-config` | 0.84.1 | Tooling CLI (Expo tem o próprio) |
| `@types/jest`, `@types/react`, `@types/react-test-renderer` | vários | Tipos |
| `eslint` | ^8.19.0 | Lint |
| `jest`, `react-test-renderer` | 29.x / 19.x | Testes (não migrado nesta etapa) |
| `prettier` | 2.8.8 | Formatação |
| `typescript` | ^5.8.3 | TypeScript |

---

## 2. Dependências adicionadas no MindEaseMobile (nesta etapa)

### dependencies

| Pacote | Versão instalada | Motivo |
|--------|------------------|--------|
| `firebase` | ~12.10.0 | Mesma família do projeto antigo; Firebase JS SDK é compatível com Expo Go (Auth, Firestore, Realtime DB, Storage). |
| `@react-navigation/native-stack` | ~7.14.0 | Equivalente ao uso de `createNativeStackNavigator` no projeto antigo; compatível com Expo Go. |

### devDependencies

| Pacote | Versão instalada | Motivo |
|--------|------------------|--------|
| `prettier` | ^2.8.8 | Alinhado ao projeto antigo; formatação de código. |

---

## 3. Dependências que já existiam no MindEaseMobile (sem alteração)

Estas já estavam no template Expo e cobrem o mesmo propósito do projeto antigo:

| No MindEaseMobile1 | No MindEaseMobile (equivalente) |
|--------------------|----------------------------------|
| `@expo/vector-icons` | `@expo/vector-icons` (já presente) |
| `@react-navigation/bottom-tabs` | `@react-navigation/bottom-tabs` (já presente) |
| `@react-navigation/native` | `@react-navigation/native` (já presente) |
| `react-native-safe-area-context` | `react-native-safe-area-context` (já presente) |
| `react-native-screens` | `react-native-screens` (já presente) |
| `react`, `react-native` | Gerenciados pelo Expo (~54), versões compatíveis com o ecossistema |
| `expo-asset` | Incluído no SDK Expo; não é dependência direta no package.json |
| `typescript`, `@types/react`, `eslint` | Já presentes no template (versões Expo) |

---

## 4. Dependências não instaladas (incompatíveis ou desnecessárias com Expo Go)

### 4.1. Não compatíveis com Expo Go — não instaladas

| Dependência | Motivo | Alternativa recomendada |
|-------------|--------|---------------------------|
| **react-native-config** | Requer código nativo e linking; não funciona no Expo Go. | **Variáveis de ambiente:** usar `EXPO_PUBLIC_*` em `.env` e `process.env.EXPO_PUBLIC_*` no código, ou configuração em `app.config.js` / `app.config.ts`. Em build EAS: EAS Secrets. Doc: [Environment variables - Expo](https://docs.expo.dev/guides/environment-variables). |

### 4.2. Desnecessárias no contexto Expo — não adicionadas

| Dependência | Motivo | Observação |
|-------------|--------|------------|
| **@react-native/new-app-screen** | Tela padrão do template React Native CLI. | Não existe no fluxo Expo; o template Expo já define a estrutura de telas (ex.: Expo Router). |
| **react-native-vector-icons** | Fornece ícones com linking nativo (fontes). | **@expo/vector-icons** já está no MindEaseMobile e expõe os mesmos conjuntos de ícones (Ionicons, MaterialIcons, etc.) de forma compatível com Expo Go. Na migração do código, trocar imports de `react-native-vector-icons` por `@expo/vector-icons`. |

### 4.3. devDependencies não migradas (decisão consciente)

| Dependência | Motivo |
|-------------|--------|
| `@babel/*`, `@react-native-community/cli*`, `@react-native/babel-preset`, `metro-config`, etc. | São específicos do React Native CLI. O Expo gerencia Babel e Metro; não é necessário replicar no package.json. |
| `jest`, `@types/jest`, `react-test-renderer` | Testes não foram migrados nesta etapa. Quando for adicionar testes no MindEaseMobile, usar a configuração recomendada pelo Expo (ex.: `jest-expo`). |

---

## 5. Critérios de decisão aplicados

- **Compatibilidade com Expo Go:** só foram adicionadas libs que funcionam no Expo Go (sem native code extra ou config plugins incompatíveis).
- **Preservação de libs:** Firebase e navegação (native-stack) foram mantidos na mesma família de versão (Firebase 12.x, React Navigation 7.x).
- **Conflitos de versão:** React e React Native ficam nas versões definidas pelo Expo SDK 54; as demais foram escolhidas compatíveis com esse ecossistema.
- **react-native-config:** não instalada; documentada a alternativa com variáveis de ambiente do Expo.

---

## 6. Como rodar o MindEaseMobile após esta etapa

```bash
cd Mobile/MindEaseMobile
npm install
npm run start
```

Em seguida, abrir no Expo Go (QR code ou dispositivo/simulador). Nenhuma feature do MindEaseMobile1 foi migrada; apenas o conjunto de dependências foi preparado para a próxima etapa de migração.
