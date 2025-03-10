import { createTheme, ThemeProvider } from '@rneui/themed';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isRunningInExpoGo } from 'expo';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import '@/global.css';

import RNEWrapper from '~/components/RNEWrapper';
import SessionProvider from '~/context/AuthenticationContext';

const theme = createTheme({
  lightColors: {
    primary: '#ff006e',
    success: '#8AC926',
    white: '#FFFAEB',
    black: '#00173D',
    background: '#FFFAEB',
  },
  darkColors: {
    primary: '#ff117e',
    success: '#9AD936',
    white: '#00173D',
    black: '#FFFAEB',
    background: '#051824',
  },
});

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
Sentry.init({
  dsn: 'https://e521762f4a2f9df73ba107839ee47bd6@o4508883408846848.ingest.de.sentry.io/4508883745964112',
  debug: false,
  tracesSampleRate: 1,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const refNav = useNavigationContainerRef();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (refNav?.current) {
      navigationIntegration.registerNavigationContainer(refNav);
      setIsNavigationReady(true);
    }
  }, [refNav]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {isNavigationReady ? (
          <SessionProvider>
            <RNEWrapper />
          </SessionProvider>
        ) : (
          <View style={{ flex: 1, backgroundColor: '#FFFAEB' }} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
