import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency } from '../utils/currency';
import { formatTime, formatDate } from '../utils/date';
import { Colors } from '../constants/colors';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const itemSummary = order.items
    .map((i) => `${i.quantity}× ${i.name}`)
    .join(', ');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.row}>
        <View style={styles.tableTag}>
          <Ionicons name="grid-outline" size={14} color={Colors.primary} />
          <Text style={styles.tableText}>Table {order.tableNumber}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.items} numberOfLines={2}>
        {itemSummary}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
        </Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tableText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  items: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.textDisabled,
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
});
