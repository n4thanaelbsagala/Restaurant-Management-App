import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import { OrdersNavigator } from './OrdersNavigator';
import { KitchenNavigator } from './KitchenNavigator';
import { FinancesNavigator } from './FinancesNavigator';
import { Colors } from '../constants/colors';
import { useLowStockAlert } from '../hooks/useLowStockAlert';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator<RootTabParamList>();

function KitchenTabIcon({ color, size }: { color: string; size: number }) {
  const { lowCount, emptyCount } = useLowStockAlert();
  const badgeCount = lowCount + emptyCount;
  return (
    <View>
      <Ionicons name="restaurant-outline" size={size} color={color} />
      {badgeCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            borderTopColor: Colors.border,
            backgroundColor: Colors.background,
            elevation: 8,
            shadowColor: Colors.shadow,
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tab.Screen
          name="Orders"
          component={OrdersNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Kitchen"
          component={KitchenNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <KitchenTabIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Finances"
          component={FinancesNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
