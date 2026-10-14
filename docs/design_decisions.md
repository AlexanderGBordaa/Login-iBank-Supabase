# Decisiones de Diseño y Mapeo Figma — iBank UI Kit

Este documento describe las decisiones de arquitectura visual, mapeo de tokens desde el archivo Figma (*iBank — Banking & E-Money Management App / FinPay*) y las adaptaciones implementadas en el proyecto React Native.

---

## 1. Tokens de Diseño y Paleta de Colores

| Token | Valor Hex / Estilo | Uso en iBank |
| :--- | :--- | :--- |
| **Primary** | `#3B46F1` | Color corporativo de la marca iBank; usado en botones principales (CTA), iconos destacados, estados de foco activo y tarjeta principal. |
| **Primary Dark / Pressed** | `#2B35D2` | Estado presionado de botones y textos de énfasis bancario. |
| **Primary Light / Background icon** | `#EEF0FD` | Fondos circulares de iconos y banners suaves. |
| **Background App** | `#F8F9FD` | Fondo general de las pantallas (soft grayish off-white), característico de aplicaciones Fintech modernas. |
| **Card / Surface** | `#FFFFFF` | Contenedores de formularios, tarjetas de saldo y modales con elevación suave. |
| **Text Primary** | `#111827` | Encabezados y títulos en peso Bold (24-26px). |
| **Text Secondary** | `#6B7280` | Subtítulos descriptivos e instrucciones. |
| **Text Muted / Placeholders** | `#9CA3AF` | Placeholders de inputs y estados inactivos. |
| **Borders** | `#E5E7EB` | Bordes sutiles en inputs y divisores. |
| **Border Focus** | `#3B46F1` | Borde al enfocar un campo de texto para accesibilidad visual. |
| **Success** | `#10B981` | Checks del checklist de contraseñas y mensajes de éxito. |
| **Error / Alert** | `#EF4444` | Bordes de inputs erróneos y alertas de error. |

---

## 2. Componentes Reutilizables y Adaptaciones

### Botones Principales (`Button.tsx`)
- **Figma:** Botones con formato pastilla/píldora (`borderRadius: 28-30px`, altura ~54px) con texto bold blanco centrado y sombra sutil.
- **Implementación:** Reproducido con `borderRadius.pill: 30`, sombra suave con elevación nativa, estados `disabled`, estado `loading` con `ActivityIndicator` y cuenta regresiva de cooldown en segundos para respetar los rate limits de Supabase.

### Campos de Texto (`Input.tsx`)
- **Figma:** Inputs redondeados (`borderRadius: 12-16px`) con icono representativo a la izquierda y selector de visibilidad de contraseña (ojo) a la derecha.
- **Implementación:** Soporte completo de iconos vectoriales `@expo/vector-icons`, estados dinámicos de borde (Focus `#3B46F1`, Error `#EF4444`, Default `#E5E7EB`), deshabilitación de inputs durante llamadas de red activas (evitando modificaciones mientras carga) y toggle interactivo de contraseña.

### Checklist de Complejidad (`PasswordChecklist.tsx`)
- **Figma & Regla 6.2:** Evaluación interactiva en tiempo real mientras el usuario tipea.
- **Implementación:** 5 reglas evaluadas instantáneamente con iconos dinámicos (círculo gris cuando está pendiente y check verde esmeralda con texto destacado cuando se satisface).

### Checkbox de Términos y Condiciones (`TermsCheckbox.tsx`)
- **Figma & Regla 6.2:** Control cuadrado redondeado con check central y texto que incluye links a Términos y Privacidad.

---

## 3. Navegación y Rutas Protegidas

- **Resolución de Sesión sin Flicker:** Implementación de pantalla Splash / Loader con isotipo de iBank mientras `supabase.auth.getSession()` determina el estado de persistencia inicial.
- **Separación de Stacks:**
  - Sin sesión activa: Flujo público (`SignIn`, `SignUp`, `ConfirmPending`, `ForgotPassword`, `NewPassword`).
  - Con sesión activa: Acceso directo a `HomeScreen` (impidiendo volver a Login).
  - En evento de recuperación (`PASSWORD_RECOVERY` vía deep link): Renderiza `NewPasswordScreen` prioritariamente.

---

## 4. Elementos Fuera de Alcance

Conforme a la consigna oficial:
- **Biometría / PIN local:** Excluidos de este TP, reservado para entregas futuras.
- **Social Login (Google, Apple):** Excluido; el TP se focaliza 100% en el flujo de credenciales por email + contraseña y seguridad de autenticación.
- **OTP por SMS / Segundo Factor:** Excluido; la verificación se realiza mediante correo electrónico y deep links.
