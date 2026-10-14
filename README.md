# iBank × Supabase — Flujo Completo de Autenticación

Aplicación móvil bancaria desarrollada con **React Native + Expo** conectada a **Supabase Auth** como Backend as a Service (BaaS), implementando fielmente el kit de diseño **iBank / FinPay Mobile Banking App** y todas las reglas de negocio y seguridad exigidas.

---

## 📱 Pantallas Implementadas

1. **01 · Iniciar Sesión (`SignInScreen`)**:
   - Email y contraseña con validación de formato.
   - Botón habilitado solo con datos válidos; estado deshabilitado + spinner de carga durante peticiones.
   - **Anti-enumeración**: Mensaje idéntico *"Email o contraseña incorrectos"* ante credenciales no válidas.
   - Redirección automática a *Confirmación pendiente* si la cuenta no ha sido verificada (`email_not_confirmed`).
   - Rate limit (429) con **cooldown visual de 60 segundos** en el botón.
   - Enlace directo a *Olvidé mi contraseña* y *Crear cuenta*.

2. **02 · Registro (`SignUpScreen`)**:
   - Nombre completo, email, contraseña y confirmación.
   - **Checklist visual interactivo en tiempo real**: longitud mínima ($\ge 8$), mayúscula, minúscula, dígito y símbolo.
   - Validación estricta de coincidencia de contraseñas.
   - **Checkbox obligatorio de Términos y Condiciones** para habilitar el envío.
   - Metadata de usuario guardada con `options.data.full_name`.
   - Redirección configurada con `options.emailRedirectTo` a `ibanktp://confirm`.
   - Mensaje neutro anti-enumeración ante reintentos de registros existentes.

3. **03 · Confirmación Pendiente (`ConfirmPendingScreen`)**:
   - Visualización del email receptor (no editable).
   - Botón *"Reenviar correo de confirmación"* conectado a `supabase.auth.resend({ type: 'signup', email })`.
   - **Cooldown de 60 segundos** entre envíos.
   - Redirección automática a Home cuando el usuario confirma su cuenta mediante el deep link.

4. **04 · Recuperar Contraseña (`ForgotPasswordScreen`)**:
   - Validación de formato de email.
   - **Anti-enumeración estricta**: Mismo mensaje de éxito exista o no el usuario en el sistema.
   - Cooldown de 60 segundos entre reintentos.
   - Deep link configurado a `ibanktp://reset-password`.

5. **05 · Nueva Contraseña (`NewPasswordScreen`)**:
   - Se abre mediante el deep link entrante (`PASSWORD_RECOVERY`).
   - Manejo de enlaces vencidos/inválidos con pantalla propia de error y opción de reintento.
   - Checklist interactivo de complejidad de contraseña y confirmación.
   - Cierre de sesión temporal tras `updateUser` y navegación a Iniciar Sesión con mensaje de confirmación exitosa.

6. **06 · Home / Dashboard Protegido (`HomeScreen`)**:
   - Visualización de la tarjeta bancaria iBank con saldo y accesos rápidos.
   - Información de la sesión de Supabase (Email verificado, UID, persistencia con AsyncStorage).
   - Botón de **Cerrar sesión** (`supabase.auth.signOut()`) con limpieza de storage y retorno seguro al Login.

---

## 🛠️ Stack Técnico

- **Framework**: React Native (0.86.3) + Expo SDK 57.
- **Backend / Auth**: `@supabase/supabase-js` (v2).
- **Almacenamiento de sesión**: `@react-native-async-storage/async-storage` (Persistencia nativa recomendada).
- **Deep Linking**: `expo-linking` (Scheme `ibanktp://`).
- **Navegación**: `@react-navigation/native` + `@react-navigation/native-stack`.
- **Iconografía**: `@expo/vector-icons` (Ionicons).
- **Tipado**: TypeScript estricto.

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio y acceder a la carpeta
```bash
cd "TP 3 LoginiBankSupabase"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` con las credenciales de tu proyecto de Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```
*(Ver la guía completa en [docs/supabase_setup.md](docs/supabase_setup.md))*

### 4. Ejecutar el proyecto
```bash
# Iniciar Expo Dev Server
npm start

# O para plataformas específicas:
npm run android
npm run ios
npm run web
```

### 5. Ejecutar pruebas automatizadas de validación
Se incluye un script de testeo automatizado para validar las reglas de negocio, complejidad de contraseña y mapeo anti-enumeración de errores:
```bash
npx tsx test/verify_rules.ts
```

---

## 🔗 Deep Links Soportados

El esquema configurado en `app.json` es `ibanktp://`:
- **Confirmación de cuenta**: `ibanktp://confirm`
- **Recuperación de contraseña**: `ibanktp://reset-password`

---

## 📂 Documentación Adicional

- [docs/supabase_setup.md](docs/supabase_setup.md): Configuración paso a paso en el panel de control de Supabase (Políticas de contraseña, Allowlist de URLs y Rate limits).
- [docs/design_decisions.md](docs/design_decisions.md): Detalle de tokens, paleta de color, tipografía y decisiones de mapeo tomadas a partir del kit iBank de Figma.
