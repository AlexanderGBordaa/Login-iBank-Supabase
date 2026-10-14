import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkPasswordCriteria } from '../utils/passwordRules';
import { colors, spacing } from '../theme';

interface PasswordChecklistProps {
  password: string;
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const criteria = checkPasswordCriteria(password);

  const items = [
    { key: 'minLength', label: 'Mínimo 8 caracteres', satisfied: criteria.minLength },
    { key: 'hasUppercase', label: 'Al menos una mayúscula (A-Z)', satisfied: criteria.hasUppercase },
    { key: 'hasLowercase', label: 'Al menos una minúscula (a-z)', satisfied: criteria.hasLowercase },
    { key: 'hasNumber', label: 'Al menos un número (0-9)', satisfied: criteria.hasNumber },
    { key: 'hasSymbol', label: 'Al menos un símbolo especial (!@#$%^&*)', satisfied: criteria.hasSymbol },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisitos de la contraseña:</Text>
      {items.map((item) => (
        <View key={item.key} style={styles.itemRow}>
          <Ionicons
            name={item.satisfied ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={item.satisfied ? colors.success : colors.textMuted}
            style={styles.icon}
          />
          <Text
            style={[
              styles.itemText,
              item.satisfied && styles.satisfiedText,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    marginRight: spacing.sm,
  },
  itemText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  satisfiedText: {
    color: colors.success,
    fontWeight: '500',
  },
});
