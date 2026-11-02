# 📘 Guía Exhaustiva de Publicación en Google Play Store
## Astro Esquiva: Aventura Espacial (`com.astroesquiva.spacegame`)

Esta guía paso a paso describe todo el proceso técnico y administrativo necesario para publicar el juego en la tienda oficial de Google Play, configurar la facturación (Google Play Billing) y cumplir con la política infantil de Google (*Designed for Families*).

---

## Índice
1. [Requisitos y Cuenta de Desarrollador](#1-requisitos-y-cuenta-de-desarrollador)
2. [Herramientas de Desarrollo en tu Computadora](#2-herramientas-de-desarrollo-en-tu-computadora)
3. [Empaquetado Nativo con Capacitor](#3-empaquetado-nativo-con-capacitor)
4. [Generación de la Clave de Firma (.keystore)](#4-generación-de-la-clave-de-firma-keystore)
5. [Compilar el Android App Bundle (.aab)](#5-compilar-el-android-app-bundle-aab)
6. [Configuración en Google Play Console](#6-configuración-en-google-play-console)
7. [Configurar Compras Integradas (Google Play Billing)](#7-configurar-compras-integradas-google-play-billing)
8. [Cumplimiento de la Política Infantil (Familias y COPPA)](#8-cumplimiento-de-la-política-infantil-familias-y-coppa)
9. [Publicación y Revisión](#9-publicación-y-revisión)

---

## 1. Requisitos y Cuenta de Desarrollador

1. **Crear o disponer de una Cuenta de Google**:
   - Ingresa a [Google Play Console](https://play.google.com/console/signup).
2. **Pagar la Tarifa Única**:
   - Tarifa de registro de **$25 USD** (se paga una sola vez y te permite publicar apps ilimitadas de por vida).
3. **Verificación de Identidad**:
   - Google solicita verificar tu identidad mediante un documento oficial (DNI, Pasaporte o Licencia de Conducir) y un número telefónico.

---

## 2. Herramientas de Desarrollo en tu Computadora

Para compilar el proyecto en formato `.aab` o `.apk` necesitas:
* **Node.js**: Versión 18 o superior ([nodejs.org](https://nodejs.org/)).
* **Android Studio**: Última versión estable ([developer.android.com/studio](https://developer.android.com/studio)).
* **Android SDK**: Se instala automáticamente con Android Studio (mínimo Android SDK 34 o 35 recomendado).

---

## 3. Empaquetado Nativo con Capacitor

El proyecto ya incluye `@capacitor/core`, `@capacitor/cli` y `@capacitor/android`.

### Comandos de preparación:

```bash
# 1. Instalar dependencias si aún no están instaladas
npm install

# 2. Compilar la aplicación web y transferirla a Android
npm run build:playstore
```

Esto ejecuta la compilación optimizada de Vite y sincroniza todos los archivos HTML/JS/CSS dentro de la carpeta nativa `/android/app/src/main/assets/public`.

### Abrir el proyecto en Android Studio:
```bash
npm run cap:open
```

Android Studio se abrirá con el proyecto listo para compilar.

---

## 4. Generación de la Clave de Firma (.keystore)

Google Play exige que todas las aplicaciones estén firmadas digitalmente antes de subirlas.

### Opción A: Desde Android Studio (Recomendado)
1. En Android Studio, ve a **Build** > **Generate Signed Bundle / APK...**
2. Selecciona **Android App Bundle** y haz clic en **Next**.
3. En **Key store path**, haz clic en **Create new...**.
4. Define una ubicación segura (guarda una copia de seguridad en un disco externo o gestor de claves seguro).
5. Asigna una contraseña segura para el Keystore y la clave (Key).
6. Completa tu nombre de desarrollador / organización y haz clic en **OK**.

### Opción B: Mediante terminal con `keytool`
```bash
keytool -genkey -v -keystore astroesquiva-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias astroesquiva
```

> ⚠️ **IMPORTANTE**: ¡NUNCA pierdas tu archivo `.jks` ni su contraseña! Si lo pierdes, no podrás actualizar tu juego en Google Play (a menos que uses Google Play App Signing, que conserva la clave en los servidores seguros de Google).

---

## 5. Compilar el Android App Bundle (.aab)

1. En Android Studio, ve al menú: **Build** > **Generate Signed Bundle / APK...**
2. Elige **Android App Bundle** y presiona **Next**.
3. Selecciona tu archivo Keystore y escribe las contraseñas.
4. Selecciona la variante de compilación: **release**.
5. Haz clic en **Create** o **Finish**.
6. Una vez terminado, Android Studio te mostrará un mensaje emergente con la ruta del archivo generado:
   `android/app/release/app-release.aab`.

Este archivo `.aab` es el que subirás directamente a Google Play Console.

---

## 6. Configuración en Google Play Console

1. Entra a [Google Play Console](https://play.google.com/console) y presiona **Crear app**.
2. Completa los datos iniciales:
   - **Nombre de la app**: `Astro Esquiva: Aventura Espacial`
   - **Idioma predeterminado**: Español (o Inglés según tu preferencia)
   - **Tipo**: Juego
   - **Gratis o De pago**: Gratis (con compras integradas opcionales)
3. En **Ficha principal de la tienda**:
   - **Descripción corta**: *¡Esquiva meteoritos y láseres espaciales en una aventura cósmica para toda la familia!*
   - **Descripción completa**: Describe la temática espacial, controles táctiles accesibles para niños y adultos, naves desbloqueables y ausencia de violencia.
   - **Icono de la app**: 512 x 512 px (PNG 32 bits con fondo transparente o sólido).
   - **Gráfico de funciones (Banner)**: 1024 x 500 px.
   - **Capturas de pantalla para teléfono**: Mínimo 4 capturas en orientación vertical.

   Recursos preparados en `docs/playstore/`: `playstore-icon.png`, `feature-graphic.png` y `store-screenshot-01.png` a `store-screenshot-04.png`. Las capturas son de 360 x 640 px (9:16) y muestran el menú, una partida, los ajustes y la pausa; cumplen los límites del listado, pero no alcanzan los 1080 px que Google pide para participar en promociones de la ficha.

---

## 7. Configurar Compras Integradas (Google Play Billing)

La integración nativa usa Google Play Billing 8. Los productos todavía deben crearse y activarse en Play Console; sus precios que se muestran en la app se consultan desde Google Play.

### Pasos para activar los pagos en Google Play:
1. En Google Play Console, ve a **Monetización** > **Productos integrados** (In-app products).
2. Crea y activa los cinco productos indicados en `docs/playstore/google-play-catalog.json`:
   * `iap_starter_pack` (consumible)
   * `iap_pocket_stars` (consumible)
   * `iap_galactic_chest` (consumible)
   * `iap_cosmic_vault` (consumible)
   * `astro_vip_astronaut_pass` (no consumible)
3. Configura los precios definitivos y localizados directamente en Play Console. Los valores del catálogo son solo una propuesta inicial.
4. **Configurar cuentas de prueba**:
   - Ve a **Configuración** > **Pruebas de licencia**.
   - Agrega tu cuenta de Google personal (@gmail.com).
   - Cuando pruebes compras en tu dispositivo Android, Google simulará el pago exitoso sin debitar dinero de tu tarjeta de crédito.

---

## 8. Público objetivo y declaraciones

Dado que *Astro Esquiva* está pensado para toda la familia y niños:

1. **Público objetivo**: el responsable confirmó las edades de **6-8** y **9-12** años. No incluyas grupos de edad adicionales sin volver a confirmarlo.
2. **Anuncios**: el responsable confirmó que no hay anuncios. Revisa esta respuesta si se incorpora una integración de anuncios.
3. **Seguridad de los Datos**: el progreso del juego permanece en el dispositivo y no hay servidor propio ni analítica. Google Play Billing procesa pagos y puede tratar datos de compra, dispositivo y diagnóstico; responde según las divulgaciones actuales del servicio y la guía de Play Console, no afirmes que no se trata ningún dato.
4. **Política de Privacidad**: publica `public/politica_privacidad.html` en una URL HTTPS accesible y usa esa URL. No envíes una URL hasta verificar que la página está disponible públicamente.

---

## 9. Publicación y Revisión

1. Prueba cerrada: usa el track `alpha` del workflow (Prueba cerrada en Play Console) y añade los testers en Play Console.
2. Prueba abierta: usa el track `beta` del workflow (Prueba abierta en Play Console) después de revisar la prueba cerrada.
3. Producción: no selecciones `production` durante las pruebas.
4. Ve al track correspondiente y crea una nueva versión.
5. Escribe las notas de la versión:
   ```
   ¡Lanzamiento inicial de Astro Esquiva: Aventura Espacial!
   - Esquiva asteroides, ovnis amistosos y cometas.
   - Controles táctiles sencillos y divertidos.
   - Tienda de naves y personalización.
   ```
6. Revisa y envía la versión del track de prueba seleccionado. No inicies un lanzamiento a Producción desde esta guía.
