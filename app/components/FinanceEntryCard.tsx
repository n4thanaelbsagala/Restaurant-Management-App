import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FinanceEntry } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Colors } from '../constants/colors';

interface FinanceEntryCardProps {
  entry: FinanceEntry;
  onPress: () => void;
}

export function FinanceEntryCard({ entry, onPress }: FinanceEntryCardProps) {
  const isIncome = entry.type === 'income';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View
        style={[
          styles.iconBubble,
          { backgroundColor: isIncome ? Colors.successBg : Colors.dangerBg },
        ]}
      >
        <Ionicons
          name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={18}
          color={isIncome ? Colors.income : Colors.expense}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title}
        </Text>
        <Text style={styles.meta}>
          {entry.category} · {formatDate(entry.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? Colors.income : Colors.expense }]}>
        {isIncome ? '+' : '-'}{formatCurrency(entry.amount)}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 4,
  },
  chevron: {
    marginLeft: 2,
  },
});
