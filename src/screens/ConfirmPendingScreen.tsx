import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Banner } from '../components/Banner';
import { HeaderBack } from '../components/HeaderBack';
import { colors, spacing, typography } from '../theme';
import { useAuth } from '../context/AuthContext';

interface ConfirmPendingScreenProps {
  route: any;
  navigation: any;
}

export const ConfirmPendingScreen: React.FC<ConfirmPendingScreenProps> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { resendConfirmation, pendingConfirmEmail } = useAuth();

  // El email puede venir por parámetro de navegación o por el contexto
  const email = route.params?.email || pendingConfirmEmail || 'tu correo';

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (loading || cooldown > 0 || !email) return;

    setLoading(true);
    setFeedback(null);

    const result = await resendConfirmation(email);

    setLoading(false);

    if (result.success) {
      setCooldown(60); // Cooldown de 60 segundos por regla de negocio
      setFeedback({
        type: 'success',
        message: '¡Correo reenviado con éxito! Revisá tu bandeja de entrada o spam.',
      });
    } else if (result.errorResult) {
      if (result.errorResult.isRateLimit) {
        setCooldown(60);
      }
      setFeedback({
        type: 'error',
        message: result.errorResult.message,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <HeaderBack onBack={() => navigation.navigate('SignIn')} />

      <ScrollView contentContainerStyle={styles.content}>
        {feedback ? (
          <Banner
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        ) : null}

        <View style={styles.iconContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="mail-open-outline" size={48} color={colors.primary} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Confirmá tu correo</Text>
        <Text style={styles.subtitle}>
          Te hemos enviado un enlace de confirmación para activar tu cuenta a:
        </Text>

        {/* Email no editable */}
        <View style={styles.emailBadge}>
          <Ionicons name="mail" size={16} color={colors.primary} style={styles.emailIcon} />
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <Text style={styles.instructions}>
          Hacé clic en el enlace dentro del correo para verificar tu cuenta. Si no lo recibiste,
          revisá tu carpeta de correo no deseado o solicitá un reenvío.
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            title="Reenviar correo de confirmación"
            onPress={handleResend}
            loading={loading}
            cooldownSeconds={cooldown}
            style={styles.resendButton}
          />

          <Button
            title="Volver a iniciar sesión"
            variant="outline"
            onPress={() => navigation.navigate('SignIn')}
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF0FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  emailIcon: {
    marginRight: spacing.xs,
  },
  emailText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  instructions: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  buttonGroup: {
    width: '100%',
  },
  resendButton: {
    marginBottom: spacing.md,
  },
  backButton: {
    borderWidth: 1.5,
  },
});
