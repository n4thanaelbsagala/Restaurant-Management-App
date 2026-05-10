import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/currency';
import { Colors } from '../constants/colors';

interface FinanceDashboardProps {
  revenue: number;
  manualIncome: number;
  expenses: number;
}

export function FinanceDashboard({ revenue, manualIncome, expenses }: FinanceDashboardProps) {
  const net = revenue + manualIncome - expenses;
  const isPositive = net >= 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Financial Overview</Text>
      <View style={styles.netRow}>
        <Text style={styles.netLabel}>Net Balance</Text>
        <Text style={[styles.netValue, { color: isPositive ? Colors.income : Colors.expense }]}>
          {isPositive ? '' : '-'}{formatCurrency(Math.abs(net))}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statsGrid}>
        <Stat label="Order Revenue" value={formatCurrency(revenue)} color={Colors.income} />
        <Stat label="Other Income" value={formatCurrency(manualIncome)} color={Colors.income} />
        <Stat label="Expenses" value={formatCurrency(expenses)} color={Colors.expense} />
      </View>
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  netValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
