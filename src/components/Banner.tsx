import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface BannerProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onDismiss?: () => void;
}

export const Banner: React.FC<BannerProps> = ({
  type = 'error',
  message,
  onDismiss,
}) => {
  if (!message) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
          icon: 'checkmark-circle' as const,
          iconColor: '#10B981',
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
          icon: 'warning' as const,
          iconColor: '#F59E0B',
        };
      case 'info':
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          text: '#1E40AF',
          icon: 'information-circle' as const,
          iconColor: '#3B82F6',
        };
      case 'error':
      default:
        return {
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
          icon: 'alert-circle' as const,
          iconColor: '#EF4444',
        };
    }
  };

  const config = getConfig();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.iconColor}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: config.text }]}>{message}</Text>
      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          accessibilityLabel="Cerrar aviso"
        >
          <Ionicons name="close" size={18} color={config.text} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
    marginLeft: spacing.xs,
  },
});
