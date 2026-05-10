import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { KitchenStackParamList, ResourceCategory } from '../../types';
import { useKitchenStore } from '../../stores/useKitchenStore';
import { KitchenResourceItem } from '../../components/KitchenResourceItem';
import { FAB } from '../../components/FAB';
import { EmptyState } from '../../components/EmptyState';
import { BottomSheet } from '../../components/BottomSheet';
import { FormField } from '../../components/FormField';
import { CategoryPicker } from '../../components/CategoryPicker';
import { kitchenResourceSchema, KitchenResourceFormData } from '../../schemas/kitchenResourceSchema';
import { RESOURCE_CATEGORIES, RESOURCE_UNITS } from '../../constants/categories';
import { useLowStockAlert } from '../../hooks/useLowStockAlert';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<KitchenStackParamList, 'KitchenList'>;

export function KitchenScreen({ navigation }: Props) {
  const resources = useKitchenStore((s) => s.resources);
  const addResource = useKitchenStore((s) => s.addResource);
  const { lowCount, emptyCount } = useLowStockAlert();

  const [modalVisible, setModalVisible] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } =
    useForm<KitchenResourceFormData>({
      resolver: zodResolver(kitchenResourceSchema),
      defaultValues: {
        name: '',
        category: ResourceCategory.Ingredients,
        quantity: 0,
        unit: 'kg',
        lowStockThreshold: 1,
      },
    });

  const openModal = () => {
    reset({
      name: '',
      category: ResourceCategory.Ingredients,
      quantity: 0,
      unit: 'kg',
      lowStockThreshold: 1,
    });
    setModalVisible(true);
  };

  const onSubmit = (data: KitchenResourceFormData) => {
    addResource(data);
    setModalVisible(false);
  };

  const alertCount = lowCount + emptyCount;

  return (
    <View style={styles.container}>
      {alertCount > 0 ? (
        <View style={[styles.banner, emptyCount > 0 ? styles.bannerDanger : styles.bannerWarning]}>
          <Ionicons
            name={emptyCount > 0 ? 'alert-circle' : 'warning'}
            size={18}
            color={emptyCount > 0 ? Colors.danger : Colors.warning}
          />
          <Text style={[styles.bannerText, emptyCount > 0 ? styles.dangerText : styles.warningText]}>
            {emptyCount > 0
              ? `${emptyCount} item${emptyCount !== 1 ? 's' : ''} out of stock`
              : ''}
            {emptyCount > 0 && lowCount > 0 ? ' · ' : ''}
            {lowCount > 0
              ? `${lowCount} item${lowCount !== 1 ? 's' : ''} running low`
              : ''}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <KitchenResourceItem
            resource={item}
            onPress={() => navigation.navigate('ResourceDetail', { resourceId: item.id })}
          />
        )}
        contentContainerStyle={resources.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            message="No resources tracked"
            subMessage="Tap + to add kitchen resources"
          />
        }
      />
      <FAB onPress={openModal} />

      <BottomSheet visible={modalVisible} onDismiss={() => setModalVisible(false)} title="Add Resource">
        <FormField
          control={control}
          name="name"
          label="Resource Name"
          error={errors.name}
          inputProps={{ placeholder: 'e.g. All-Purpose Flour' }}
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
              inputProps={{ placeholder: '0', keyboardType: 'decimal-pad' }}
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
          inputProps={{ placeholder: '1', keyboardType: 'decimal-pad' }}
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
          <Text style={styles.submitText}>Add Resource</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bannerWarning: { backgroundColor: Colors.warningBg },
  bannerDanger: { backgroundColor: Colors.dangerBg },
  bannerText: { fontSize: 14, fontWeight: '600', flex: 1 },
  warningText: { color: '#92400E' },
  dangerText: { color: Colors.danger },
  rowFields: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
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
