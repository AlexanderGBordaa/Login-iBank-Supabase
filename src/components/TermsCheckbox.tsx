import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: (newValue: boolean) => void;
  disabled?: boolean;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onToggle,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => onToggle(!checked)}
        style={[
          styles.checkbox,
          checked && styles.checkedCheckbox,
          disabled && styles.disabledCheckbox,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
      >
        {checked ? (
          <Ionicons name="checkmark" size={16} color={colors.white} />
        ) : null}
      </TouchableOpacity>

      <View style={styles.labelContainer}>
        <Text style={styles.text}>
          Acepto los{' '}
          <Text style={styles.linkText}>Términos y Condiciones</Text> y la{' '}
          <Text style={styles.linkText}>Política de Privacidad</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabledCheckbox: {
    opacity: 0.5,
  },
  labelContainer: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
