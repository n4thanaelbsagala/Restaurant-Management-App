import React, { useState } from 'react';
import {
  View,
  SectionList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { FinancesStackParamList, OrderStatus } from '../../types';
import { useFinanceStore } from '../../stores/useFinanceStore';
import { useOrderStore } from '../../stores/useOrderStore';
import { useAppStore } from '../../stores/useAppStore';
import { FinanceDashboard } from '../../components/FinanceDashboard';
import { FinanceEntryCard } from '../../components/FinanceEntryCard';
import { FAB } from '../../components/FAB';
import { EmptyState } from '../../components/EmptyState';
import { BottomSheet } from '../../components/BottomSheet';
import { FormField } from '../../components/FormField';
import { CategoryPicker } from '../../components/CategoryPicker';
import { financeEntrySchema, FinanceEntryFormData } from '../../schemas/financeSchema';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories';
import { formatMonthYear, addMonths, isInMonth, formatDateForInput } from '../../utils/date';
import { calculateRevenue, calculateFinanceTotals } from '../../utils/calculations';
import { useMonthlyTotals } from '../../hooks/useMonthlyTotals';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<FinancesStackParamList, 'FinancesList'>;

export function FinancesScreen({ navigation }: Props) {
  const entries = useFinanceStore((s) => s.entries);
  const addEntry = useFinanceStore((s) => s.addEntry);
  const orders = useOrderStore((s) => s.orders);
  const { selectedMonth, setSelectedMonth } = useAppStore();
  const { year, month } = selectedMonth;

  const [modalVisible, setModalVisible] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('expense');

  const { control, handleSubmit, reset, watch, formState: { errors } } =
    useForm<FinanceEntryFormData>({
      resolver: zodResolver(financeEntrySchema),
      defaultValues: {
        type: 'expense',
        title: '',
        amount: 0,
        date: formatDateForInput(),
        category: '',
      },
    });

  const watchedType = watch('type');

  // All-time totals for dashboard
  const completedOrders = orders.filter((o) => o.status === OrderStatus.Completed);
  const allTimeRevenue = calculateRevenue(completedOrders);
  const { income: allIncome, expenses: allExpenses } = calculateFinanceTotals(entries);

  // Monthly breakdown
  const monthlyTotals = useMonthlyTotals(year, month);
  const monthlyEntries = entries.filter((e) => isInMonth(e.date, year, month));
  const incomeEntries = monthlyEntries.filter((e) => e.type === 'income');
  const expenseEntries = monthlyEntries.filter((e) => e.type === 'expense');

  const openAdd = (type: 'income' | 'expense') => {
    setEntryType(type);
    reset({
      type,
      title: '',
      amount: 0,
      date: formatDateForInput(),
      category: '',
    });
    setModalVisible(true);
  };

  const onSubmit = (data: FinanceEntryFormData) => {
    addEntry(data);
    setModalVisible(false);
  };

  const categoryOptions = watchedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const sections = [
    {
      title: `Income  +$${monthlyTotals.income.toFixed(2)}`,
      data: incomeEntries,
      type: 'income' as const,
    },
    {
      title: `Expenses  -$${monthlyTotals.expenses.toFixed(2)}`,
      data: expenseEntries,
      type: 'expense' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <FinanceEntryCard
            entry={item}
            onPress={() => navigation.navigate('EntryDetail', { entryId: item.id })}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <TouchableOpacity
              onPress={() => openAdd(section.type)}
              style={styles.sectionAddBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <View style={styles.sectionEmpty}>
              <Text style={styles.sectionEmptyText}>
                No {section.type} entries this month
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            <FinanceDashboard
              revenue={allTimeRevenue}
              manualIncome={allIncome}
              expenses={allExpenses}
            />
            {/* Month selector */}
            <View style={styles.monthSelector}>
              <TouchableOpacity
                onPress={() => {
                  const prev = addMonths(year, month, -1);
                  setSelectedMonth(prev.year, prev.month);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Ionicons name="chevron-back" size={22} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.monthText}>{formatMonthYear(year, month)}</Text>
              <TouchableOpacity
                onPress={() => {
                  const next = addMonths(year, month, 1);
                  setSelectedMonth(next.year, next.month);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {/* Monthly net */}
            <View style={styles.monthlyNetRow}>
              <Text style={styles.monthlyNetLabel}>Monthly Net</Text>
              <Text
                style={[
                  styles.monthlyNetValue,
                  { color: monthlyTotals.net >= 0 ? Colors.income : Colors.expense },
                ]}
              >
                {monthlyTotals.net >= 0 ? '+' : ''}${monthlyTotals.net.toFixed(2)}
              </Text>
            </View>
          </>
        }
        contentContainerStyle={styles.list}
      />
      <FAB onPress={() => openAdd('expense')} />

      <BottomSheet
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title={entryType === 'income' ? 'Add Income' : 'Add Expense'}
      >
        {/* Type toggle */}
        <View style={styles.typeToggle}>
          {(['income', 'expense'] as const).map((t) => (
            <Controller
              key={t}
              control={control}
              name="type"
              render={({ field: { onChange } }) => (
                <TouchableOpacity
                  style={[styles.typeBtn, watchedType === t ? styles.typeBtnActive : null]}
                  onPress={() => onChange(t)}
                >
                  <Text style={[styles.typeBtnText, watchedType === t ? styles.typeBtnTextActive : null]}>
                    {t === 'income' ? 'Income' : 'Expense'}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ))}
        </View>

        <FormField
          control={control}
          name="title"
          label="Title"
          error={errors.title}
          inputProps={{ placeholder: 'e.g. Produce delivery' }}
        />
        <FormField
          control={control}
          name="amount"
          label="Amount ($)"
          error={errors.amount}
          inputProps={{ placeholder: '0.00', keyboardType: 'decimal-pad' }}
        />
        <FormField
          control={control}
          name="date"
          label="Date (YYYY-MM-DD)"
          error={errors.date}
          inputProps={{ placeholder: formatDateForInput(), keyboardType: 'numbers-and-punctuation' }}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <CategoryPicker
              label="Category"
              options={categoryOptions}
              value={value}
              onChange={onChange}
              error={errors.category?.message}
            />
          )}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
          <Text style={styles.submitText}>Add Entry</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 100 },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  monthText: { fontSize: 17, fontWeight: '700', color: Colors.text, minWidth: 140, textAlign: 'center' },
  monthlyNetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  monthlyNetLabel: { fontSize: 14, color: Colors.textSecondary },
  monthlyNetValue: { fontSize: 16, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionAddBtn: { padding: 2 },
  sectionEmpty: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionEmptyText: { fontSize: 14, color: Colors.textDisabled, fontStyle: 'italic' },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeBtnActive: { backgroundColor: Colors.primary },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.white },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
