import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useAuth } from '../context/AuthContext';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const fullName = user?.user_metadata?.full_name || 'Usuario iBank';
  const email = user?.email || 'usuario@banco.com';

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{fullName}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjeta Bancaria iBank (estilo Figma) */}
        <View style={styles.bankCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>Cuenta Corriente</Text>
            <Ionicons name="card" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceValue}>$ 1,460.50</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardNumber}>•••• •••• •••• 4589</Text>
            <Text style={styles.cardBrand}>iBank Pay</Text>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#EEF0FD' }]}>
              <Ionicons name="arrow-up" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="arrow-down" size={22} color={colors.success} />
            </View>
            <Text style={styles.actionLabel}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="receipt-outline" size={22} color={colors.warning} />
            </View>
            <Text style={styles.actionLabel}>Servicios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="grid-outline" size={22} color="#9333EA" />
            </View>
            <Text style={styles.actionLabel}>Más</Text>
          </TouchableOpacity>
        </View>

        {/* Ficha de Información de Autenticación Supabase */}
        <View style={styles.authInfoCard}>
          <View style={styles.authInfoHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.authInfoTitle}>Sesión Activa con Supabase</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email verificado:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UID:</Text>
            <Text style={styles.infoValueUid} numberOfLines={1}>
              {user?.id || 'id-demo'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Persistencia:</Text>
            <Text style={styles.infoValue}>AsyncStorage (Activa)</Text>
          </View>
        </View>

        {/* Botón Logout (Regla 7.3) */}
        <Button
          title="Cerrar sesión"
          variant="outline"
          onPress={signOut}
          style={styles.logoutButton}
          textStyle={{ color: colors.error }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  bankCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: spacing.lg,
    marginVertical: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardType: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceLabel: {
    color: '#C7D2FE',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cardNumber: {
    color: '#E0E7FF',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  authInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: spacing.xl,
  },
  authInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  authInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  infoValueUid: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    maxWidth: '60%',
  },
  logoutButton: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
});
