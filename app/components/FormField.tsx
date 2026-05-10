import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { Colors } from '../constants/colors';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: FieldError;
  inputProps?: TextInputProps;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  inputProps,
}: FormFieldProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value !== undefined && value !== null ? String(value) : ''}
            placeholderTextColor={Colors.textDisabled}
            {...inputProps}
          />
        )}
      />
      {error ? <Text style={styles.errorText}>{error.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.danger,
  },
});
