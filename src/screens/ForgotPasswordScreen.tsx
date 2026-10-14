import React, { useState, useEffect } from 'react';
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
import { colors, spacing, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordScreenProps {
  route: any;
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { resetPasswordForEmail } = useAuth();

  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [successSent, setSuccessSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Regla 6.4: Único campo email. Validar solo formato, nada más.
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleReset = async () => {
    if (!isEmailValid || loading || cooldown > 0) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await resetPasswordForEmail(email);

    setLoading(false);

    if (result.success) {
      // Regla 6.4: Cooldown de 60 segundos entre reintentos
      setCooldown(60);
      // Regla de anti-enumeración no negociable: mismo mensaje siempre
      setSuccessSent(true);
    } else if (result.errorResult) {
      if (result.errorResult.isRateLimit) {
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
      <View style={{ paddingTop: insets.top }}>
        <HeaderBack onBack={() => navigation.goBack()} />
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
            <Ionicons name="key-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Recuperar contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresá tu correo electrónico registrado y te enviaremos las instrucciones para restablecer tu acceso.
          </Text>
        </View>

        {errorMessage ? (
          <Banner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
          />
        ) : null}

        {/* Regla 6.4: Mensaje neutro anti-enumeración */}
        {successSent ? (
          <Banner
            type="success"
            message="Si el correo electrónico existe en nuestro sistema, vas a recibir las instrucciones para restablecer tu contraseña."
          />
        ) : null}

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

          <Button
            title="Enviar instrucciones"
            onPress={handleReset}
            loading={loading}
            disabled={!isEmailValid}
            cooldownSeconds={cooldown}
            style={styles.submitButton}
          />

          <Button
            title="Volver a iniciar sesión"
            variant="text"
            onPress={() => navigation.navigate('SignIn')}
            disabled={loading}
            style={styles.backLink}
          />
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
    paddingHorizontal: spacing.sm,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  backLink: {
    marginTop: spacing.xs,
  },
});
