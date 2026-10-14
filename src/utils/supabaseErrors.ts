export interface ErrorMappingResult {
  message: string;
  isRateLimit: boolean;
  isEmailNotConfirmed: boolean;
  isInvalidCredentials: boolean;
  isExpiredOtp: boolean;
}

export const mapSupabaseError = (error: any): ErrorMappingResult => {
  if (!error) {
    return {
      message: '',
      isRateLimit: false,
      isEmailNotConfirmed: false,
      isInvalidCredentials: false,
      isExpiredOtp: false,
    };
  }

  const rawMessage = (error.message || '').toLowerCase();
  const errorCode = (error.code || error.error_code || '').toLowerCase();
  const status = error.status || 0;

  // Rate Limiting (429)
  if (
    status === 429 ||
    errorCode === 'over_request_rate_limit' ||
    rawMessage.includes('rate limit') ||
    rawMessage.includes('too many requests')
  ) {
    return {
      message: 'Demasiados intentos. Por favor esperá 60 segundos antes de volver a intentar.',
      isRateLimit: true,
      isEmailNotConfirmed: false,
      isInvalidCredentials: false,
      isExpiredOtp: false,
    };
  }

  // Email not confirmed
  if (
    errorCode === 'email_not_confirmed' ||
    rawMessage.includes('email not confirmed') ||
    rawMessage.includes('not confirmed')
  ) {
    return {
      message: 'El correo electrónico aún no ha sido confirmado.',
      isRateLimit: false,
      isEmailNotConfirmed: true,
      isInvalidCredentials: false,
      isExpiredOtp: false,
    };
  }

  // Invalid login credentials (anti-enumeración)
  if (
    errorCode === 'invalid_credentials' ||
    rawMessage.includes('invalid login credentials') ||
    rawMessage.includes('invalid credential')
  ) {
    return {
      message: 'Email o contraseña incorrectos.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
      isInvalidCredentials: true,
      isExpiredOtp: false,
    };
  }

  // Token / OTP expired or invalid
  if (
    errorCode === 'otp_expired' ||
    errorCode === 'bad_code_verifier' ||
    rawMessage.includes('expired') ||
    rawMessage.includes('invalid link') ||
    rawMessage.includes('token has expired')
  ) {
    return {
      message: 'El enlace de recuperación ha expirado o ya fue utilizado.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
      isInvalidCredentials: false,
      isExpiredOtp: true,
    };
  }

  // Weak password
  if (errorCode === 'weak_password' || rawMessage.includes('weak password')) {
    return {
      message: 'La contraseña es demasiado débil o no cumple con los requisitos de seguridad.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
      isInvalidCredentials: false,
      isExpiredOtp: false,
    };
  }

  // Network / connection errors
  if (
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('network request failed') ||
    rawMessage.includes('network')
  ) {
    return {
      message: 'Error de conexión. Verificá tu conexión a internet o la configuración del servidor.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
      isInvalidCredentials: false,
      isExpiredOtp: false,
    };
  }

  // Fallback seguro en español
  return {
    message: error.message || 'Ha ocurrido un error al procesar la solicitud. Intentá nuevamente.',
    isRateLimit: false,
    isEmailNotConfirmed: false,
    isInvalidCredentials: false,
    isExpiredOtp: false,
  };
};
