import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { KitchenStackParamList } from '../../types';
import { useKitchenStore } from '../../stores/useKitchenStore';
import { FormField } from '../../components/FormField';
import { CategoryPicker } from '../../components/CategoryPicker';
import { kitchenResourceSchema, KitchenResourceFormData } from '../../schemas/kitchenResourceSchema';
import { RESOURCE_CATEGORIES, RESOURCE_UNITS } from '../../constants/categories';
import { getStockLevel } from '../../utils/calculations';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<KitchenStackParamList, 'ResourceDetail'>;

const LEVEL_COLORS = { ok: Colors.success, low: Colors.warning, empty: Colors.danger };

export function ResourceDetailScreen({ route, navigation }: Props) {
  const { resourceId } = route.params;
  const resources = useKitchenStore((s) => s.resources);
  const updateResource = useKitchenStore((s) => s.updateResource);
  const deleteResource = useKitchenStore((s) => s.deleteResource);

  const resource = resources.find((r) => r.id === resourceId);

  const { control, handleSubmit, formState: { errors } } = useForm<KitchenResourceFormData>({
    resolver: zodResolver(kitchenResourceSchema),
    defaultValues: resource
      ? {
          name: resource.name,
          category: resource.category,
          quantity: resource.quantity,
          unit: resource.unit,
          lowStockThreshold: resource.lowStockThreshold,
        }
      : undefined,
  });

  if (!resource) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Resource not found.</Text>
      </View>
    );
  }

  const level = getStockLevel(resource);

  const onSubmit = (data: KitchenResourceFormData) => {
    updateResource(resource.id, data);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Resource', `Remove "${resource.name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteResource(resource.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Current stock status chip */}
      <View style={[styles.statusChip, { backgroundColor: LEVEL_COLORS[level] + '22' }]}>
        <Ionicons
          name={level === 'ok' ? 'checkmark-circle' : level === 'low' ? 'warning' : 'alert-circle'}
          size={16}
          color={LEVEL_COLORS[level]}
        />
        <Text style={[styles.statusText, { color: LEVEL_COLORS[level] }]}>
          Current stock: {resource.quantity} {resource.unit}
          {level !== 'ok' ? (level === 'empty' ? ' — Out of stock' : ' — Low stock') : ''}
        </Text>
      </View>

      <FormField
        control={control}
        name="name"
        label="Resource Name"
        error={errors.name}
      />
      <Controller
        control={control}
        name="category"
        render={({ field: { value, onChange } }) => (
          <CategoryPicker
            label="Category"
            options={RESOURCE_CATEGORIES}
            value={value}
            onChange={onChange}
            error={errors.category?.message}
          />
        )}
      />
      <View style={styles.rowFields}>
        <View style={styles.halfField}>
          <FormField
            control={control}
            name="quantity"
            label="Quantity"
            error={errors.quantity}
            inputProps={{ keyboardType: 'decimal-pad' }}
          />
        </View>
        <View style={styles.halfField}>
          <Controller
            control={control}
            name="unit"
            render={({ field: { value, onChange } }) => (
              <CategoryPicker
                label="Unit"
                options={RESOURCE_UNITS}
                value={value}
                onChange={onChange}
                error={errors.unit?.message}
              />
            )}
          />
        </View>
      </View>
      <FormField
        control={control}
        name="lowStockThreshold"
        label="Low Stock Threshold"
        error={errors.lowStockThreshold}
        inputProps={{ keyboardType: 'decimal-pad' }}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Delete Resource</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 16, color: Colors.textSecondary },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: { fontSize: 14, fontWeight: '600' },
  rowFields: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
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
