import React, { useState } from 'react';
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
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Banner } from '../components/Banner';
import { HeaderBack } from '../components/HeaderBack';
import { PasswordChecklist } from '../components/PasswordChecklist';
import { TermsCheckbox } from '../components/TermsCheckbox';
import { colors, spacing, typography } from '../theme';
import { isPasswordValid } from '../utils/passwordRules';
import { useAuth } from '../context/AuthContext';

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validaciones en cliente
  const isNameValid = fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPassValid = isPasswordValid(password);
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  // Botón habilitado solo cuando TODOS los requerimientos se cumplen
  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isPassValid &&
    doPasswordsMatch &&
    termsAccepted;

  const handleSignUp = async () => {
    if (!isFormValid || loading) return;

    setLoading(true);
    setErrorMessage(null);

    const result = await signUp(fullName, email, password);

    setLoading(false);

    if (result.success) {
      // Regla 6.2: Registro exitoso navega a Confirmación pendiente
      navigation.navigate('ConfirmPending', { email: email.trim() });
    } else if (result.errorResult) {
      // Si el error es usuario existente y confirm email está activo,
      // la UI debe comportarse de forma neutra y no filtrar la existencia.
      if (
        result.errorResult.message.toLowerCase().includes('already registered') ||
        result.errorResult.message.toLowerCase().includes('already exists')
      ) {
        navigation.navigate('ConfirmPending', { email: email.trim() });
      } else {
        setErrorMessage(result.errorResult.message);
      }
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
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Completá tus datos para comenzar a operar con iBank.
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
            label="Nombre y Apellido"
            placeholder="Juan Pérez"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            leftIcon="person-outline"
            disabled={loading}
          />

          <Input
            label="Correo electrónico"
            placeholder="ejemplo@banco.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            disabled={loading}
          />

          <Input
            label="Contraseña"
            placeholder="Ingresá tu contraseña segura"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            isPassword
            leftIcon="key-outline"
            disabled={loading}
          />

          {/* Checklist interactivo en tiempo real (Regla 6.2) */}
          <PasswordChecklist password={password} />

          <Input
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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

          {/* Checkbox de Términos (Regla 6.2: obligatorio para habilitar el botón) */}
          <TermsCheckbox
            checked={termsAccepted}
            onToggle={setTermsAccepted}
            disabled={loading}
          />

          <Button
            title="Crear mi cuenta"
            onPress={handleSignUp}
            loading={loading}
            disabled={!isFormValid}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tenés una cuenta? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignIn')}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}>Iniciar sesión</Text>
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
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
