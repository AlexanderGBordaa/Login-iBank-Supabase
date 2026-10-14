import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  cooldownSeconds?: number;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  cooldownSeconds = 0,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const isCooldownActive = cooldownSeconds > 0;
  const isEffectivelyDisabled = disabled || loading || isCooldownActive;

  const displayTitle = isCooldownActive
    ? `Reintentar en ${cooldownSeconds}s`
    : title;

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'secondary':
        return [
          styles.base,
          styles.secondary,
          isEffectivelyDisabled && styles.secondaryDisabled,
          style,
        ];
      case 'outline':
        return [
          styles.base,
          styles.outline,
          isEffectivelyDisabled && styles.outlineDisabled,
          style,
        ];
      case 'text':
        return [styles.baseTextOnly, style];
      case 'primary':
      default:
        return [
          styles.base,
          styles.primary,
          isEffectivelyDisabled && styles.primaryDisabled,
          style,
        ];
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'secondary':
        return [
          styles.text,
          styles.secondaryText,
          isEffectivelyDisabled && styles.disabledText,
          textStyle,
        ];
      case 'outline':
        return [
          styles.text,
          styles.outlineText,
          isEffectivelyDisabled && styles.disabledText,
          textStyle,
        ];
      case 'text':
        return [
          styles.text,
          styles.textOnly,
          isEffectivelyDisabled && styles.disabledText,
          textStyle,
        ];
      case 'primary':
      default:
        return [
          styles.text,
          styles.primaryText,
          isEffectivelyDisabled && styles.primaryDisabledText,
          textStyle,
        ];
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isEffectivelyDisabled}
      style={getContainerStyle()}
      accessibilityRole="button"
      accessibilityState={{ disabled: isEffectivelyDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{displayTitle}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  baseTextOnly: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryDisabled: {
    backgroundColor: '#C7CEFA',
    shadowOpacity: 0,
    elevation: 0,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  secondaryDisabled: {
    backgroundColor: colors.disabled,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineDisabled: {
    borderColor: colors.disabled,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
  },
  primaryDisabledText: {
    color: '#EEF2FF',
  },
  secondaryText: {
    color: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  textOnly: {
    color: colors.primary,
    fontSize: 14,
  },
  disabledText: {
    color: colors.disabledText,
  },
});
