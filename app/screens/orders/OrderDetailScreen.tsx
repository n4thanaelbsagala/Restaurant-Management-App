import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { OrdersStackParamList, OrderStatus } from '../../types';
import { useOrderStore } from '../../stores/useOrderStore';
import { StatusBadge } from '../../components/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { formatDate, formatTime } from '../../utils/date';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

type StatusTransition = { status: OrderStatus; label: string; color: string };

const STATUS_TRANSITIONS: Record<OrderStatus, StatusTransition[]> = {
  [OrderStatus.Pending]: [
    { status: OrderStatus.InProgress, label: 'Start Order', color: Colors.primary },
    { status: OrderStatus.Cancelled, label: 'Cancel', color: Colors.danger },
  ],
  [OrderStatus.InProgress]: [
    { status: OrderStatus.Completed, label: 'Complete Order', color: Colors.income },
    { status: OrderStatus.Cancelled, label: 'Cancel', color: Colors.danger },
  ],
  [OrderStatus.Completed]: [],
  [OrderStatus.Cancelled]: [],
};

export function OrderDetailScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const orders = useOrderStore((s) => s.orders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Order not found.</Text>
      </View>
    );
  }

  const transitions = STATUS_TRANSITIONS[order.status];

  const handleDelete = () => {
    Alert.alert('Delete Order', 'This will permanently remove the order. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteOrder(order.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.tableTag}>
            <Ionicons name="grid-outline" size={16} color={Colors.primary} />
            <Text style={styles.tableTxt}>Table {order.tableNumber}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaTxt}>
            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </Text>
        </View>
      </View>

      {/* Items */}
      <Text style={styles.sectionTitle}>Items</Text>
      <View style={styles.card}>
        {order.items.map((item, idx) => (
          <View
            key={`${item.menuItemId}-${idx}`}
            style={[styles.itemRow, idx < order.items.length - 1 ? styles.itemBorder : null]}
          >
            <Text style={styles.itemQty}>{item.quantity}×</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice * item.quantity)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
        </View>
      </View>

      {/* Status actions */}
      {transitions.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <View style={styles.actionsRow}>
            {transitions.map((t) => (
              <TouchableOpacity
                key={t.status}
                style={[styles.actionBtn, { borderColor: t.color, flex: 1 }]}
                onPress={() => updateOrderStatus(order.id, t.status)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionBtnText, { color: t.color }]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Delete Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 16, color: Colors.textSecondary },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tableTxt: { fontSize: 18, fontWeight: '700', color: Colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { fontSize: 13, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemQty: { fontSize: 14, fontWeight: '700', color: Colors.primary, width: 30 },
  itemName: { flex: 1, fontSize: 15, color: Colors.text },
  itemPrice: { fontSize: 15, fontWeight: '600', color: Colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  actionBtn: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    marginTop: 8,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '600', color: Colors.danger },
});
