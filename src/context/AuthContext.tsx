import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { mapSupabaseError, ErrorMappingResult } from '../utils/supabaseErrors';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  pendingConfirmEmail: string | null;
  setPendingConfirmEmail: (email: string | null) => void;
  recoveryMode: boolean;
  setRecoveryMode: (active: boolean) => void;
  recoveryError: string | null;
  setRecoveryError: (error: string | null) => void;
  globalSuccessMessage: string | null;
  setGlobalSuccessMessage: (msg: string | null) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; errorResult?: ErrorMappingResult }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; errorResult?: ErrorMappingResult }>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; errorResult?: ErrorMappingResult }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; errorResult?: ErrorMappingResult }>;
  updatePassword: (password: string) => Promise<{ success: boolean; errorResult?: ErrorMappingResult }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured] = useState<boolean>(isSupabaseConfigured());
  const [pendingConfirmEmail, setPendingConfirmEmail] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<boolean>(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState<string | null>(null);

  // Inicialización de sesión y escuchador de eventos de autenticación
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data?.session && mounted) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        // Silencioso para evitar logs sensibles
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listener de cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        if (event === 'PASSWORD_RECOVERY') {
          // Evento de recuperación de contraseña: se activa el modo de nueva contraseña
          setRecoveryMode(true);
          setRecoveryError(null);
        } else if (event === 'SIGNED_IN') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setPendingConfirmEmail(null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Manejo de Deep Links entrantes
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (!url) return;

      try {
        const parsed = Linking.parse(url);

        // Si el enlace contiene un hash con access_token (flujo implícito)
        if (url.includes('type=recovery') || url.includes('reset-password')) {
          // Si el hash contiene errores de Supabase (ej: otp_expired)
          if (url.includes('error_description') || url.includes('error=')) {
            setRecoveryMode(true);
            setRecoveryError('El enlace de recuperación ha expirado o es inválido.');
            return;
          }

          // Si viene con tokens en URL fragment (#access_token=...)
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (!error) {
                setRecoveryMode(true);
                setRecoveryError(null);
              } else {
                setRecoveryMode(true);
                setRecoveryError(mapSupabaseError(error).message);
              }
              return;
            }
          }

          // Flujo PKCE (code=...)
          const code = parsed.queryParams?.code as string | undefined;
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
              setRecoveryMode(true);
              setRecoveryError(null);
            } else {
              setRecoveryMode(true);
              setRecoveryError(mapSupabaseError(error).message);
            }
            return;
          }
        }

        // Si es enlace de confirmación de email (confirm)
        if (url.includes('confirm') || url.includes('type=signup')) {
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              setPendingConfirmEmail(null);
            }
          }
          const code = parsed.queryParams?.code as string | undefined;
          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
            setPendingConfirmEmail(null);
          }
        }
      } catch (e) {
        // Evitamos loguear información sensible
      }
    };

    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  // 6.1 Iniciar sesión — signInWithPassword
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorResult = mapSupabaseError(error);
        if (errorResult.isEmailNotConfirmed) {
          setPendingConfirmEmail(email.trim());
        }
        return { success: false, errorResult };
      }

      setSession(data.session);
      setUser(data.user);
      setPendingConfirmEmail(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, errorResult: mapSupabaseError(err) };
    }
  };

  // 6.2 Registro — signUp
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const confirmRedirectUrl = Linking.createURL('confirm');
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: confirmRedirectUrl,
        },
      });

      if (error) {
        return { success: false, errorResult: mapSupabaseError(error) };
      }

      // Con Confirm Email activo, guardar email para pantalla de confirmación pendiente
      setPendingConfirmEmail(email.trim());
      return { success: true };
    } catch (err: any) {
      return { success: false, errorResult: mapSupabaseError(err) };
    }
  };

  // 6.3 Reenviar email de confirmación
  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) {
        return { success: false, errorResult: mapSupabaseError(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, errorResult: mapSupabaseError(err) };
    }
  };

  // 6.4 Recuperar contraseña — resetPasswordForEmail
  const resetPasswordForEmail = async (email: string) => {
    try {
      const redirectTo = Linking.createURL('reset-password');
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        const errorResult = mapSupabaseError(error);
        // Si es rate limit (429), sí debemos advertir el cooldown al usuario
        if (errorResult.isRateLimit) {
          return { success: false, errorResult };
        }
        // En cualquier otro caso, regla anti-enumeración estricta de Supabase:
        // no revelar si el email existe o no, retornar siempre éxito.
      }
      return { success: true };
    } catch (err: any) {
      return { success: true }; // Anti-enumeración
    }
  };

  // 6.5 Nueva contraseña — updateUser + signOut de recuperación
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { success: false, errorResult: mapSupabaseError(error) };
      }

      // Regla de negocio 6.5: Tras un updateUser exitoso, cerrar la sesión de recuperación
      // y llevar al usuario a Login con un mensaje de éxito
      await supabase.auth.signOut();
      setRecoveryMode(false);
      setRecoveryError(null);
      setGlobalSuccessMessage('Tu contraseña ha sido actualizada con éxito. Ya podés iniciar sesión.');
      return { success: true };
    } catch (err: any) {
      return { success: false, errorResult: mapSupabaseError(err) };
    }
  };

  // 7.3 Logout — signOut
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Ignorar
    } finally {
      setSession(null);
      setUser(null);
      setRecoveryMode(false);
      setRecoveryError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isConfigured,
        pendingConfirmEmail,
        setPendingConfirmEmail,
        recoveryMode,
        setRecoveryMode,
        recoveryError,
        setRecoveryError,
        globalSuccessMessage,
        setGlobalSuccessMessage,
        signIn,
        signUp,
        resendConfirmation,
        resetPasswordForEmail,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
