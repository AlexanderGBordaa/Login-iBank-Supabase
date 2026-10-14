import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Banner } from '../components/Banner';
import { HeaderBack } from '../components/HeaderBack';
import { PasswordChecklist } from '../components/PasswordChecklist';
import { colors, spacing, typography } from '../theme';
import { isPasswordValid } from '../utils/passwordRules';
import { useAuth } from '../context/AuthContext';

interface NewPasswordScreenProps {
  navigation: any;
}

export const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    updatePassword,
    recoveryError,
    setRecoveryMode,
    setRecoveryError,
  } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validación de contraseña idéntica a Registro
  const isPassValid = isPasswordValid(password);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isPassValid && doPasswordsMatch;

  const handleUpdate = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await updatePassword(password);

    setLoading(false);

    if (result.success) {
      // Regla 6.5: Tras updateUser exitoso, AuthContext ya ejecuta signOut(),
      // limpia recoveryMode y setea globalSuccessMessage.
      // Navegamos a Iniciar Sesión.
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } else if (result.errorResult) {
      setErrorMessage(result.errorResult.message);
    }
  };

  // Regla 6.5: Si el link llegó vencido o inválido, mostrar un estado de error
  // propio con un link para volver a pedir el reset, NUNCA el formulario vacío.
  if (recoveryError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView contentContainerStyle={styles.errorContent}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={54} color={colors.error} />
          </View>
          <Text style={styles.errorTitle}>Enlace expirado o inválido</Text>
          <Text style={styles.errorSubtitle}>
            {recoveryError ||
              'El enlace para restablecer tu contraseña no es válido o ya ha expirado. Por favor, solicitá un nuevo enlace.'}
          </Text>

          <Button
            title="Solicitar nuevo enlace"
            onPress={() => {
              setRecoveryError(null);
              setRecoveryMode(false);
              navigation.navigate('ForgotPassword');
            }}
            style={styles.errorButton}
          />

          <Button
            title="Ir al inicio de sesión"
            variant="outline"
            onPress={() => {
              setRecoveryError(null);
              setRecoveryMode(false);
              navigation.navigate('SignIn');
            }}
            style={styles.errorSecondaryButton}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <View style={{ paddingTop: insets.top }}>
        <HeaderBack onBack={() => navigation.navigate('SignIn')} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-open-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Nueva contraseña</Text>
          <Text style={styles.subtitle}>
            Creá una nueva contraseña segura para tu cuenta iBank.
          </Text>
        </View>

        {errorMessage ? (
          <Banner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        <View style={styles.form}>
          <Input
            label="Nueva contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage(null);
            }}
            secureTextEntry
            isPassword
            leftIcon="key-outline"
            disabled={loading}
          />

          {/* Checklist de complejidad en tiempo real */}
          <PasswordChecklist password={password} />

          <Input
            label="Confirmar nueva contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errorMessage) setErrorMessage(null);
            }}
            secureTextEntry
            isPassword
            leftIcon="shield-checkmark-outline"
            disabled={loading}
            error={
              confirmPassword.length > 0 && !doPasswordsMatch
                ? 'Las contraseñas no coinciden'
                : undefined
            }
          />

          <Button
            title="Actualizar contraseña"
            onPress={handleUpdate}
            loading={loading}
            disabled={!isFormValid}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.md,
  },
  errorContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  errorTitle: {
    ...typography.title,
    textAlign: 'center',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  errorSubtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  errorButton: {
    width: '100%',
    marginBottom: spacing.md,
  },
  errorSecondaryButton: {
    width: '100%',
  },
});
