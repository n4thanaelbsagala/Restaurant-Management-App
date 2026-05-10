import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface CategoryPickerProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function CategoryPicker({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select…',
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, error ? styles.selectorError : null]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectorText, !value ? styles.placeholder : null]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item === value ? styles.optionSelected : null]}
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionText, item === value ? styles.optionTextSelected : null]}>
                  {item}
                </Text>
                {item === value ? (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                ) : null}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  selector: {
    height: 46,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
  },
  selectorError: { borderColor: Colors.danger },
  selectorText: { fontSize: 15, color: Colors.text },
  placeholder: { color: Colors.textDisabled },
  errorText: { marginTop: 4, fontSize: 12, color: Colors.danger },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.overlay },
  menu: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingBottom: 8,
    maxHeight: 320,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionSelected: { backgroundColor: '#FFF3EC' },
  optionText: { fontSize: 15, color: Colors.text },
  optionTextSelected: { color: Colors.primary, fontWeight: '600' },
});
