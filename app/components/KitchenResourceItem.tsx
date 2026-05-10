import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KitchenResource, StockLevel } from '../types';
import { getStockLevel } from '../utils/calculations';
import { Colors } from '../constants/colors';
import { RESOURCE_CATEGORY_ICONS } from '../constants/categories';

interface KitchenResourceItemProps {
  resource: KitchenResource;
  onPress: () => void;
}

const LEVEL_STYLES: Record<StockLevel, { bg: string; text: string; icon: string }> = {
  ok: { bg: Colors.surface, text: Colors.textSecondary, icon: 'checkmark-circle-outline' },
  low: { bg: Colors.warningBg, text: '#92400E', icon: 'warning-outline' },
  empty: { bg: Colors.dangerBg, text: Colors.danger, icon: 'alert-circle-outline' },
};

export function KitchenResourceItem({ resource, onPress }: KitchenResourceItemProps) {
  const level = getStockLevel(resource);
  const levelStyle = LEVEL_STYLES[level];

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: levelStyle.bg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={RESOURCE_CATEGORY_ICONS[resource.category] as keyof typeof Ionicons.glyphMap}
          size={22}
          color={Colors.primary}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{resource.name}</Text>
        <Text style={styles.meta}>
          {resource.category} · threshold {resource.lowStockThreshold} {resource.unit}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.quantity, level !== 'ok' ? { color: levelStyle.text } : null]}>
          {resource.quantity}
        </Text>
        <Text style={styles.unit}>{resource.unit}</Text>
      </View>
      <Ionicons
        name={levelStyle.icon as keyof typeof Ionicons.glyphMap}
        size={18}
        color={levelStyle.text}
        style={styles.statusIcon}
      />
      <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF3EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  unit: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statusIcon: {
    marginRight: 4,
  },
});
