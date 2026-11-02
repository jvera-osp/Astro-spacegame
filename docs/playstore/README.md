# 🚀 Kit de Publicación y Facturación: Google Play Store
## Astro Esquiva: Aventura Espacial (`com.astroesquiva.spacegame`)

Bienvenido a la carpeta de distribución para la tienda **Google Play Store**. Aquí encontrarás todos los recursos necesarios para compilar el juego nativo en Android, configurar la monetización con Google Play Billing y pasar la revisión de Google Play sin contratiempos.

---

## 📁 Contenido de esta Carpeta (`docs/playstore/`)

| Archivo | Descripción | Uso Principal |
| :--- | :--- | :--- |
| **`guia_publicacion_playstore.md`** | Manual detallado paso a paso con capturas y comandos | Creación de cuenta, firma digital, subida del `.aab` y revisión de Google |
| **`google-play-catalog.csv`** | Borrador de catálogo de compras | Contrastar con la plantilla de importación vigente de Play Console antes de importar |
| **`google-play-catalog.json`** | Especificación técnica de los cinco productos usados por la app | Referencia para la integración nativa Google Play Billing |
| **`AndroidManifest.xml`** | Manifiesto de Android optimizado para juegos infantiles | Configuración de permisos mínimos (`BILLING`) y pantalla vertical completa |
| **`capacitor.config.json`** | Archivo de configuración del empaquetador nativo Capacitor | Enlace entre la app web y el contenedor Android nativo |
| **`build_playstore.sh`** | Script automatizado para compilar y sincronizar | Ejecutable para generar la build web y transferirla a Android Studio |
| **`politica_privacidad.md`** | Política de privacidad alineada con las prácticas actuales | Revisar y publicar en una URL HTTPS antes de enviar declaraciones |

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
  - [ ] Público objetivo: Edades de 6 a 8 y de 9 a 12 años (confirmado por el responsable).
  - [ ] Revisar el tratamiento de Google Play Billing antes de completar las declaraciones.
- [ ] **Seguridad de los Datos (Data Safety)**:
  - [ ] Confirmar las respuestas actuales con las divulgaciones de Google Play Billing.
  - [ ] Publicar y enlazar la página HTML de política de privacidad (`/politica_privacidad.html`).
  - [ ] Nota: GitHub Pages no está disponible para este repositorio privado con el plan actual; cambiar la visibilidad, el plan o elegir otro alojamiento antes de enviar la URL.
- [ ] **Monetización e IAP**:
  - [ ] Crear los cinco productos de `google-play-catalog.json` y fijar sus precios en Play Console.
  - [ ] Verificar cada SKU en una compra de prueba antes de publicar pruebas abiertas o cerradas.
  - [ ] Cuentas de prueba (licencias de prueba) añadidas para probar compras sandbox sin cobro real.
- [ ] **Prueba Cerrada (Track Closed Testing)**:
  - [ ] Publicar en el track `alpha` (prueba cerrada) y añadir el grupo/correos de testers en Play Console.
  - [ ] Probar en al menos un dispositivo físico Android.
  - [ ] Enviar a revisión para lanzamiento a Producción.
- [ ] **Prueba Abierta (Track Open Testing)**:
  - [ ] Publicar en el track `beta` (prueba abierta), solo después de validar la prueba cerrada y las declaraciones de Play Console.
