# Guía Completa para Publicar "Astro Esquiva" en Google Play Store 🚀

Esta guía contiene todos los pasos, requisitos y comandos necesarios para compilar el juego en formato nativo Android (`.aab` / `.apk`) y distribuirlo a través de la Google Play Store.

---

## 1. Requisitos Previos

1. **Cuenta de Desarrollador de Google Play**:
   - Registro en [Google Play Console](https://play.google.com/console/signup).
   - Tarifa única de registro de **$25 USD** (pago único de por vida, sin mensualidades).
   - Verificación de identidad con tu documento oficial.

2. **Herramientas en tu Computadora (para generar el archivo .aab)**:
   - [Node.js](https://nodejs.org/) (versión 18 o superior).
   - [Android Studio](https://developer.android.com/studio) (gratuito) con el SDK de Android instalado.

---

## 2. Empaquetado con Capacitor (Paso a Paso)

El proyecto ya cuenta con el archivo `capacitor.config.json` preconfigurado con el identificador `com.astroesquiva.spacegame`.

Para compilar el proyecto nativo en tu entorno:

### Paso 1: Instalar dependencias de Capacitor
En la terminal de tu proyecto, ejecuta:
```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
```

### Paso 2: Generar la versión de producción web
```bash
npm run build
```

### Paso 3: Inicializar la carpeta nativa de Android
```bash
npx cap add android
```
*(Este comando creará la carpeta nativa `/android` lista para Android Studio).*

### Paso 4: Sincronizar cambios futuros
Cada vez que hagas cambios en el código del juego:
```bash
npm run build
npx cap sync android
```

### Paso 5: Abrir en Android Studio
```bash
npx cap open android
```

---

## 3. Generar el Archivo Firmado (.aab) en Android Studio

Google Play requiere el formato **Android App Bundle (`.aab`)** para subir nuevas aplicaciones:

1. En Android Studio, ve al menú superior: **Build > Generate Signed Bundle / APK...**
2. Selecciona **Android App Bundle** y haz clic en **Next**.
3. En **Key store path**, crea un nuevo archivo de claves (Keystore) haciendo clic en **Create new...**:
   - Guarda tu clave en un lugar seguro y anota tu contraseña (la necesitarás para futuras actualizaciones).
   - Completa tu nombre o empresa.
4. Selecciona la variante de compilación **release**.
5. Marca la casilla **V2 (Full APK Signature)** o exportación estándar.
6. Haz clic en **Finish**.
7. Android Studio generará el archivo `app-release.aab` en la carpeta `android/app/release/`.

---

## 4. Configuración en Google Play Console

Entra a tu panel de Google Play Console y crea una nueva app:
- **Nombre de la aplicación**: `Astro Esquiva: Aventura Espacial`
- **Idioma predeterminado**: Español (o tu preferencia)
- **Tipo de aplicación**: Juego
- **Gratis o de pago**: Gratis (con compras integradas)

### A. Política de Privacidad (Obligatoria para Niños)
Google Play exige un enlace público a la política de privacidad:
- En la consola, ve a **Contenido de la aplicación > Política de Privacidad**.
- Ingresa la URL donde esté alojado tu juego (por ejemplo tu Development App URL o dominio propio).
- La aplicación ya cuenta con el modal interactivo de privacidad conforme a las directivas COPPA y GDPR-K en el botón `🛡️ Privacidad Infantil`.

### B. Sección Familias y Niños (Google Play Families Policy)
- **Público objetivo**: Selecciona los rangos de edad (ej. *6 a 8 años*, *9 a 12 años*).
- **Diseñado para Familias**: Responde "Sí" al programa de familias.
- **Anuncios**: Declara que la app **NO contiene anuncios de terceros**.
- **Compras integradas**: Indica que contiene compras virtuales con **Control Parental activo**.

### C. Seguridad de los Datos (Data Safety)
- ¿Tu aplicación recopila o comparte datos personales?: Marca **NO**.
- Toda la información de puntuación y monedas se almacena localmente en el dispositivo.

### D. Ficha de Play Store (Gráficos)
Deberás subir:
- **Icono de la app**: 512 x 512 px en formato PNG.
- **Gráfico de funciones (Banner)**: 1024 x 500 px.
- **Capturas de pantalla**: Al menos 4 capturas en vertical tomadas directamente en el juego.

---

## 5. Configuración de Pagos e In-App Products (Google Play Billing) 💳

La aplicación ya tiene integrado el servicio oficial `com.android.vending.BILLING` y cuenta con un catálogo de productos listo para importar:

### Paso 1: Configurar Cuenta de Pagos de Comerciante
1. En Google Play Console, ve a **Configuración > Cuenta de desarrollador > Pagos y cobros**.
2. Vincula o crea tu perfil de pagos de Google Merchant.

### Paso 2: Importar el Catálogo de Productos
1. En el menú lateral de tu app en Play Console, ve a **Monetización > Productos integrados en la aplicación**.
2. Haz clic en **Subir lote (Import batch)**.
3. Selecciona el archivo generado en la raíz del proyecto: `google-play-catalog.csv`.
4. El archivo registrará automáticamente los 8 artículos:
   - `astro_lives_pack_3` ($0.49 USD - Consumible)
   - `astro_shields_pack_3` ($0.49 USD - Consumible)
   - `astro_magnet_pack_2` ($0.49 USD - Consumible)
   - `iap_starter_pack` ($0.49 USD - Consumible)
   - `iap_pocket_stars` ($0.99 USD - Consumible)
   - `iap_galactic_chest` ($1.99 USD - Consumible)
   - `iap_cosmic_vault` ($3.99 USD - Consumible)
   - `astro_vip_astronaut_pass` ($3.99 USD - No consumible / Permanente)

### Paso 3: Probar los Pagos sin Cargo Real (Cuentas de Prueba de Licencia)
1. En Google Play Console, ve a **Configuración > Pruebas de licencias**.
2. Añade tu dirección de correo electrónico de Google Play.
3. Al probar el juego en tu teléfono, Google Play mostrará la tarjeta de prueba con "Respuesta de prueba: Siempre aprueba", permitiendo probar todas las compras sin cargos bancarios reales.

---

## 6. Lanzamiento y Distribución 🚀

1. Ve a **Pruebas internas** o **Producción**.
2. Crea una nueva versión (**Create new release**) y arrastra tu archivo `app-release.aab` generado en `android/app/build/outputs/bundle/release/app-release.aab`.
3. Escribe las notas de la versión:
   > *"¡Primera versión de Astro Esquiva: Aventura Espacial! Esquiva asteroides, desbloquea cohetes mágicos y compite sanamente en la tabla galáctica de récords."*
4. Haz clic en **Revisar versión** y **Enviar a revisión**.
5. La revisión de Google Play para juegos infantiles (Familias) suele tardar entre **24 y 48 horas**. ¡Una vez aprobada, tu juego estará disponible para millones de familias y niños en todo el mundo!
