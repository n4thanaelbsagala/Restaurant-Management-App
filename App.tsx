import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './app/navigation/RootNavigator';
import { useOrderStore } from './app/stores/useOrderStore';
import { useKitchenStore } from './app/stores/useKitchenStore';
import { useFinanceStore } from './app/stores/useFinanceStore';
import { paperTheme } from './app/constants/theme';
import { seedDataIfNeeded } from './app/utils/seed';

export default function App() {
  const hydrateOrders = useOrderStore((s) => s.hydrate);
  const hydrateKitchen = useKitchenStore((s) => s.hydrate);
  const hydrateFinances = useFinanceStore((s) => s.hydrate);

  useEffect(() => {
    const init = async () => {
      await seedDataIfNeeded();
      await Promise.all([hydrateOrders(), hydrateKitchen(), hydrateFinances()]);
    };
    init();
  }, [hydrateOrders, hydrateKitchen, hydrateFinances]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
