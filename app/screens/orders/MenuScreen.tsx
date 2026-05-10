import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Image,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { OrdersStackParamList, MenuItem, MenuCategory } from '../../types';
import { useOrderStore } from '../../stores/useOrderStore';
import { MenuItemCard } from '../../components/MenuItemCard';
import { FAB } from '../../components/FAB';
import { EmptyState } from '../../components/EmptyState';
import { BottomSheet } from '../../components/BottomSheet';
import { FormField } from '../../components/FormField';
import { CategoryPicker } from '../../components/CategoryPicker';
import { menuItemSchema, MenuItemFormData } from '../../schemas/menuItemSchema';
import { MENU_CATEGORIES } from '../../constants/categories';
import { Colors } from '../../constants/colors';

type Props = NativeStackScreenProps<OrdersStackParamList, 'Menu'>;

export function MenuScreen(_props: Props) {
  const menuItems = useOrderStore((s) => s.menuItems);
  const addMenuItem = useOrderStore((s) => s.addMenuItem);
  const updateMenuItem = useOrderStore((s) => s.updateMenuItem);
  const deleteMenuItem = useOrderStore((s) => s.deleteMenuItem);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageUri, setImageUri] = useState<string | undefined>();

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<MenuItemFormData>({
      resolver: zodResolver(menuItemSchema),
      defaultValues: { name: '', price: 0, category: MenuCategory.Mains, available: true },
    });

  const availableValue = watch('available');

  const openAdd = () => {
    setEditingItem(null);
    setImageUri(undefined);
    reset({ name: '', price: 0, category: MenuCategory.Mains, available: true });
    setModalVisible(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setImageUri(item.imageUri);
    reset({ name: item.name, price: item.price, category: item.category, available: item.available });
    setModalVisible(true);
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert('Delete Item', `Remove "${item.name}" from the menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMenuItem(item.id),
      },
    ]);
  };

  const pickImage = async (source: 'gallery' | 'camera') => {
    let result: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library access is needed.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    }
    if (!result.canceled && result.assets[0]) {
      const srcUri = result.assets[0].uri;
      const dir = `${FileSystem.documentDirectory}menu_images/`;
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const dest = `${dir}menu_${Date.now()}.jpg`;
      await FileSystem.copyAsync({ from: srcUri, to: dest });
      setImageUri(dest);
    }
  };

  const onSubmit = (data: MenuItemFormData) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, { ...data, imageUri });
    } else {
      addMenuItem({ ...data, imageUri });
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item)}
            onToggleAvailability={() => updateMenuItem(item.id, { available: !item.available })}
          />
        )}
        contentContainerStyle={menuItems.length === 0 ? styles.emptyContainer : styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <EmptyState
            icon="fast-food-outline"
            message="No menu items yet"
            subMessage="Tap + to add your first item"
          />
        }
      />
      <FAB onPress={openAdd} />

      <BottomSheet
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        {/* Image picker */}
        <Text style={styles.imageLabel}>Photo (optional)</Text>
        <View style={styles.imageRow}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={32} color={Colors.textDisabled} />
            </View>
          )}
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage('gallery')}>
              <Ionicons name="images-outline" size={18} color={Colors.primary} />
              <Text style={styles.imageBtnText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageBtn} onPress={() => pickImage('camera')}>
              <Ionicons name="camera-outline" size={18} color={Colors.primary} />
              <Text style={styles.imageBtnText}>Camera</Text>
            </TouchableOpacity>
            {imageUri ? (
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={() => setImageUri(undefined)}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                <Text style={[styles.imageBtnText, { color: Colors.danger }]}>Remove</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <FormField
          control={control}
          name="name"
          label="Item Name"
          error={errors.name}
          inputProps={{ placeholder: 'e.g. Margherita Pizza' }}
        />
        <FormField
          control={control}
          name="price"
          label="Price ($)"
          error={errors.price}
          inputProps={{ placeholder: '0.00', keyboardType: 'decimal-pad' }}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange } }) => (
            <CategoryPicker
              label="Category"
              options={MENU_CATEGORIES}
              value={value}
              onChange={onChange}
              error={errors.category?.message}
            />
          )}
        />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available</Text>
          <Controller
            control={control}
            name="available"
            render={({ field: { value, onChange } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: Colors.border, true: Colors.primary + '66' }}
                thumbColor={value ? Colors.primary : Colors.textDisabled}
              />
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>{editingItem ? 'Save Changes' : 'Add to Menu'}</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  grid: { padding: 8, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  columnWrapper: { justifyContent: 'flex-start' },
  imageLabel: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 14 },
  imagePreview: { width: 80, height: 80, borderRadius: 10, backgroundColor: Colors.surface },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageButtons: { flex: 1, gap: 8 },
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  imageBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
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
