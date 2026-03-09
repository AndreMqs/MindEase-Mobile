/**
 * Entry point para Expo.
 * Registra o App (Clean Architecture) em vez do Expo Router.
 */
import { registerRootComponent } from 'expo';
import { App } from './src/app';

registerRootComponent(App);
