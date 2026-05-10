import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KitchenStackParamList } from '../types';
import { KitchenScreen } from '../screens/kitchen/KitchenScreen';
import { ResourceDetailScreen } from '../screens/kitchen/ResourceDetailScreen';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<KitchenStackParamList>();

export function KitchenNavigator() {
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
        name="KitchenList"
        component={KitchenScreen}
        options={{ title: 'Kitchen Resources' }}
      />
      <Stack.Screen
        name="ResourceDetail"
        component={ResourceDetailScreen}
        options={{ title: 'Edit Resource' }}
      />
    </Stack.Navigator>
  );
}
