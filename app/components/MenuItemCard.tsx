import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../types';
import { formatCurrency } from '../utils/currency';
import { Colors } from '../constants/colors';
import { MENU_CATEGORY_ICONS } from '../constants/categories';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: MenuItemCardProps) {
  return (
    <View style={[styles.card, !item.available ? styles.cardDimmed : null]}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={36} color={Colors.textDisabled} />
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.categoryRow}>
          <Ionicons
            name={MENU_CATEGORY_ICONS[item.category] as keyof typeof Ionicons.glyphMap}
            size={13}
            color={Colors.primary}
          />
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        <View style={styles.footer}>
          <Switch
            value={item.available}
            onValueChange={onToggleAvailability}
            trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
            thumbColor={item.available ? Colors.primary : Colors.textDisabled}
            style={styles.switch}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
        {!item.available ? (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    overflow: 'hidden',
    flex: 1,
    margin: 6,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardDimmed: {
    opacity: 0.55,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.surface,
  },
  imagePlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    padding: 4,
  },
  unavailableBadge: {
    marginTop: 6,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    alignSelf: 'flex-start',
  },
  unavailableText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
