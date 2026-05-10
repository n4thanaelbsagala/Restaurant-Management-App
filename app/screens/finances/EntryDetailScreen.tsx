import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { FinancesStackParamList } from '../../types';
import { useFinanceStore } from '../../stores/useFinanceStore';
import { FormField } from '../../components/FormField';
import { CategoryPicker } from '../../components/CategoryPicker';
import { financeEntrySchema, FinanceEntryFormData } from '../../schemas/financeSchema';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<FinancesStackParamList, 'EntryDetail'>;

export function EntryDetailScreen({ route, navigation }: Props) {
  const { entryId } = route.params;
  const entries = useFinanceStore((s) => s.entries);
  const updateEntry = useFinanceStore((s) => s.updateEntry);
  const deleteEntry = useFinanceStore((s) => s.deleteEntry);

  const entry = entries.find((e) => e.id === entryId);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FinanceEntryFormData>({
    resolver: zodResolver(financeEntrySchema),
    defaultValues: entry
      ? {
          type: entry.type,
          title: entry.title,
          amount: entry.amount,
          date: entry.date,
          category: entry.category,
        }
      : undefined,
  });

  const watchedType = watch('type');

  if (!entry) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Entry not found.</Text>
      </View>
    );
  }

  const onSubmit = (data: FinanceEntryFormData) => {
    updateEntry(entry.id, data);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Entry', `Remove "${entry.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEntry(entry.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const categoryOptions = watchedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Type indicator (read-only) */}
      <View
        style={[
          styles.typeChip,
          {
            backgroundColor:
              entry.type === 'income' ? Colors.successBg : Colors.dangerBg,
          },
        ]}
      >
        <Ionicons
          name={entry.type === 'income' ? 'arrow-down-outline' : 'arrow-up-outline'}
          size={16}
          color={entry.type === 'income' ? Colors.income : Colors.expense}
        />
        <Text
          style={[
            styles.typeChipText,
            { color: entry.type === 'income' ? Colors.income : Colors.expense },
          ]}
        >
          {entry.type === 'income' ? 'Income' : 'Expense'}
        </Text>
      </View>

      <FormField
        control={control}
        name="title"
        label="Title"
        error={errors.title}
      />
      <FormField
        control={control}
        name="amount"
        label="Amount ($)"
        error={errors.amount}
        inputProps={{ keyboardType: 'decimal-pad' }}
      />
      <FormField
        control={control}
        name="date"
        label="Date (YYYY-MM-DD)"
        error={errors.date}
        inputProps={{ keyboardType: 'numbers-and-punctuation' }}
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

      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Delete Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 16, color: Colors.textSecondary },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  typeChipText: { fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '600', color: Colors.danger },
});
