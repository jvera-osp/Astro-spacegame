# 🚀 Pipeline de Despliegue Continuo con GitHub Actions & Google Play Store
**Cuenta / Correo de Publicación y Soporte:** `comasterclips@gmail.com`  
**Paquete Android:** `com.astroesquiva.spacegame`

Esta guía te permite **compilar y publicar la app "Astro Esquiva" en Google Play Store sin instalar Node.js, Java, Android Studio ni ninguna herramienta en tu computadora**. Todo el proceso se ejecuta automáticamente en los servidores de GitHub en la nube.

---

## 📋 Resumen del Pipeline

El proyecto incluye dos flujos de trabajo (workflows) de GitHub Actions listos para usar:

1. **`.github/workflows/build-apk-quick.yml` (Compilación Rápida sin Configurar Nada)**:
   - Se ejecuta en cada `push` o al presionar **"Run workflow"** en GitHub.
   - **No requiere ningún secret**.
   - Compila la web, sincroniza Capacitor, genera el archivo **`.apk`** (instalable en cualquier teléfono Android) y el archivo **`.aab`** (paquete para Google Play).
   - Los archivos quedan listos para descargar en la pestaña **Actions -> Artifacts**.

2. **`.github/workflows/deploy-playstore.yml` (Publicación Automática en Google Play)**:
   - Firma tu paquete con tu Keystore de producción oficial.
   - Sube automáticamente el `.aab` al canal de Google Play que elijas (**Pruebas Internas**, **Cerrada/Alfa**, **Abierta/Beta** o **Producción**).
   - También guarda copias descargables del `.aab` y `.apk` firmados.

---

## 🔐 Los 5 Secrets de GitHub Requeridos

Para que GitHub pueda firmar y subir la app a tu cuenta de Google Play, ve a tu repositorio en GitHub:
👉 **Settings** ➡️ **Secrets and variables** ➡️ **Actions** ➡️ **New repository secret**

Agrega los siguientes 5 secretos:

| Nombre del Secret | ¿Qué valor poner? | Ejemplo / Valor por defecto |
| :--- | :--- | :--- |
| `ANDROID_KEYSTORE_BASE64` | El archivo de firma `.jks` codificado en texto Base64. *(Si no lo configuras, el workflow generará uno seguro automáticamente)* | `MIIDVzCCAj+gAwIBAgIE...` |
| `ANDROID_KEYSTORE_PASSWORD` | Contraseña del almacén de claves (Keystore) | `AstroEsquiva2026!` |
| `ANDROID_KEY_ALIAS` | Alias de la clave de firma | `astroesquiva` |
| `ANDROID_KEY_PASSWORD` | Contraseña individual de la clave | `AstroEsquiva2026!` |
| `PLAY_STORE_JSON_KEY` | Contenido del archivo JSON de la **Cuenta de Servicio** de Google Cloud vinculada a Google Play | `{"type": "service_account", "project_id": ...}` |

---

## 🔑 Cómo Obtener la Clave de Google Play (`PLAY_STORE_JSON_KEY`) en 5 Pasos

Para que GitHub Actions tenga permiso de subir versiones a tu Google Play Console:

1. **Abrir Google Play Console**:
   - Entra en [Google Play Console](https://play.google.com/console).
   - Ve a **Configuración** (menú lateral) ➡️ **Acceso a la API**.

2. **Vincular o Seleccionar Proyecto de Google Cloud**:
   - Si no tienes uno vinculado, haz clic en **Vincular proyecto existente** o **Crear nuevo proyecto**.

3. **Crear Cuenta de Servicio**:
   - En la sección **Cuentas de servicio**, haz clic en **Crear cuenta de servicio**.
   - Haz clic en el enlace que te lleva a la **Google Cloud Console**.
   - Pulsa **+ Crear cuenta de servicio**, nómbrala `github-playstore-deployer` y haz clic en **Crear y continuar**.

4. **Asignar Rol y Descargar Llave JSON**:
   - En el rol del proyecto, selecciona **Editor de Service Account** o continúa.
   - Una vez creada, haz clic sobre la cuenta de servicio creada ➡️ Pestaña **Claves (Keys)** ➡️ **Agregar clave** ➡️ **Crear nueva clave** ➡️ Selecciona **JSON** ➡️ **Crear**.
   - Se descargará un archivo `.json` en tu PC.
   - **Abre ese archivo con un editor de texto y copia TODO su contenido** (desde `{` hasta `}`).

5. **Dar Permiso en Google Play Console**:
   - Regresa a Google Play Console (Acceso a la API).
   - Verás la nueva cuenta de servicio listada. Haz clic en **Otorgar acceso** o **Administrar permisos**.
   - En **Permisos de la app**, selecciona **Astro Esquiva** (`com.astroesquiva.spacegame`).
   - Marca: **Versiones ➡️ Crear y editar versiones de prueba y de producción**.
   - Haz clic en **Invitar usuario** / **Aplicar**.

6. **Pega el contenido del JSON en GitHub**:
   - En GitHub -> Settings -> Secrets and variables -> Actions.
   - Nombre: `PLAY_STORE_JSON_KEY`.
   - Valor: El texto JSON copiado.

---

## ⚡ Cómo Ejecutar la Compilación en GitHub

Una vez que tengas tu código en tu repositorio de GitHub:

1. Entra a tu repositorio en GitHub y haz clic en la pestaña **Actions** (en la parte superior).
2. En el menú izquierdo verás:
   - **⚡ Compilación Rápida APK y AAB (Sin Configurar Nada)**:
     - Haz clic en él ➡️ Botón **Run workflow** ➡️ **Run workflow**.
     - Espera 2 a 3 minutos.
     - Haz clic sobre la ejecución completada (en verde).
     - Al final de la página verás la sección **Artifacts** con los enlaces directos:
       - 📥 `astro-esquiva-celular-APK`: Para instalar directamente en tu celular Android.
       - 📥 `astro-esquiva-googleplay-AAB`: Para subir a Google Play Console.
   - **🚀 Compilar y Publicar en Google Play Store**:
     - Haz clic en él ➡️ Botón **Run workflow**.
     - Elige el canal (`internal` para Pruebas Internas, o `production`).
     - Haz clic en **Run workflow**.
     - GitHub Actions compilará la app, la firmará y la subirá directamente a Google Play Store sin que muevas un solo dedo.

---

## 📁 Estructura de Archivos del Pipeline

```text
├── .github/
│   └── workflows/
│       ├── build-apk-quick.yml     # Compilación automática sin credenciales (APK + AAB)
│       └── deploy-playstore.yml    # Compilación + Firma oficial + Despliegue a Google Play
├── scripts/
│   ├── setup-github-secrets.sh     # Asistente para generar keystore y variables
│   └── generate_keystore.py        # Conversor de keystore a Base64
├── docs/
│   └── GITHUB_ACTIONS_PIPELINE.md  # Esta documentación completa
└── capacitor.config.json           # Configuración nativa de Astro Esquiva
```
