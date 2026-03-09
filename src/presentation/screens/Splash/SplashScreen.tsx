import React, { useEffect, useRef, useState } from 'react';
import { ScreenContainer, LogoHeader } from '../../components';
import { RootStackScreenProps } from '../../../app/navigation/types';
import { View, StyleSheet } from 'react-native';
import { useServices } from '../../../app/providers';

const SPLASH_MIN_DURATION_MS = 1500;

export function SplashScreen({
  navigation,
}: RootStackScreenProps<'Splash'>) {
  const { authRepository } = useServices();
  const [authResolved, setAuthResolved] = useState(false);
  const [minDurationReached, setMinDurationReached] = useState(false);
  const authUserRef = useRef<{ id: string } | null>(null);

  useEffect(() => {
    const unsubscribe = authRepository.subscribeAuthState((user) => {
      authUserRef.current = user ?? null;
      setAuthResolved(true);
    });
    return unsubscribe;
  }, [authRepository]);

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationReached(true), SPLASH_MIN_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authResolved || !minDurationReached) return;
    const user = authUserRef.current;
    if (user) {
      navigation.replace('MainTabs');
    } else {
      navigation.replace('Login');
    }
  }, [authResolved, minDurationReached, navigation]);

  return (
    <ScreenContainer centered>
      <View style={styles.content}>
        <LogoHeader />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
