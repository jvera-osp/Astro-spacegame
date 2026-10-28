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

---

## 7. Configurar Compras Integradas (Google Play Billing)

El juego cuenta con un catálogo de productos configurado que se encuentra en `docs/playstore/google-play-catalog.csv`.

### Pasos para activar los pagos en Google Play:
1. En Google Play Console, ve a **Monetización** > **Productos integrados** (In-app products).
2. Tienes dos opciones:
   - **Opción Rápida (Importar CSV)**: Haz clic en **Importar** y selecciona el archivo `docs/playstore/google-play-catalog.csv`.
   - **Opción Manual**: Crear cada producto con los IDs:
     * `coins_100` (100 Monedas Cósmicas - Consumible - $0.99 USD)
     * `coins_500` (500 Monedas Cósmicas - Consumible - $2.99 USD)
     * `coins_1500` (1500 Monedas Cósmicas - Consumible - $6.99 USD)
     * `skin_neon_voyager` (Nave Neón Cósmica - No Consumible - $1.99 USD)
     * `skin_cosmic_dragon` (Nave Dragón Cósmico - No Consumible - $2.99 USD)
     * `remove_ads` (Eliminar Anuncios y Pase Estelar - No Consumible - $3.99 USD)
3. **Activar cada producto**: Asegúrate de que el estado figure como **Activo** (Active).
4. **Configurar cuentas de prueba**:
   - Ve a **Configuración** > **Pruebas de licencia**.
   - Agrega tu cuenta de Google personal (@gmail.com).
   - Cuando pruebes compras en tu dispositivo Android, Google simulará el pago exitoso sin debitar dinero de tu tarjeta de crédito.

---

## 8. Cumplimiento de la Política Infantil (Familias y COPPA)

Dado que *Astro Esquiva* está pensado para toda la familia y niños:

1. **Público Objetivo**:
   - Selecciona los grupos de edad: **6-8 años**, **9-12 años** y **13 años o más**.
2. **Declaración de Anuncios**:
   - En la sección de contenido de la app, declara si la app contiene anuncios. Si contiene anuncios para niños, estos deben provenir de una red publicitaria certificada por Google para familias (ej. Google AdMob con etiqueta infantil).
3. **Seguridad de los Datos (Data Safety)**:
   - Especifica que **NO recopilas información personal identificable** de menores (no se pide nombre real, dirección, teléfono ni geolocalización exacta).
4. **Enlace a la Política de Privacidad**:
   - Sube el contenido del archivo `docs/playstore/politica_privacidad.md` a un servicio web accesible públicamente (como GitHub Pages, Notion público o tu sitio web) y pega la URL en la sección *Política de Privacidad* de Google Play Console.

---

## 9. Publicación y Revisión

1. Ve a **Producción** (o **Prueba cerrada** si prefieres probar antes con amigos y familiares).
2. Crea una nueva versión (Release) y sube el archivo `app-release.aab`.
3. Escribe las notas de la versión:
   ```
   ¡Lanzamiento inicial de Astro Esquiva: Aventura Espacial!
   - Esquiva asteroides, satélites y naves extraterrestres.
   - Controles táctiles sencillos y divertidos.
   - Tienda de naves y personalización.
   - Apta y segura para toda la familia.
   ```
4. Haz clic en **Revisar versión** y luego en **Comenzar lanzamiento a Producción**.
5. El equipo de Google Play suele revisar la aplicación en un plazo de **24 a 72 horas** (las apps dirigidas a niños pasan por una revisión minuciosa para comprobar que no recopilen datos indebidos).
6. Una vez aprobada, tu juego estará disponible en todo el mundo a través de la Google Play Store. 🎉
