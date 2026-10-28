# Plan de Implementación: Paquete de Publicación y Facturación Google Play (`docs/playstore`)

Organización y generación de todos los recursos, documentación técnica, catálogo de facturación (Google Play Billing), manifiesto Android optimizado para juegos infantiles y scripts automatizados de compilación dentro del directorio solicitado `docs/playstore`.

---

## 1. Estructura de Archivos a Generar en `docs/playstore`

Se creará la carpeta centralizada `/docs/playstore/` con los siguientes elementos modulares:

1. **`README.md` (Checklist de Lanzamiento)**:
   - Resumen ejecutivo de los pasos para lanzar en Google Play Console.
   - Lista de verificación previa al envío a revisión (revisión de políticas familiares, claves de firma, IAP activos).

2. **`guia_publicacion_playstore.md` (Guía Paso a Paso)**:
   - Creación de cuenta de desarrollador Google Play ($25 USD).
   - Generación de Keystore de firma segura (`keytool` / Android Studio).
   - Compilación del Android App Bundle (`.aab`) y APK de prueba.
   - Configuración de la ficha de tienda: capturas, icono 512x512, descripción corta y completa.
   - Programa Designed for Families (Políticas de Familias de Google Play y COPPA).

3. **`google-play-catalog.csv` (Catálogo para Importación Directa)**:
   - Archivo CSV con formato oficial de Google Play Console para importar en **Monetización > Productos integrados**:
     * `coins_100` (Consumible - 100 Monedas Estelares)
     * `coins_500` (Consumible - 500 Monedas Estelares)
     * `coins_1500` (Consumible - 1500 Monedas Estelares)
     * `skin_neon_voyager` (No consumible - Nave Neón Especial)
     * `skin_cosmic_dragon` (No consumible - Dragón Cósmico Mítico)
     * `remove_ads` (No consumible - Eliminar Anuncios y Pase Estelar)

4. **`google-play-catalog.json` (Especificación Técnica de Facturación)**:
   - Metadata de los productos, tipos de compra (In-App Consumable vs One-Time Non-Consumable), precios base en USD y notas de integración para la API de Google Play Billing Library.

5. **`AndroidManifest.xml` (Manifiesto de Referencia Android)**:
   - Manifiesto configurado con:
     * `com.android.vending.BILLING` para compras integradas.
     * Orientación fija `portrait` y pantalla completa.
     * Ausencia deliberada de permisos invasivos de ubicación o rastreo (requisito indispensable de Google Play Families).

6. **`capacitor.config.json` (Configuración de Empaquetado)**:
   - Configuración lista con App ID `com.astroesquiva.spacegame`, nombre de aplicación, rutas de build y esquemas seguros.

7. **`build_playstore.sh` (Script Automatizado de Compilación)**:
   - Script Bash con permisos de ejecución para compilar el proyecto (`npm run build`), sincronizar Capacitor (`npx cap sync android`) y orientar la apertura de Android Studio (`npx cap open android`).

8. **`politica_privacidad.md` (Política de Privacidad para Google Play Families)**:
   - Texto legal completo listo para publicar en GitHub Pages, Google Sites o Notion, cumpliendo con la sección de Seguridad de los Datos (Data Safety) y requisitos de apps para niños.

---

## 2. Actualización de Scripts en `package.json`

- Añadir atajos npm prácticos:
  * `"cap:sync"`: `npm run build && npx cap sync android`
  * `"cap:open"`: `npx cap open android`
  * `"build:playstore"`: `npm run build && npx cap sync android`

---

## 3. Plan de Verificación

1. **Verificación de archivos y rutas**:
   - Confirmar que todos los archivos se creen en `/docs/playstore/`.
   - Verificar integridad del CSV y sintaxis del JSON y XML.
2. **Validación de compilación del proyecto**:
   - Ejecutar `compile_applet` y `lint_applet` para garantizar que la app siga construyendo con cero errores y total compatibilidad.
3. **Comprobación del Hub dentro del juego**:
   - Asegurarse de que el panel de desarrollador y las opciones de prueba continúen sincronizados con estos archivos.
