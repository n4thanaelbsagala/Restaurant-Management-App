import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { OrdersStackParamList, OrderStatus, OrderItem } from '../../types';
import { useOrderStore } from '../../stores/useOrderStore';
import { OrderCard } from '../../components/OrderCard';
import { FAB } from '../../components/FAB';
import { EmptyState } from '../../components/EmptyState';
import { BottomSheet } from '../../components/BottomSheet';
import { FormField } from '../../components/FormField';
import { orderSchema, OrderFormData } from '../../schemas/orderSchema';
import { formatCurrency } from '../../utils/currency';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrdersList'>;

export function OrdersScreen({ navigation }: Props) {
  const orders = useOrderStore((s) => s.orders);
  const menuItems = useOrderStore((s) => s.menuItems);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  const { control, handleSubmit, reset, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { tableNumber: '' },
  });

  const availableItems = useMemo(() => menuItems.filter((m) => m.available), [menuItems]);

  const orderTotal = useMemo(() => {
    let total = 0;
    selectedItems.forEach((qty, id) => {
      const item = menuItems.find((m) => m.id === id);
      if (item) total += item.price * qty;
    });
    return total;
  }, [selectedItems, menuItems]);

  const sortedOrders = useMemo(() => {
    const priority: Record<OrderStatus, number> = {
      [OrderStatus.Pending]: 0,
      [OrderStatus.InProgress]: 1,
      [OrderStatus.Completed]: 2,
      [OrderStatus.Cancelled]: 3,
    };
    return [...orders].sort((a, b) => {
      const diff = priority[a.status] - priority[b.status];
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders]);

  const addItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) ?? 0) + 1);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const qty = next.get(id) ?? 0;
      if (qty <= 1) next.delete(id);
      else next.set(id, qty - 1);
      return next;
    });
  }, []);

  const openModal = () => {
    reset({ tableNumber: '' });
    setSelectedItems(new Map());
    setModalVisible(true);
  };

  const onSubmit = (data: OrderFormData) => {
    if (selectedItems.size === 0) {
      Alert.alert('No items', 'Please select at least one menu item.');
      return;
    }
    const items: OrderItem[] = [];
    selectedItems.forEach((qty, id) => {
      const menuItem = menuItems.find((m) => m.id === id);
      if (menuItem) {
        items.push({ menuItemId: id, name: menuItem.name, quantity: qty, unitPrice: menuItem.price });
      }
    });
    addOrder({ tableNumber: data.tableNumber, items });
    setModalVisible(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Menu')}
          style={styles.headerBtn}
        >
          <Ionicons name="grid-outline" size={22} color={Colors.primary} />
          <Text style={styles.headerBtnText}>Menu</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          />
        )}
        contentContainerStyle={sortedOrders.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            message="No orders yet"
            subMessage="Tap + to add your first order"
          />
        }
        ListHeaderComponent={
          <Text style={styles.sectionHeader}>
            {sortedOrders.length} Order{sortedOrders.length !== 1 ? 's' : ''}
          </Text>
        }
      />
      <FAB onPress={openModal} />

      <BottomSheet visible={modalVisible} onDismiss={() => setModalVisible(false)} title="New Order">
        <FormField
          control={control}
          name="tableNumber"
          label="Table Number"
          error={errors.tableNumber}
          inputProps={{ placeholder: 'e.g. 5 or Patio 2', keyboardType: 'default' }}
        />
        <Text style={styles.sectionLabel}>Select Items</Text>
        {availableItems.length === 0 ? (
          <Text style={styles.noItemsText}>
            No available menu items. Add items in the Menu tab first.
          </Text>
        ) : (
          availableItems.map((item) => {
            const qty = selectedItems.get(item.id) ?? 0;
            return (
              <View key={item.id} style={styles.menuItemRow}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemPrice}>{formatCurrency(item.price)}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    disabled={qty === 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="remove-circle"
                      size={28}
                      color={qty > 0 ? Colors.primary : Colors.textDisabled}
                    />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{qty}</Text>
                  <TouchableOpacity
                    onPress={() => addItem(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="add-circle" size={28} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
        {selectedItems.size > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(orderTotal)}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)} activeOpacity={0.85}>
          <Text style={styles.submitText}>Place Order</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 100 },
  emptyContainer: { flex: 1, paddingBottom: 80 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  headerBtnText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 4,
  },
  noItemsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  menuItemPrice: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyText: { fontSize: 16, fontWeight: '700', color: Colors.text, minWidth: 20, textAlign: 'center' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    marginTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
