import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Banner } from '../components/Banner';
import { colors, spacing, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    signIn,
    globalSuccessMessage,
    setGlobalSuccessMessage,
    isConfigured,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Validación en cliente: email con formato válido y contraseña no vacía
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isEmailValid && password.trim().length > 0;

  // Temporizador para el cooldown visual (60s)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSignIn = async () => {
    if (!isFormValid || loading || cooldown > 0) return;

    setLoading(true);
    setErrorMessage(null);
    setGlobalSuccessMessage(null);

    const result = await signIn(email, password);

    setLoading(false);

    if (!result.success && result.errorResult) {
      if (result.errorResult.isEmailNotConfirmed) {
        // Regla 6.1: Redirigir a Confirmación pendiente en lugar de error suelto
        navigation.navigate('ConfirmPending', { email: email.trim() });
        return;
      }

      if (result.errorResult.isRateLimit) {
        // Regla 6.1: Error 429 activa cooldown de 60 segundos
        setCooldown(60);
      }

      setErrorMessage(result.errorResult.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {!isConfigured && (
          <Banner
            type="warning"
            message="Supabase no está configurado aún. Agregá tu URL y Anon Key en el archivo .env."
          />
        )}

        {globalSuccessMessage ? (
          <Banner
            type="success"
            message={globalSuccessMessage}
            onDismiss={() => setGlobalSuccessMessage(null)}
          />
        ) : null}

        {errorMessage ? (
          <Banner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        {/* Hero & Logo iBank */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>
            ¡Hola de nuevo! Ingresá a tu cuenta iBank para continuar.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Input
            label="Correo electrónico"
            placeholder="ejemplo@banco.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            disabled={loading}
          />

          <Input
            label="Contraseña"
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

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword', { email })}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Botón Iniciar Sesión con regla 6.1 (disabled si no es válido, loading spinner, cooldown) */}
          <Button
            title="Iniciar sesión"
            onPress={handleSignIn}
            loading={loading}
            disabled={!isFormValid}
            cooldownSeconds={cooldown}
            style={styles.submitButton}
          />
        </View>

        {/* Footer Link a Registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tenés una cuenta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    paddingHorizontal: spacing.md,
  },
  form: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.xs,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
