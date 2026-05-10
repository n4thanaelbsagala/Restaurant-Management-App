import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
  subMessage?: string;
}

export function EmptyState({ icon = 'file-tray-outline', message, subMessage }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={Colors.textDisabled} />
      <Text style={styles.message}>{message}</Text>
      {subMessage ? <Text style={styles.subMessage}>{subMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  message: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subMessage: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
});
