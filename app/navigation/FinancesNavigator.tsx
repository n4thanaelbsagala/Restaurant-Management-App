import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FinancesStackParamList } from '../types';
import { FinancesScreen } from '../screens/finances/FinancesScreen';
import { EntryDetailScreen } from '../screens/finances/EntryDetailScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<FinancesStackParamList>();

export function FinancesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '700', color: Colors.text },
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="FinancesList"
        component={FinancesScreen}
        options={{ title: 'Finances' }}
      />
      <Stack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ title: 'Edit Entry' }}
      />
    </Stack.Navigator>
  );
}
