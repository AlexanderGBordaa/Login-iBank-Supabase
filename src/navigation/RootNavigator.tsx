import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { ConfirmPendingScreen } from '../screens/ConfirmPendingScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { NewPasswordScreen } from '../screens/NewPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

// Configuración de Deep Linking para Expo / React Navigation
const linking = {
  prefixes: [Linking.createURL('/'), 'ibanktp://'],
  config: {
    screens: {
      ConfirmPending: 'confirm',
      NewPassword: 'reset-password',
      SignIn: 'login',
      SignUp: 'signup',
      Home: 'home',
    },
  },
};

export const RootNavigator: React.FC = () => {
  const { session, isLoading, recoveryMode } = useAuth();

  // Regla 7.2: Mientras se resuelve la sesión, mostrar pantalla de carga (sin parpadeo de login)
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet" size={40} color={colors.primary} />
        </View>
        <Text style={styles.splashBrand}>iBank</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
        <Text style={styles.splashText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {recoveryMode ? (
          // Si estamos en modo de recuperación por deep link, mostramos Nueva Contraseña
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        ) : session ? (
          // Regla 7.2: Con sesión válida, pantallas de auth inaccesibles -> va a Home
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Regla 7.2: Sin sesión, pantallas de autenticación
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmPending" component={ConfirmPendingScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 24,
  },
  splashText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
