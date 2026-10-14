# Configuración de Supabase — iBank Auth

Este documento detalla la configuración requerida en el **Dashboard de Supabase** para el correcto funcionamiento del flujo de autenticación de iBank, conforme a la Sección 08 y los requerimientos de seguridad del Trabajo Práctico.

---

## 1. Authentication > Providers > Email

- **Enable Email provider**: `Activado`
- **Confirm email**: `Activado` (Requerido en producción para validar cuentas reales y prevenir cuentas falsas; en desarrollo local permite probar el flujo de `ConfirmPendingScreen`).
- **Secure email change**: `Activado`
- **Enable Email signup**: `Activado`

---

## 2. Authentication > Password Security & Policy

Configuración de la política de contraseñas alineada a las validaciones del cliente (`src/utils/passwordRules.ts`):

| Requisito | Valor Configurado | Explicación |
| :--- | :--- | :--- |
| **Minimum password length** | `8` | Supabase recomienda un piso no menor a 8 caracteres. |
| **Require lowercase letters** | `Activado` (`a-z`) | Exige al menos una minúscula. |
| **Require uppercase letters** | `Activado` (`A-Z`) | Exige al menos una mayúscula. |
| **Require digits** | `Activado` (`0-9`) | Exige al menos un número. |
| **Require symbols** | `Activado` (`!@#$%^&*...`) | Exige al menos un símbolo especial. |
| **Leaked password protection** | `Activado` (HaveIBeenPwned) | Bloquea contraseñas que hayan sido filtradas en brechas de seguridad conocidas. |

---

## 3. URL Configuration (Redirect URLs & Deep Links)

Para que los deep links funcionen de punta a punta tanto en emuladores como en dispositivos físicos, se deben configurar los schemes de la app en **Authentication > URL Configuration**:

- **Site URL**:
  `ibanktp://` (o la URL de desarrollo de tu entorno)
- **Redirect URLs (Allowlist)**:
  - `ibanktp://*`
  - `ibanktp://confirm` (Confirmación de email tras registro)
  - `ibanktp://reset-password` (Restablecimiento de contraseña tras recuperación)
  - `exp://*` (Para pruebas dentro de Expo Go en desarrollo local)

---

## 4. Rate Limiting & Cooldowns

En **Project Settings > Authentication > Rate Limits**:
- **Email rate limit**: `30 per hour` (o según proveedor SMTP configurado).
- **Password reset / resend limit**: `60 segundos` por usuario/email. La aplicación en el cliente replica este límite mediante un cooldown visual interactivo en `SignInScreen`, `ConfirmPendingScreen` y `ForgotPasswordScreen`.
- **OTP / Link expiration**: `3600 segundos` (1 hora). Enlaces más viejos de 1 hora son rechazados y la pantalla `NewPasswordScreen` presenta el estado de error de enlace expirado con opción de reintento.

---

## 5. Variables de Entorno

En el archivo `.env` del proyecto móvil:
```env
EXPO_PUBLIC_SUPABASE_URL=https://<TU_PROYECTO>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<TU_ANON_KEY_PUBLICA>
```
*Nota de seguridad:* Solo la anon key pública debe incluirse en la app cliente. La `service_role` jamás debe agregarse ni exponerse en el código móvil.
