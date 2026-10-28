# 🚀 Kit de Publicación y Facturación: Google Play Store
## Astro Esquiva: Aventura Espacial (`com.astroesquiva.spacegame`)

Bienvenido a la carpeta de distribución para la tienda **Google Play Store**. Aquí encontrarás todos los recursos necesarios para compilar el juego nativo en Android, configurar la monetización con Google Play Billing y pasar la revisión de Google Play sin contratiempos.

---

## 📁 Contenido de esta Carpeta (`docs/playstore/`)

| Archivo | Descripción | Uso Principal |
| :--- | :--- | :--- |
| **`guia_publicacion_playstore.md`** | Manual detallado paso a paso con capturas y comandos | Creación de cuenta, firma digital, subida del `.aab` y revisión de Google |
| **`google-play-catalog.csv`** | Catálogo oficial de compras integradas (IAP) | Importar directamente en Google Play Console > *Monetización > Productos integrados* |
| **`google-play-catalog.json`** | Especificación técnica de los productos de facturación | Integración con SDKs de Google Play Billing / Backend |
| **`AndroidManifest.xml`** | Manifiesto de Android optimizado para juegos infantiles | Configuración de permisos mínimos (`BILLING`) y pantalla vertical completa |
| **`capacitor.config.json`** | Archivo de configuración del empaquetador nativo Capacitor | Enlace entre la app web y el contenedor Android nativo |
| **`build_playstore.sh`** | Script automatizado para compilar y sincronizar | Ejecutable para generar la build web y transferirla a Android Studio |
| **`politica_privacidad.md`** | Política de privacidad oficial (COPPA y Familias) | Enlace obligatorio en la ficha de tienda y dentro de la app |

---

## ⚡ Flujo Rápido de Compilación (3 Pasos)

Si ya tienes **Android Studio** instalado en tu computadora:

```bash
# 1. Compilar y sincronizar con Android nativo
npm run build:playstore

# 2. Abrir el proyecto en Android Studio
npm run cap:open

# 3. En Android Studio:
# Menú -> Build -> Generate Signed Bundle / APK... -> Elegir "Android App Bundle (.aab)"
```

---

## 📋 Checklist de Lanzamiento en Google Play Console

- [ ] **Cuenta de Desarrollador Google Play activa** (pago de $25 USD completado).
- [ ] **Ficha Principal de la Tienda**:
  - [ ] Nombre: *Astro Esquiva: Aventura Espacial* (máx 30 caracteres).
  - [ ] Descripción corta (máx 80 caracteres).
  - [ ] Descripción completa (hasta 4000 caracteres destacando diversión familiar y sin violencia).
  - [ ] Icono de alta resolución (512 x 512 px, PNG de 32 bits).
  - [ ] Gráfico de funciones / Banner (1024 x 500 px, JPG o PNG).
  - [ ] Mínimo 4 capturas de pantalla en formato vertical (16:9 o 18:9).
- [ ] **Categoría y Clasificación de Contenido**:
  - [ ] Categoría: *Juegos > Arcade* o *Acción casual*.
  - [ ] Cuestionario IARC completado (calificación para Todo Público / PEGI 3 / ESRB Everyone).
- [ ] **Programa Google Play Familias (Designed for Families)**:
  - [ ] Público objetivo: Edades de 6 a 8 años, 9 a 12 años y más.
  - [ ] Confirmar que no se recopila información personal identificable (PII) de menores.
- [ ] **Seguridad de los Datos (Data Safety)**:
  - [ ] Indicar que la app no comparte datos con terceros y no recopila ubicación ni contactos.
  - [ ] Enlace a la Política de Privacidad pública (`politica_privacidad.md`).
- [ ] **Monetización e IAP**:
  - [ ] Catálogo importado desde `google-play-catalog.csv`.
  - [ ] Cuentas de prueba (licencias de prueba) añadidas para probar compras sandbox sin cobro real.
- [ ] **Prueba Cerrada (Track Closed Testing)**:
  - [ ] Subir el primer archivo `.aab` generado.
  - [ ] Probar en al menos un dispositivo físico Android.
  - [ ] Enviar a revisión para lanzamiento a Producción.
